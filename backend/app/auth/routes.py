from flask import request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app import db
from app.models import User
from app.auth import auth_bp
from datetime import datetime
import re

def validate_email(email):
    """验证邮箱格式"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """验证密码强度"""
    # 至少8位，包含字母和数字
    if len(password) < 8:
        return False, "密码长度至少8位"
    if not re.search(r'[a-zA-Z]', password):
        return False, "密码必须包含字母"
    if not re.search(r'\d', password):
        return False, "密码必须包含数字"
    return True, ""

@auth_bp.route('/register', methods=['POST'])
def register():
    """用户注册"""
    try:
        data = request.get_json()
        
        # 参数校验
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        display_name = data.get('display_name', '').strip()
        
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
            display_name=display_name or username
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # 生成token (将用户ID转为字符串)
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        
        return jsonify({
            'code': 201,
            'message': '注册成功',
            'data': {
                'user': user.to_dict(),
                'access_token': access_token,
                'refresh_token': refresh_token
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'code': 500,
            'message': f'注册失败: {str(e)}'
        }), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """用户登录"""
    try:
        data = request.get_json()
        
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        if not username or not password:
            return jsonify({
                'code': 400,
                'message': '用户名和密码不能为空'
            }), 400
        
        # 查找用户（支持用户名或邮箱登录）
        user = User.query.filter(
            (User.username == username) | (User.email == username)
        ).first()
        
        if not user or not user.check_password(password):
            return jsonify({
                'code': 401,
                'message': '用户名或密码错误'
            }), 401
        
        if user.status != 1:
            return jsonify({
                'code': 401,
                'message': '账户已被禁用'
            }), 401
        
        # 更新最后登录时间
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # 生成token (将用户ID转为字符串)
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        
        return jsonify({
            'code': 200,
            'message': '登录成功',
            'data': {
                'user': user.to_dict(),
                'access_token': access_token,
                'refresh_token': refresh_token
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'code': 500,
            'message': f'登录失败: {str(e)}'
        }), 500


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """用户登出"""
    # JWT是无状态的，这里只是返回成功
    # 如果需要黑名单机制，需要额外的存储
    return jsonify({
        'code': 200,
        'message': '登出成功'
    }), 200


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """刷新access token"""
    try:
        current_user_id = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user_id)
        
        return jsonify({
            'code': 200,
            'message': 'Token刷新成功',
            'data': {
                'access_token': new_access_token
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'code': 500,
            'message': f'Token刷新失败: {str(e)}'
        }), 500


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """获取当前用户信息"""
    try:
        current_user_id = get_jwt_identity()
        # 将字符串ID转回整数
        user = User.query.get(int(current_user_id))
        
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
            'message': f'获取用户信息失败: {str(e)}'
        }), 500
