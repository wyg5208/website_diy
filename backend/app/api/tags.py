from flask import request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import Tag
from app.api import api_bp

@api_bp.route('/tags', methods=['GET'])
def get_tags():
    """获取标签列表"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '').strip()
        
        query = Tag.query
        
        if search:
            query = query.filter(Tag.name.contains(search))
        
        pagination = query.order_by(Tag.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        tags = pagination.items
        
        return jsonify({
            'code': 200,
            'message': '获取成功',
            'data': {
                'items': [tag.to_dict() for tag in tags],
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
            'message': f'获取标签失败: {str(e)}'
        }), 500


@api_bp.route('/tags', methods=['POST'])
@jwt_required()
def create_tag():
    """创建标签"""
    try:
        data = request.get_json()
        
        name = data.get('name', '').strip()
        if not name:
            return jsonify({
                'code': 400,
                'message': '标签名称不能为空'
            }), 400
        
        # 检查名称是否已存在
        if Tag.query.filter_by(name=name).first():
            return jsonify({
                'code': 400,
                'message': '标签名称已存在'
            }), 400
        
        # 生成slug
        slug = data.get('slug') or name.lower().replace(' ', '-')
        if Tag.query.filter_by(slug=slug).first():
            return jsonify({
                'code': 400,
                'message': '标签别名已存在'
            }), 400
        
        tag = Tag(
            name=name,
            slug=slug
        )
        
        db.session.add(tag)
        db.session.commit()
        
        return jsonify({
            'code': 201,
            'message': '创建成功',
            'data': tag.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'code': 500,
            'message': f'创建标签失败: {str(e)}'
        }), 500


@api_bp.route('/tags/<int:id>', methods=['PUT'])
@jwt_required()
def update_tag(id):
    """更新标签"""
    try:
        tag = Tag.query.get_or_404(id)
        data = request.get_json()
        
        if 'name' in data:
            name = data['name'].strip()
            if name and name != tag.name:
                if Tag.query.filter(Tag.name == name, Tag.id != id).first():
                    return jsonify({
                        'code': 400,
                        'message': '标签名称已存在'
                    }), 400
                tag.name = name
        
        if 'slug' in data:
            slug = data['slug'].strip()
            if slug and slug != tag.slug:
                if Tag.query.filter(Tag.slug == slug, Tag.id != id).first():
                    return jsonify({
                        'code': 400,
                        'message': '标签别名已存在'
                    }), 400
                tag.slug = slug
        
        db.session.commit()
        
        return jsonify({
            'code': 200,
            'message': '更新成功',
            'data': tag.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'code': 500,
            'message': f'更新标签失败: {str(e)}'
        }), 500


@api_bp.route('/tags/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_tag(id):
    """删除标签"""
    try:
        tag = Tag.query.get_or_404(id)
        
        # 检查是否有文章使用此标签
        if tag.posts:
            return jsonify({
                'code': 400,
                'message': '该标签已被文章使用，不能删除'
            }), 400
        
        db.session.delete(tag)
        db.session.commit()
        
        return jsonify({
            'code': 200,
            'message': '删除成功'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'code': 500,
            'message': f'删除标签失败: {str(e)}'
        }), 500
