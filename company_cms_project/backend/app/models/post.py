from app import db
from datetime import datetime

class Post(db.Model):
    """文章/页面模型"""
    __tablename__ = 'posts'
    
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(20), nullable=False, default='post')  # post/page
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, index=True)
    content = db.Column(db.Text)
    content_format = db.Column(db.String(20), default='rich')  # rich:富文本，markdown:Markdown 格式
    excerpt = db.Column(db.Text)  # 摘要
    featured_image = db.Column(db.String(255))  # 特色图片
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(20), default='draft')  # draft/published/private
    comment_status = db.Column(db.Integer, default=1)  # 是否允许评论
    is_sticky = db.Column(db.Integer, default=0)  # 是否置顶
    view_count = db.Column(db.Integer, default=0)  # 浏览次数
    sort_order = db.Column(db.Integer, default=0)
    parent_id = db.Column(db.Integer, default=0)  # 父级页面ID
    template = db.Column(db.String(64))  # 页面模板
    published_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关联关系
    categories = db.relationship('Category', secondary='post_categories', back_populates='posts')
    tags = db.relationship('Tag', secondary='post_tags', back_populates='posts')
    components = db.relationship('PageComponent', backref='page', lazy='dynamic')
    
    def __repr__(self):
        return f'<Post {self.title}>'
    
    def to_dict(self):
        """转换为字典"""
        # 安全获取作者名称：处理作者不存在或display_name无效的情况
        author_name = '未知用户'
        if self.author:
            # 检查 display_name 是否有效（非空且不全为问号）
            if self.author.display_name and not all(c == '?' for c in self.author.display_name):
                author_name = self.author.display_name
            else:
                author_name = self.author.username
        
        return {
            'id': self.id,
            'type': self.type,
            'title': self.title,
            'slug': self.slug,
            'content': self.content,
            'content_format': self.content_format,
            'excerpt': self.excerpt,
            'featured_image': self.featured_image,
            'author_id': self.author_id,
            'author_name': author_name,
            'status': self.status,
            'comment_status': bool(self.comment_status),
            'is_sticky': bool(self.is_sticky),
            'view_count': self.view_count,
            'sort_order': self.sort_order,
            'parent_id': self.parent_id,
            'template': self.template,
            'published_at': self.published_at.isoformat() if self.published_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'categories': [cat.to_dict() for cat in self.categories],
            'tags': [tag.to_dict() for tag in self.tags]
        }


class Category(db.Model):
    """分类模型"""
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), unique=True, index=True)
    description = db.Column(db.Text)
    parent_id = db.Column(db.Integer, default=0)
    sort_order = db.Column(db.Integer, default=0)
    icon = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 关联关系
    posts = db.relationship('Post', secondary='post_categories', back_populates='categories')
    
    def __repr__(self):
        return f'<Category {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'parent_id': self.parent_id,
            'sort_order': self.sort_order,
            'icon': self.icon,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Tag(db.Model):
    """标签模型"""
    __tablename__ = 'tags'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    slug = db.Column(db.String(100), unique=True, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 关联关系
    posts = db.relationship('Post', secondary='post_tags', back_populates='tags')
    
    def __repr__(self):
        return f'<Tag {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Media(db.Model):
    """媒体文件模型"""
    __tablename__ = 'media'
    
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    original_name = db.Column(db.String(255))
    file_path = db.Column(db.String(500), nullable=False)
    file_url = db.Column(db.String(500))
    mime_type = db.Column(db.String(100))
    file_size = db.Column(db.Integer)
    width = db.Column(db.Integer)
    height = db.Column(db.Integer)
    title = db.Column(db.String(255))
    alt_text = db.Column(db.String(255))
    description = db.Column(db.Text)
    folder_id = db.Column(db.Integer, default=0)
    uploader_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Media {self.filename}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'original_name': self.original_name,
            'file_path': self.file_path,
            'file_url': self.file_url,
            'mime_type': self.mime_type,
            'file_size': self.file_size,
            'width': self.width,
            'height': self.height,
            'title': self.title,
            'alt_text': self.alt_text,
            'description': self.description,
            'folder_id': self.folder_id,
            'uploader_id': self.uploader_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


# 关联表
post_categories = db.Table('post_categories',
    db.Column('post_id', db.Integer, db.ForeignKey('posts.id'), primary_key=True),
    db.Column('category_id', db.Integer, db.ForeignKey('categories.id'), primary_key=True)
)

post_tags = db.Table('post_tags',
    db.Column('post_id', db.Integer, db.ForeignKey('posts.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True)
)


class PageComponent(db.Model):
    """页面组件配置"""
    __tablename__ = 'page_components'
    
    id = db.Column(db.Integer, primary_key=True)
    page_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    component_type = db.Column(db.String(64), nullable=False)
    component_data = db.Column(db.JSON)  # 组件配置数据
    sort_order = db.Column(db.Integer, default=0)
    parent_id = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'page_id': self.page_id,
            'component_type': self.component_type,
            'component_data': self.component_data,
            'sort_order': self.sort_order,
            'parent_id': self.parent_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class SiteSetting(db.Model):
    """站点配置表 - 存储首页、全局配置等"""
    __tablename__ = 'site_settings'
    
    id = db.Column(db.Integer, primary_key=True)
    key_name = db.Column(db.String(100), unique=True, nullable=False)  # 配置键名
    value = db.Column(db.JSON)  # 配置值（JSON格式）
    type = db.Column(db.String(20), default='json')  # 类型: json/text/number
    description = db.Column(db.String(255))  # 描述
    group_name = db.Column(db.String(64))  # 分组
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'key_name': self.key_name,
            'value': self.value,
            'type': self.type,
            'description': self.description,
            'group_name': self.group_name,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    @staticmethod
    def get_value(key_name, default=None):
        """获取配置值"""
        setting = SiteSetting.query.filter_by(key_name=key_name).first()
        return setting.value if setting else default
    
    @staticmethod
    def set_value(key_name, value, description=None, group_name=None):
        """设置配置值"""
        try:
            setting = SiteSetting.query.filter_by(key_name=key_name).first()
            if setting:
                setting.value = value
                if description:
                    setting.description = description
                if group_name:
                    setting.group_name = group_name
            else:
                setting = SiteSetting(
                    key_name=key_name,
                    value=value,
                    description=description,
                    group_name=group_name
                )
                db.session.add(setting)
            
            db.session.commit()
            
            # 在 close session 之前先提取需要的数据
            result_data = {
                'id': setting.id,
                'key_name': setting.key_name,
                'value': setting.value,
                'type': setting.type,
                'description': setting.description,
                'group_name': setting.group_name,
                'updated_at': setting.updated_at.isoformat() if setting.updated_at else None
            }
            
            print(f"✓ SiteSetting.set_value: {key_name} 保存成功")
            return result_data
        except Exception as e:
            print(f"✗ SiteSetting.set_value: {key_name} 保存失败 - {str(e)}")
            db.session.rollback()
            raise e
        finally:
            db.session.close()
