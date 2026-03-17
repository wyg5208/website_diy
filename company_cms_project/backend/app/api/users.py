from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User
from app.api import api_bp
from datetime import datetime
import re

def validate_email(email):
    """验证邮箱格式"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """验证密码强度"""
    if len(password) < 8:
        return False, "密码长度至少 8 位"
    if not re.search(r'[a-zA-Z]', password):
        return False, "密码必须包含字母"
    if not re.search(r'\d', password):
        return False, "密码必须包含数字"
    return True, ""

@api_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    """获取用户列表"""
    try:
        # 获取分页参数
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # 获取筛选参数
        status = request.args.get('status', type=int)
        keyword = request.args.get('keyword', '')
        
        # 构建查询
        query = User.query
        
        if keyword:
            query = query.filter(
                (User.username.like(f'%{keyword}%')) |
                (User.email.like(f'%{keyword}%')) |
                (User.display_name.like(f'%{keyword}%'))
            )
        
        if status is not None:
            query = query.filter(User.status == status)
        
        # 排序（按创建时间倒序）
        query = query.order_by(User.created_at.desc())
        
        # 分页
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        users = pagination.items
        
        return jsonify({
            'code': 200,
            'message': '获取成功',
            'data': {
                'items': [user.to_dict() for user in users],
                'total': pagination.total,
                'page': page,
                'per_page': per_page,
                'pages': pagination.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'code': 500,
            'message': f'获取用户列表失败：{str(e)}'
        }), 500


@api_bp.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    """获取单个用户详情"""
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({
                'code': 404,
                'message': '用户不存在'
            }), 404
        
        return jsonify({
            'code': 200,
            'message': '获取成功',
            'data': {
                'user': user.to_dict()
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'code': 500,
            'message': f'获取用户详情失败：{str(e)}'
        }), 500


@api_bp.route('/users', methods=['POST'])
@jwt_required()
def create_user():
    """创建新用户"""
    try:
        data = request.get_json()
        
        # 参数校验
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        display_name = data.get('display_name', '').strip()
        avatar = data.get('avatar', '')
        
        if not username or not email or not password:
            return jsonify({
                'code': 400,
                'message': '用户名、邮箱和密码不能为空'
            }), 400
        
        # 验证邮箱格式
        if not validate_email(email):
            return jsonify({
                'code': 400,
                'message': '邮箱格式不正确'
            }), 400
        
        # 验证密码强度
        is_valid, msg = validate_password(password)
        if not is_valid:
            return jsonify({
                'code': 400,
                'message': msg
            }), 400
        
        # 检查用户名是否已存在
        if User.query.filter_by(username=username).first():
            return jsonify({
                'code': 400,
                'message': '用户名已存在'
            }), 400
        
        # 检查邮箱是否已存在
        if User.query.filter_by(email=email).first():
            return jsonify({
                'code': 400,
                'message': '邮箱已被注册'
            }), 400
        
        # 创建用户
        user = User(
            username=username,
            email=email,
            display_name=display_name or username,
            avatar=avatar,
            status=data.get('status', 1)
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'code': 201,
            'message': '用户创建成功',
            'data': {
                'user': user.to_dict()
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'code': 500,
            'message': f'创建用户失败：{str(e)}'
        }), 500


@api_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    """更新用户信息"""
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({
                'code': 404,
                'message': '用户不存在'
            }), 404
        
        data = request.get_json()
        
        # 更新字段
        if 'display_name' in data:
            user.display_name = data['display_name'].strip()
        if 'avatar' in data:
            user.avatar = data['avatar']
        if 'status' in data:
            user.status = data['status']
        if 'email' in data:
            new_email = data['email'].strip()
            # 检查邮箱是否已被其他用户使用
            existing_user = User.query.filter_by(email=new_email).first()
            if existing_user and existing_user.id != user_id:
                return jsonify({
                    'code': 400,
                    'message': '邮箱已被其他用户使用'
                }), 400
            user.email = new_email
        
        # 如果提供了密码，则更新密码
        if 'password' in data and data['password']:
            is_valid, msg = validate_password(data['password'])
            if not is_valid:
                return jsonify({
                    'code': 400,
                    'message': msg
                }), 400
            user.set_password(data['password'])
        
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'code': 200,
            'message': '用户更新成功',
            'data': {
                'user': user.to_dict()
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'code': 500,
            'message': f'更新用户失败：{str(e)}'
        }), 500


@api_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    """删除用户"""
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({
                'code': 404,
                'message': '用户不存在'
            }), 404
        
        # 不允许删除自己
        current_user_id = get_jwt_identity()
        if str(user_id) == current_user_id:
            return jsonify({
                'code': 400,
                'message': '不能删除当前登录的用户'
            }), 400
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({
            'code': 200,
            'message': '用户删除成功'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'code': 500,
            'message': f'删除用户失败：{str(e)}'
        }), 500


@api_bp.route('/users/<int:user_id>/reset-password', methods=['POST'])
@jwt_required()
def reset_password(user_id):
    """重置用户密码"""
    try:
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({
                'code': 404,
                'message': '用户不存在'
            }), 404
        
        data = request.get_json()
        new_password = data.get('password', '')
        
        if not new_password:
            return jsonify({
                'code': 400,
                'message': '新密码不能为空'
            }), 400
        
        # 验证密码强度
        is_valid, msg = validate_password(new_password)
        if not is_valid:
            return jsonify({
                'code': 400,
                'message': msg
            }), 400
        
        user.set_password(new_password)
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'code': 200,
            'message': '密码重置成功'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'code': 500,
            'message': f'重置密码失败：{str(e)}'
        }), 500
