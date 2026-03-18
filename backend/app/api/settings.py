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
    
    setting_data = SiteSetting.set_value(
        key_name=key_name,
        value=data['value'],
        description=data.get('description'),
        group_name=data.get('group_name', 'page')
    )
    
    return jsonify({
        'code': 200,
        'message': '保存成功',
        'data': setting_data  # set_value 已经返回字典
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
    setting_data = SiteSetting.set_value(
        key_name='page_home',
        value=data,
        description='首页组件配置',
        group_name='page'
    )
    
    return jsonify({
        'code': 200,
        'message': '首页配置保存成功',
        'data': setting_data  # set_value 已经返回字典
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
    
    setting_data = SiteSetting.set_value(
        key_name=f'page_{page_key}',
        value=data,
        description=f'{page_key}页面配置',
        group_name='page'
    )
    
    return jsonify({
        'code': 200,
        'message': '页面配置保存成功',
        'data': setting_data  # set_value 已经返回字典
    })


# ============ 底栏配置专用接口 ============

@api_bp.route('/settings/logo', methods=['GET'])
def get_logo_config():
    """获取 LOGO 配置（公开接口）"""
    setting = SiteSetting.query.filter_by(key_name='logo_config').first()
    
    if not setting or not setting.value:
        # 返回默认 LOGO 配置
        default_logo = {
            'enabled': True,
            'displayMode': 'textAndImage',  # textOnly, imageOnly, textAndImage
            'logoImage': '',  # LOGO 图片 URL
            'logoImageWidth': 40,  # 图片宽度 (px)
            'logoImageHeight': 40,  # 图片高度 (px)
            'logoText': 'CORP',  # LOGO 文字
            'logoSubText': 'CMS',  # LOGO 副标题/后缀文字
            'textColor': '#1890ff',  # 主文字颜色
            'subTextColor': '#001529',  # 副标题文字颜色
            'fontSize': 22,  # 主文字大小 (px)
            'subFontSize': 22,  # 副标题文字大小 (px)
            'fontWeight': 800,  # 文字粗细
            'letterSpacing': 1,  # 文字间距
            'imageGap': 12,  # 图片与文字间距 (px)
            'linkUrl': '/'  # LOGO 点击跳转链接
        }
        return jsonify({
            'code': 200,
            'message': 'success',
            'data': default_logo
        })
    
    # 统一返回格式：data 字段直接是配置值
    return jsonify({
        'code': 200,
        'message': 'success',
        'data': setting.value
    })


@api_bp.route('/settings/logo', methods=['PUT'])
@jwt_required()
def update_logo_config():
    """更新 LOGO 配置（需要登录）"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'code': 400,
                'message': '请求数据为空'
            }), 400
        
        # 验证必要字段
        required_fields = ['enabled', 'displayMode']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'code': 400,
                    'message': f'缺少必需字段：{field}'
                }), 400
        
        print(f"=== 准备保存 LOGO 配置 ===")
        print(f"接收到的数据：{data}")
        print(f"当前数据库会话状态：{db.session}")
        
        setting_data = SiteSetting.set_value(
            key_name='logo_config',
            value=data,
            description='网站 LOGO 配置',
            group_name='appearance'
        )
        
        print(f"=== LOGO 配置已保存 ===")
        print(f"保存的 ID: {setting_data['id']}")
        print(f"保存的键名：{setting_data['key_name']}")
        print(f"保存的值：{setting_data['value']}")
        print(f"保存后的会话状态：{db.session}")
        
        # 统一返回格式：data 字段直接是配置值，与 GET 接口保持一致
        return jsonify({
            'code': 200,
            'message': 'LOGO 配置保存成功',
            'data': setting_data['value']  # 直接返回配置值
        })
    except Exception as e:
        print(f"=== 保存 LOGO 配置时发生错误：{str(e)} ===")
        import traceback
        traceback.print_exc()
        return jsonify({'code': 500, 'message': f'保存失败：{str(e)}'}), 500


@api_bp.route('/settings/footer', methods=['GET'])
def get_footer_config():
    """获取底栏配置（公开接口）"""
    setting = SiteSetting.query.filter_by(key_name='footer_config').first()
    
    if not setting or not setting.value:
        # 返回默认底栏配置
        default_footer = {
            'enabled': True,
            'height': 200,
            'backgroundColor': '#001529',
            'textColor': 'rgba(255,255,255,0.45)',
            'title': 'CORPCMS 企业内容管理平台',
            'description': '专业的 Python 后端与现代 React 前端技术栈，为您的企业品牌保驾护航',
            'copyright': '©2026 Created by Qoder | 工业级解决方案',
            'elements': [
                {
                    'id': 'title-element',
                    'type': 'text',
                    'content': 'CORPCMS 企业内容管理平台',
                    'style': {'fontSize': '18px', 'fontWeight': 'bold', 'color': '#ffffff', 'marginBottom': '20px'}
                },
                {
                    'id': 'desc-element',
                    'type': 'text',
                    'content': '专业的 Python 后端与现代 React 前端技术栈，为您的企业品牌保驾护航',
                    'style': {'color': 'rgba(255,255,255,0.45)', 'marginBottom': '20px'}
                },
                {
                    'id': 'divider-element',
                    'type': 'divider',
                    'style': {'borderColor': 'rgba(255,255,255,0.1)', 'margin': '20px 0'}
                },
                {
                    'id': 'copyright-element',
                    'type': 'text',
                    'content': '©2026 Created by Qoder | 工业级解决方案',
                    'style': {'color': 'rgba(255,255,255,0.45)', 'fontSize': '14px'}
                }
            ]
        }
        return jsonify({
            'code': 200,
            'message': 'success',
            'data': default_footer
        })
    
    # 统一返回格式：data 字段直接是配置值
    return jsonify({
        'code': 200,
        'message': 'success',
        'data': setting.value
    })


@api_bp.route('/settings/footer', methods=['PUT'])
@jwt_required()
def update_footer_config():
    """更新底栏配置（需要登录）"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'code': 400,
                'message': '请求数据为空'
            }), 400
        
        # 验证必要字段
        required_fields = ['enabled', 'height', 'backgroundColor']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'code': 400,
                    'message': f'缺少必需字段：{field}'
                }), 400
        
        setting_data = SiteSetting.set_value(
            key_name='footer_config',
            value=data,
            description='网站底栏配置',
            group_name='appearance'
        )
        
        # 统一返回格式：data 字段直接是配置值，与 GET 接口保持一致
        return jsonify({
            'code': 200,
            'message': '底栏配置保存成功',
            'data': setting_data['value']  # 直接返回配置值
        })
    except Exception as e:
        print(f"=== 保存配置时发生错误：{str(e)} ===")
        import traceback
        traceback.print_exc()
        return jsonify({'code': 500, 'message': f'保存失败：{str(e)}'}), 500
