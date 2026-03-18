from flask import request, jsonify
from flask_jwt_extended import jwt_required
from . import api_bp
from app import db
from app.models import SiteSetting
from datetime import datetime
import uuid

# 默认菜单配置
DEFAULT_MENUS = [
    {
        'id': 'home',
        'title': '网站首页',
        'path': '/',
        'pageKey': 'home',
        'order': 1,
        'visible': True,
        'isSystem': True,
    },
    {
        'id': 'solutions',
        'title': '解决方案',
        'path': '/solutions',
        'pageKey': 'solutions',
        'order': 2,
        'visible': True,
        'isSystem': False,
    },
    {
        'id': 'cases',
        'title': '成功案例',
        'path': '/cases',
        'pageKey': 'cases',
        'order': 3,
        'visible': True,
        'isSystem': False,
    },
    {
        'id': 'about',
        'title': '关于我们',
        'path': '/about',
        'pageKey': 'about',
        'order': 4,
        'visible': True,
        'isSystem': False,
    },
]


def get_menu_config():
    """获取菜单配置"""
    setting = SiteSetting.query.filter_by(key_name='site_menus').first()
    if not setting or not setting.value:
        return {'items': DEFAULT_MENUS, 'updatedAt': datetime.utcnow().isoformat()}
    return setting.value


def save_menu_config(config):
    """保存菜单配置"""
    config['updatedAt'] = datetime.utcnow().isoformat()
    SiteSetting.set_value(
        key_name='site_menus',
        value=config,
        description='网站导航菜单配置',
        group_name='site'
    )
    return config


@api_bp.route('/menus', methods=['GET'])
def get_menus():
    """获取菜单列表（公开接口）"""
    config = get_menu_config()
    # 按 order 排序
    items = sorted(config.get('items', []), key=lambda x: x.get('order', 0))
    
    return jsonify({
        'code': 200,
        'message': 'success',
        'data': {
            'items': items,
            'updatedAt': config.get('updatedAt')
        }
    })


@api_bp.route('/menus', methods=['PUT'])
@jwt_required()
def save_menus():
    """批量保存菜单配置（需要登录）"""
    data = request.get_json()
    
    if not data or 'items' not in data:
        return jsonify({
            'code': 400,
            'message': '请求数据格式错误'
        }), 400
    
    config = save_menu_config({'items': data['items']})
    
    return jsonify({
        'code': 200,
        'message': '菜单配置保存成功',
        'data': config
    })


@api_bp.route('/menus', methods=['POST'])
@jwt_required()
def add_menu():
    """添加菜单项（需要登录）"""
    data = request.get_json()
    
    if not data or not data.get('title') or not data.get('path'):
        return jsonify({
            'code': 400,
            'message': '菜单标题和路径不能为空'
        }), 400
    
    config = get_menu_config()
    items = config.get('items', [])
    
    # 检查路径是否已存在
    if any(item['path'] == data['path'] for item in items):
        return jsonify({
            'code': 400,
            'message': '该路径已存在'
        }), 400
    
    # 创建新菜单项
    new_menu = {
        'id': str(uuid.uuid4())[:8],
        'title': data['title'],
        'path': data['path'],
        'pageKey': data.get('pageKey', data['path'].strip('/')),
        'icon': data.get('icon'),
        'order': data.get('order', len(items) + 1),
        'visible': data.get('visible', True),
        'isSystem': False,
        'createdAt': datetime.utcnow().isoformat(),
        'updatedAt': datetime.utcnow().isoformat(),
    }
    
    items.append(new_menu)
    save_menu_config({'items': items})
    
    return jsonify({
        'code': 200,
        'message': '菜单添加成功',
        'data': new_menu
    })


@api_bp.route('/menus/<menu_id>', methods=['PUT'])
@jwt_required()
def update_menu(menu_id):
    """更新菜单项（需要登录）"""
    data = request.get_json()
    
    config = get_menu_config()
    items = config.get('items', [])
    
    # 查找菜单项
    menu_index = next((i for i, item in enumerate(items) if item['id'] == menu_id), None)
    
    if menu_index is None:
        return jsonify({
            'code': 404,
            'message': '菜单不存在'
        }), 404
    
    # 更新字段
    menu = items[menu_index]
    if 'title' in data:
        menu['title'] = data['title']
    if 'path' in data:
        menu['path'] = data['path']
    if 'pageKey' in data:
        menu['pageKey'] = data['pageKey']
    if 'icon' in data:
        menu['icon'] = data['icon']
    if 'order' in data:
        menu['order'] = data['order']
    if 'visible' in data:
        menu['visible'] = data['visible']
    
    menu['updatedAt'] = datetime.utcnow().isoformat()
    
    items[menu_index] = menu
    save_menu_config({'items': items})
    
    return jsonify({
        'code': 200,
        'message': '菜单更新成功',
        'data': menu
    })


@api_bp.route('/menus/<menu_id>', methods=['DELETE'])
@jwt_required()
def delete_menu(menu_id):
    """删除菜单项（需要登录）"""
    config = get_menu_config()
    items = config.get('items', [])
    
    # 查找菜单项
    menu = next((item for item in items if item['id'] == menu_id), None)
    
    if not menu:
        return jsonify({
            'code': 404,
            'message': '菜单不存在'
        }), 404
    
    # 检查是否是系统菜单
    if menu.get('isSystem'):
        return jsonify({
            'code': 400,
            'message': '系统菜单不能删除'
        }), 400
    
    # 删除菜单
    items = [item for item in items if item['id'] != menu_id]
    save_menu_config({'items': items})
    
    return jsonify({
        'code': 200,
        'message': '菜单删除成功'
    })


@api_bp.route('/pages/list', methods=['GET'])
def get_pages_list():
    """获取可编辑的页面列表"""
    config = get_menu_config()
    items = config.get('items', [])
    
    # 返回页面列表
    pages = [
        {
            'key': item['pageKey'],
            'title': item['title'],
            'path': item['path']
        }
        for item in items if item.get('visible', True)
    ]
    
    return jsonify({
        'code': 200,
        'message': 'success',
        'data': pages
    })
