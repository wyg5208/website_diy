from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Post, User, Category, Tag
from app.api import api_bp
from datetime import datetime
import re

def slugify(text):
    """生成 slug"""
    # 简单的中文转拼音和处理（实际项目中建议使用 pypinyin 库）
    text = re.sub(r'[^\w\s-]', '', text.lower())
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')


@api_bp.route('/posts/categories-tags', methods=['GET'])
@jwt_required()
def get_categories_and_tags():
    """获取所有分类和标签（供编辑器使用）"""
    try:
        categories = Category.query.order_by(Category.sort_order, Category.created_at).all()
        tags = Tag.query.order_by(Tag.created_at.desc()).all()
        
        return jsonify({
            'code': 200,
            'message': '获取成功',
            'data': {
                'categories': [cat.to_dict() for cat in categories],
                'tags': [tag.to_dict() for tag in tags]
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'code': 500,
            'message': f'获取分类和标签失败：{str(e)}'
        }), 500

@api_bp.route('/posts', methods=['GET'])
def get_posts():
    """获取文章列表"""
    try:
        # 获取查询参数
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status', 'published')  # 默认只显示已发布的
        category_id = request.args.get('category_id', type=int)
        tag_id = request.args.get('tag_id', type=int)
        search = request.args.get('search', '').strip()
        
        # 构建查询
        query = Post.query
        
        # 状态过滤
        if status:
            query = query.filter_by(status=status)
        
        # 分类过滤（支持多个分类）
        if category_id:
            query = query.join(Post.categories).filter(Category.id == category_id)
        
        # 标签过滤（支持多个标签）
        if tag_id:
            query = query.join(Post.tags).filter(Tag.id == tag_id)
        
        # 搜索
        if search:
            query = query.filter(
                Post.title.contains(search) | 
                Post.content.contains(search)
            )
        
        # 分页
        pagination = query.order_by(Post.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        posts = pagination.items
        
        return jsonify({
            'code': 200,
            'message': '获取成功',
            'data': {
                'items': [post.to_dict() for post in posts],
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
            'message': f'获取文章列表失败：{str(e)}'
        }), 500


@api_bp.route('/posts/public', methods=['GET'])
def get_public_posts():
    """获取公开文章列表（无需认证，供前台使用）"""
    try:
        # 获取查询参数
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        category_id = request.args.get('category_id', type=int)
        tag_id = request.args.get('tag_id', type=int)
        search = request.args.get('search', '').strip()
        
        # 构建查询（只查询已发布的文章）
        query = Post.query.filter_by(status='published')
        
        # 分类过滤
        if category_id:
            query = query.join(Post.categories).filter(Category.id == category_id)
        
        # 标签过滤
        if tag_id:
            query = query.join(Post.tags).filter(Tag.id == tag_id)
        
        # 搜索
        if search:
            query = query.filter(
                Post.title.contains(search) | 
                Post.content.contains(search)
            )
        
        # 分页
        pagination = query.order_by(Post.published_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        posts = pagination.items
        
        return jsonify({
            'code': 200,
            'message': '获取成功',
            'data': {
                'items': [post.to_dict() for post in posts],
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
            'message': f'获取文章列表失败：{str(e)}'
        }), 500


@api_bp.route('/posts/public/<int:id>', methods=['GET'])
def get_public_post(id):
    """获取公开文章详情（无需认证，供前台使用）"""
    try:
        post = Post.query.get_or_404(id)
        
        # 只允许查看已发布的文章
        if post.status != 'published':
            return jsonify({
                'code': 403,
                'message': '文章未发布'
            }), 403
        
        # 增加浏览次数
        post.view_count += 1
        db.session.commit()
        
        return jsonify({
            'code': 200,
            'message': '获取成功',
            'data': post.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'code': 500,
            'message': f'获取文章失败：{str(e)}'
        }), 500


@api_bp.route('/posts/<int:id>', methods=['GET'])
@jwt_required(optional=True)
def get_post(id):
    """获取文章详情（需要认证，可查看草稿）"""
    try:
        current_user_id = get_jwt_identity()
        post = Post.query.get_or_404(id)
        
        # 检查权限：已发布的文章任何人都可以查看，未发布的只有作者或管理员可以查看
        if post.status != 'published':
            if not current_user_id or (post.author_id != current_user_id and User.query.get(current_user_id).username != 'admin'):
                return jsonify({
                    'code': 403,
                    'message': '无权查看此文章'
                }), 403
        
        # 增加浏览次数（仅已发布文章）
        if post.status == 'published':
            post.view_count += 1
            db.session.commit()
        
        return jsonify({
            'code': 200,
            'message': '获取成功',
            'data': post.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'code': 500,
            'message': f'获取文章失败：{str(e)}'
        }), 500


@api_bp.route('/posts', methods=['POST'])
@jwt_required()
def create_post():
    """创建文章"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # 检查数据是否为空
        if not data:
            return jsonify({
                'code': 400,
                'message': '请求数据为空'
            }), 400
        
        # 调试日志
        print(f"[DEBUG] 创建文章 - 用户 ID: {current_user_id}")
        print(f"[DEBUG] 接收到的数据：{data}")
        
        # 参数校验
        title = data.get('title', '').strip() if data.get('title') else ''
        content = data.get('content', '').strip() if data.get('content') else ''
        content_format = data.get('content_format', 'rich')  # rich 或 markdown
        type_ = data.get('type', 'post')  # post or page
        status = data.get('status', 'draft')
        
        print(f"[DEBUG] 标题：{title}, 内容长度：{len(content) if content else 0}, 格式：{content_format}")
        
        if not title:
            print("[DEBUG] 标题为空，返回错误")
            return jsonify({
                'code': 400,
                'message': '标题不能为空'
            }), 400
        
        if content_format not in ['rich', 'markdown']:
            print(f"[DEBUG] 不支持的内容格式：{content_format}")
            return jsonify({
                'code': 400,
                'message': '不支持的内容格式'
            }), 400
        
        # 生成slug
        slug = data.get('slug') or slugify(title)
        # 确保slug唯一
        original_slug = slug
        counter = 1
        while Post.query.filter_by(slug=slug).first():
            slug = f"{original_slug}-{counter}"
            counter += 1
        
        # 创建文章
        post = Post(
            title=title,
            slug=slug,
            content=content,
            content_format=content_format,
            type=type_,
            status=status,
            author_id=current_user_id,
            excerpt=data.get('excerpt', ''),
            featured_image=data.get('featured_image'),
            comment_status=data.get('comment_status', 1),
            is_sticky=data.get('is_sticky', 0)
        )
        
        # 设置发布时间
        if status == 'published':
            post.published_at = datetime.utcnow()
        
        # 关联分类
        category_ids = data.get('category_ids', [])
        if category_ids:
            categories = Category.query.filter(Category.id.in_(category_ids)).all()
            post.categories.extend(categories)
        
        # 关联标签
        tag_names = data.get('tag_names', [])
        if tag_names:
            for tag_name in tag_names:
                tag = Tag.query.filter_by(name=tag_name).first()
                if not tag:
                    # 创建新标签
                    tag_slug = slugify(tag_name)
                    tag = Tag(name=tag_name, slug=tag_slug)
                    db.session.add(tag)
                post.tags.append(tag)
        
        db.session.add(post)
        db.session.commit()
        
        return jsonify({
            'code': 201,
            'message': '创建成功',
            'data': post.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'code': 500,
            'message': f'创建文章失败: {str(e)}'
        }), 500


@api_bp.route('/posts/<int:id>', methods=['PUT'])
@jwt_required()
def update_post(id):
    """更新文章"""
    try:
        current_user_id = get_jwt_identity()
        post = Post.query.get_or_404(id)
        
        # 检查权限（只有作者或管理员可以编辑）
        user = User.query.get(current_user_id)
        if post.author_id != current_user_id and user.username != 'admin':
            return jsonify({
                'code': 403,
                'message': '没有权限编辑此文章'
            }), 403
        
        data = request.get_json()
        
        # 更新字段
        if 'title' in data:
            post.title = data['title'].strip()
            # 重新生成slug
            if data.get('update_slug', False):
                slug = slugify(post.title)
                original_slug = slug
                counter = 1
                while Post.query.filter(Post.slug == slug, Post.id != post.id).first():
                    slug = f"{original_slug}-{counter}"
                    counter += 1
                post.slug = slug
        
        if 'content' in data:
            post.content = data['content'].strip()
        
        if 'content_format' in data:
            if data['content_format'] not in ['rich', 'markdown']:
                return jsonify({
                    'code': 400,
                    'message': '不支持的内容格式'
                }), 400
            post.content_format = data['content_format']
        
        if 'excerpt' in data:
            post.excerpt = data['excerpt'].strip()
        
        if 'featured_image' in data:
            post.featured_image = data['featured_image']
        
        if 'status' in data:
            old_status = post.status
            post.status = data['status']
            # 如果从未发布变为发布，设置发布时间
            if old_status != 'published' and post.status == 'published' and not post.published_at:
                post.published_at = datetime.utcnow()
        
        if 'comment_status' in data:
            post.comment_status = data['comment_status']
        
        if 'is_sticky' in data:
            post.is_sticky = data['is_sticky']
        
        # 更新分类
        if 'category_ids' in data:
            post.categories.clear()
            if data['category_ids']:
                categories = Category.query.filter(Category.id.in_(data['category_ids'])).all()
                post.categories.extend(categories)
        
        # 更新标签
        if 'tag_names' in data:
            post.tags.clear()
            for tag_name in data['tag_names']:
                tag = Tag.query.filter_by(name=tag_name).first()
                if not tag:
                    tag_slug = slugify(tag_name)
                    tag = Tag(name=tag_name, slug=tag_slug)
                    db.session.add(tag)
                post.tags.append(tag)
        
        post.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'code': 200,
            'message': '更新成功',
            'data': post.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'code': 500,
            'message': f'更新文章失败: {str(e)}'
        }), 500


@api_bp.route('/posts/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_post(id):
    """删除文章"""
    try:
        current_user_id = get_jwt_identity()
        post = Post.query.get_or_404(id)
        
        # 检查权限
        user = User.query.get(current_user_id)
        if post.author_id != current_user_id and user.username != 'admin':
            return jsonify({
                'code': 403,
                'message': '没有权限删除此文章'
            }), 403
        
        db.session.delete(post)
        db.session.commit()
        
        return jsonify({
            'code': 200,
            'message': '删除成功'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'code': 500,
            'message': f'删除文章失败: {str(e)}'
        }), 500
