from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Category
from app.api import api_bp

@api_bp.route('/categories', methods=['GET'])
def get_categories():
    """获取分类列表（树形结构）"""
    try:
        # 获取所有分类
        categories = Category.query.order_by(Category.sort_order, Category.created_at).all()
        
        # 构建树形结构
        def build_tree(parent_id=0):
            children = []
            for cat in categories:
                if cat.parent_id == parent_id:
                    node = cat.to_dict()
                    node['children'] = build_tree(cat.id)
                    children.append(node)
            return children
        
        tree = build_tree()
        
        return jsonify({
            'code': 200,
            'message': '获取成功',
            'data': tree
        }), 200
        
    except Exception as e:
        return jsonify({
            'code': 500,
            'message': f'获取分类失败: {str(e)}'
        }), 500


@api_bp.route('/categories', methods=['POST'])
@jwt_required()
def create_category():
    """创建分类"""
    try:
        data = request.get_json()
        
        name = data.get('name', '').strip()
        if not name:
            return jsonify({
                'code': 400,
                'message': '分类名称不能为空'
            }), 400
        
        # 检查名称是否已存在
        if Category.query.filter_by(name=name).first():
            return jsonify({
                'code': 400,
                'message': '分类名称已存在'
            }), 400
        
        # 生成slug
        slug = data.get('slug') or name.lower().replace(' ', '-')
        if Category.query.filter_by(slug=slug).first():
            return jsonify({
                'code': 400,
                'message': '分类别名已存在'
            }), 400
        
        category = Category(
            name=name,
            slug=slug,
            description=data.get('description', ''),
            parent_id=data.get('parent_id', 0),
            sort_order=data.get('sort_order', 0),
            icon=data.get('icon')
        )
        
        db.session.add(category)
        db.session.commit()
        
        return jsonify({
            'code': 201,
            'message': '创建成功',
            'data': category.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'code': 500,
            'message': f'创建分类失败: {str(e)}'
        }), 500


@api_bp.route('/categories/<int:id>', methods=['PUT'])
@jwt_required()
def update_category(id):
    """更新分类"""
    try:
        category = Category.query.get_or_404(id)
        data = request.get_json()
        
        if 'name' in data:
            name = data['name'].strip()
            if name and name != category.name:
                if Category.query.filter(Category.name == name, Category.id != id).first():
                    return jsonify({
                        'code': 400,
                        'message': '分类名称已存在'
                    }), 400
                category.name = name
        
        if 'slug' in data:
            slug = data['slug'].strip()
            if slug and slug != category.slug:
                if Category.query.filter(Category.slug == slug, Category.id != id).first():
                    return jsonify({
                        'code': 400,
                        'message': '分类别名已存在'
                    }), 400
                category.slug = slug
        
        if 'description' in data:
            category.description = data['description']
        
        if 'parent_id' in data:
            category.parent_id = data['parent_id']
        
        if 'sort_order' in data:
            category.sort_order = data['sort_order']
        
        if 'icon' in data:
            category.icon = data['icon']
        
        db.session.commit()
        
        return jsonify({
            'code': 200,
            'message': '更新成功',
            'data': category.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'code': 500,
            'message': f'更新分类失败: {str(e)}'
        }), 500


@api_bp.route('/categories/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_category(id):
    """删除分类"""
    try:
        category = Category.query.get_or_404(id)
        
        # 检查是否有子分类
        if Category.query.filter_by(parent_id=id).first():
            return jsonify({
                'code': 400,
                'message': '该分类下有子分类，不能删除'
            }), 400
        
        # 检查是否有文章使用此分类
        if category.posts:
            return jsonify({
                'code': 400,
                'message': '该分类下有文章，不能删除'
            }), 400
        
        db.session.delete(category)
        db.session.commit()
        
        return jsonify({
            'code': 200,
            'message': '删除成功'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'code': 500,
            'message': f'删除分类失败: {str(e)}'
        }), 500
