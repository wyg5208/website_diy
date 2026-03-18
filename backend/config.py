import os
from datetime import timedelta
from dotenv import load_dotenv

# 加载.env文件
load_dotenv()

# 获取当前文件所在目录的绝对路径
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    """基础配置类"""
    # Flask基础配置
    SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-secret-key')
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    
    # 数据库配置 - 使用绝对路径避免 Flask instance_path 解析问题
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', f'sqlite:///{os.path.join(basedir, "data", "cms.db")}')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = DEBUG  # 开发环境下打印SQL语句
    
    # JWT配置
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'fallback-jwt-secret')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(seconds=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 7200)))
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # 文件上传配置
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', './media')
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 50 * 1024 * 1024))  # 50MB
    
    # 允许的文件扩展名（图片 + 视频 + 文档）
    ALLOWED_EXTENSIONS = set(os.getenv('ALLOWED_EXTENSIONS', 
        'png,jpg,jpeg,jfif,jfi,gif,webp,bmp,ico,svg,mp4,webm,pdf').split(','))
    
    # 分页配置
    POSTS_PER_PAGE = 20
    
    # CORS配置
    CORS_ORIGINS = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5173',  # Vite默认端口
        'http://127.0.0.1:5173',
        'http://localhost:5174',  # Vite实际端口
        'http://127.0.0.1:5174'
    ]


class DevelopmentConfig(Config):
    """开发环境配置"""
    DEBUG = True
    SQLALCHEMY_ECHO = True


class ProductionConfig(Config):
    """生产环境配置"""
    DEBUG = False
    SQLALCHEMY_ECHO = False


# 配置字典
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
