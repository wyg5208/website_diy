import os
from app import create_app, db
from app.models import User, Post, Category, Tag, Media, PageComponent

# 创建应用实例
app = create_app(os.getenv('FLASK_ENV', 'development'))


@app.route('/api/health')
def health_check():
    """健康检查接口 - 用于 Render 等平台的健康检查"""
    return {
        'status': 'ok',
        'message': 'CMS Backend is running',
        'timestamp': __import__('datetime').datetime.utcnow().isoformat()
    }


@app.shell_context_processor
def make_shell_context():
    """Flask shell 上下文"""
    return {
        'db': db,
        'User': User,
        'Post': Post,
        'Category': Category,
        'Tag': Tag,
        'Media': Media,
        'PageComponent': PageComponent
    }

@app.cli.command()
def init_db():
    """初始化数据库"""
    db.create_all()
    print('数据库表创建完成')

@app.cli.command()
def create_admin():
    """创建管理员账户"""
    username = input('请输入管理员用户名: ')
    email = input('请输入管理员邮箱: ')
    password = input('请输入管理员密码: ')
    
    user = User.query.filter_by(username=username).first()
    if user:
        print('用户已存在')
        return
    
    admin = User(
        username=username,
        email=email,
        display_name='管理员'
    )
    admin.set_password(password)
    
    db.session.add(admin)
    db.session.commit()
    print(f'管理员 {username} 创建成功')

if __name__ == '__main__':
    # 开发环境使用Flask内置服务器
    if app.config['DEBUG']:
        app.run(host='127.0.0.1', port=5000, debug=True)
    else:
        # 生产环境使用Waitress
        from waitress import serve
        serve(app, host='127.0.0.1', port=5000)
