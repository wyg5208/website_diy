from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import api_bp
from app import db
from app.models import SiteSetting

@api_bp.route('/settings/<key_name>', methods=['GET'])
def get_setting(key_name):
    """获取站点配置（公开接口）"""
    setting = SiteSetting.query.filter_by(key_name=key_name).first()
    if not setting:
        return jsonify({
            'code': 404,
            'message': '配置不存在',
            'data': None
        }), 404
    
    return jsonify({
        'code': 200,
        'message': 'success',
        'data': setting.to_dict()
    })


@api_bp.route('/settings/<key_name>', methods=['PUT'])
@jwt_required()
def update_setting(key_name):
    """更新站点配置（需要登录）"""
    data = request.get_json()
    
    if 'value' not in data:
        return jsonify({
            'code': 400,
            'message': '缺少 value 字段'
        }), 400
    
    setting = SiteSetting.set_value(
        key_name=key_name,
        value=data['value'],
        description=data.get('description'),
        group_name=data.get('group_name', 'page')
    )
    
    return jsonify({
        'code': 200,
        'message': '保存成功',
        'data': setting.to_dict()
    })


@api_bp.route('/settings', methods=['GET'])
@jwt_required()
def list_settings():
    """获取所有配置（需要登录）"""
    group = request.args.get('group')
    
    query = SiteSetting.query
    if group:
        query = query.filter_by(group_name=group)
    
    settings = query.all()
    
    return jsonify({
        'code': 200,
        'message': 'success',
        'data': [s.to_dict() for s in settings]
    })


# ============ 页面配置专用接口 ============

@api_bp.route('/pages/home', methods=['GET'])
def get_home_page():
    """获取首页配置（公开接口）"""
    setting = SiteSetting.query.filter_by(key_name='page_home').first()
    
    if not setting or not setting.value:
        # 返回默认空配置
        return jsonify({
            'code': 200,
            'message': 'success',
            'data': {
                'name': '首页',
                'components': [],
                'templateId': None
            }
        })
    
    return jsonify({
        'code': 200,
        'message': 'success',
        'data': setting.value
    })


@api_bp.route('/pages/home', methods=['PUT'])
@jwt_required()
def save_home_page():
    """保存首页配置（需要登录）"""
    data = request.get_json()
    
    if not data:
        return jsonify({
            'code': 400,
            'message': '请求数据为空'
        }), 400
    
    # 保存页面配置
    setting = SiteSetting.set_value(
        key_name='page_home',
        value=data,
        description='首页组件配置',
        group_name='page'
    )
    
    return jsonify({
        'code': 200,
        'message': '首页配置保存成功',
        'data': setting.to_dict()
    })


@api_bp.route('/pages/<page_key>', methods=['GET'])
def get_page_config(page_key):
    """获取指定页面配置（公开接口）"""
    setting = SiteSetting.query.filter_by(key_name=f'page_{page_key}').first()
    
    if not setting or not setting.value:
        # 页面不存在时返回空配置，而不是 404
        return jsonify({
            'code': 200,
            'message': 'success',
            'data': {
                'name': page_key,
                'components': [],
                'templateId': None
            }
        })
    
    return jsonify({
        'code': 200,
        'message': 'success',
        'data': setting.value
    })


@api_bp.route('/pages/<page_key>', methods=['PUT'])
@jwt_required()
def save_page_config(page_key):
    """保存指定页面配置（需要登录）"""
    data = request.get_json()
    
    if not data:
        return jsonify({
            'code': 400,
            'message': '请求数据为空'
        }), 400
    
    setting = SiteSetting.set_value(
        key_name=f'page_{page_key}',
        value=data,
        description=f'{page_key}页面配置',
        group_name='page'
    )
    
    return jsonify({
        'code': 200,
        'message': '页面配置保存成功',
        'data': setting.to_dict()
    })
