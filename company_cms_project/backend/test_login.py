from app import create_app, db
from app.models import User

app = create_app()
with app.app_context():
    # 查找 admin 用户
    user = User.query.filter_by(username='admin').first()
    
    if user:
        print(f'找到用户：{user.username}')
        print(f'邮箱：{user.email}')
        print(f'状态：{user.status}')
        print(f'密码哈希：{user.password_hash[:20]}...')
        
        # 测试密码验证
        test_password = 'admin123'
        result = user.check_password(test_password)
        print(f'\n测试密码 "{test_password}": {result}')
        
        if not result:
            print('\n密码验证失败！可能需要重置密码。')
            print('\n要重置密码为 admin123，请输入 y 确认：')
            choice = input().strip().lower()
            if choice == 'y':
                user.set_password('admin123')
                db.session.commit()
                print('密码已重置为 admin123')
                
                # 再次验证
                result = user.check_password('admin123')
                print(f'重新测试密码验证：{result}')
    else:
        print('未找到 admin 用户')
