import os
import uuid
from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from PIL import Image
from app import db
from app.models import Media, User
from app.api import api_bp

def allowed_file(filename):
    """检查文件扩展名是否允许"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

def get_file_info(filepath):
    """获取文件信息"""
    if not os.path.exists(filepath):
        return None, None, None
    
    stat = os.stat(filepath)
    size = stat.st_size
    
    # 如果是图片，获取宽高
    width = None
    height = None
    try:
        with Image.open(filepath) as img:
            width, height = img.size
    except:
        pass  # 不是图片文件
    
    return size, width, height

@api_bp.route('/media', methods=['GET'])
def get_media_list():
    """获取媒体文件列表"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        mime_type = request.args.get('mime_type', '').strip()
        search = request.args.get('search', '').strip()
        
        query = Media.query
        
        if mime_type:
            query = query.filter(Media.mime_type.like(f'{mime_type}%'))
        
        if search:
            query = query.filter(Media.filename.contains(search) | Media.title.contains(search))
        
        pagination = query.order_by(Media.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        media_items = pagination.items
        
        return jsonify({
            'code': 200,
            'message': '获取成功',
            'data': {
                'items': [item.to_dict() for item in media_items],
                'pagination': {
                    'page': page,
                    'per_page': per_page,
                    'total': pagination.total,
                    'pages': pagination.pages
                }
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'code': 500,
            'message': f'获取媒体列表失败: {str(e)}'
        }), 500


@api_bp.route('/media/upload', methods=['POST'])
@jwt_required()
def upload_file():
    """上传文件"""
    try:
        current_user_id = get_jwt_identity()
        
        # 检查是否有文件
        if 'file' not in request.files:
            return jsonify({
                'code': 400,
                'message': '没有选择文件'
            }), 400
        
        file = request.files['file']
        
        # 检查文件名
        if file.filename == '':
            return jsonify({
                'code': 400,
                'message': '文件名不能为空'
            }), 400
        
        if not file or not allowed_file(file.filename):
            return jsonify({
                'code': 400,
                'message': '不允许的文件类型'
            }), 400
        
        # 生成安全的文件名
        filename = secure_filename(file.filename)
        # 添加UUID避免重名
        name, ext = os.path.splitext(filename)
        unique_filename = f"{uuid.uuid4().hex}_{name}{ext}"
        
        # 按年月创建目录
        from datetime import datetime
        now = datetime.now()
        year_month = now.strftime('%Y/%m')
        upload_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], year_month)
        os.makedirs(upload_dir, exist_ok=True)
        
        # 保存文件
        filepath = os.path.join(upload_dir, unique_filename)
        file.save(filepath)
        
        # 获取文件信息
        file_size, width, height = get_file_info(filepath)
        
        # 生成相对路径和URL
        relative_path = os.path.join(year_month, unique_filename).replace('\\', '/')
        file_url = f"/media/{relative_path}"
        
        # 创建媒体记录
        media = Media(
            filename=unique_filename,
            original_name=file.filename,
            file_path=relative_path,
            file_url=file_url,
            mime_type=file.content_type,
            file_size=file_size,
            width=width,
            height=height,
            title=request.form.get('title', ''),
            alt_text=request.form.get('alt_text', ''),
            description=request.form.get('description', ''),
            uploader_id=current_user_id
        )
        
        db.session.add(media)
        db.session.commit()
        
        return jsonify({
            'code': 201,
            'message': '上传成功',
            'data': media.to_dict()
        }), 201
        
    except Exception as e:
        # 如果保存失败，删除已上传的文件
        if 'filepath' in locals() and os.path.exists(filepath):
            os.remove(filepath)
        
        db.session.rollback()
        return jsonify({
            'code': 500,
            'message': f'上传失败: {str(e)}'
        }), 500


@api_bp.route('/media/<int:id>', methods=['GET'])
def get_media(id):
    """获取媒体文件详情"""
    try:
        media = Media.query.get_or_404(id)
        return jsonify({
            'code': 200,
            'message': '获取成功',
            'data': media.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'code': 500,
            'message': f'获取媒体详情失败: {str(e)}'
        }), 500


@api_bp.route('/media/<int:id>', methods=['PUT'])
@jwt_required()
def update_media(id):
    """更新媒体文件信息"""
    try:
        media = Media.query.get_or_404(id)
        data = request.get_json()
        
        if 'title' in data:
            media.title = data['title']
        
        if 'alt_text' in data:
            media.alt_text = data['alt_text']
        
        if 'description' in data:
            media.description = data['description']
        
        db.session.commit()
        
        return jsonify({
            'code': 200,
            'message': '更新成功',
            'data': media.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'code': 500,
            'message': f'更新媒体信息失败: {str(e)}'
        }), 500


@api_bp.route('/media/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_media(id):
    """删除媒体文件"""
    try:
        media = Media.query.get_or_404(id)
        
        # 删除物理文件
        file_full_path = os.path.join(current_app.config['UPLOAD_FOLDER'], media.file_path)
        if os.path.exists(file_full_path):
            os.remove(file_full_path)
        
        # 删除数据库记录
        db.session.delete(media)
        db.session.commit()
        
        return jsonify({
            'code': 200,
            'message': '删除成功'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'code': 500,
            'message': f'删除媒体文件失败: {str(e)}'
        }), 500
