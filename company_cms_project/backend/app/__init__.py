import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import config

# 初始化扩展
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
cors = CORS()

def create_app(config_name=None):
    """应用工厂函数"""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'default')
    
    app = Flask(__name__)
    
    # 加载配置
    app.config.from_object(config[config_name])
    
    # 初始化扩展
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, origins=app.config['CORS_ORIGINS'])
    
    # 确保上传目录存在
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs('./data', exist_ok=True)
    os.makedirs('./logs', exist_ok=True)
    
    # 注册蓝图
    from app.auth import auth_bp
    from app.api import api_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(api_bp, url_prefix='/api/v1')
    
    # 导入模型后再创建表
    with app.app_context():
        # 确保所有模型都被导入
        from app.models import User, Post, Category, Tag, Media, PageComponent, SiteSetting
        db.create_all()
    
    # 注册错误处理器
    @app.errorhandler(404)
    def not_found(error):
        return {'code': 404, 'message': '资源未找到'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return {'code': 500, 'message': '服务器内部错误'}, 500
    
    return app
