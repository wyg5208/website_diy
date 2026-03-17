"""
测试 LOGO 配置API
"""
import requests
import json

BASE_URL = 'http://localhost:5001/api/v1'

# 1. 登录获取 token
def login():
    response = requests.post(f'{BASE_URL}/auth/login', json={
        'username': 'admin',
        'password': 'admin123'
    })
    if response.status_code == 200:
        data = response.json()
        print('✓ 登录成功')
        return data.get('token')
    else:
        print('✗ 登录失败')
        return None

# 2. 获取 LOGO 配置（未登录）
def get_logo_config():
    response = requests.get(f'{BASE_URL}/settings/logo')
    if response.status_code == 200:
        data = response.json()
        print('✓ 获取 LOGO 配置成功')
        print(json.dumps(data, indent=2, ensure_ascii=False))
        return data
    else:
        print('✗ 获取 LOGO 配置失败')
        return None

# 3. 更新 LOGO 配置（需要登录）
def update_logo_config(token):
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    config = {
        'enabled': True,
        'displayMode': 'textAndImage',
        'logoImage': '/media/2026/03/test.png',
        'logoImageWidth': 50,
        'logoImageHeight': 50,
        'logoText': 'TEST',
        'logoSubText': 'CMS',
        'textColor': '#ff0000',
        'subTextColor': '#001529',
        'fontSize': 24,
        'subFontSize': 24,
        'fontWeight': 800,
        'letterSpacing': 2,
        'imageGap': 15,
        'linkUrl': '/'
    }
    
    response = requests.put(
        f'{BASE_URL}/settings/logo', 
        json=config,
        headers=headers
    )
    
    if response.status_code == 200:
        data = response.json()
        print('✓ 更新 LOGO 配置成功')
        print(json.dumps(data, indent=2, ensure_ascii=False))
        return data
    else:
        print('✗ 更新 LOGO 配置失败')
        print(response.text)
        return None

if __name__ == '__main__':
    print('=' * 50)
    print('开始测试 LOGO 配置API')
    print('=' * 50)
    
    # 测试获取配置
    print('\n[测试 1] 获取默认 LOGO 配置...')
    get_logo_config()
    
    # 测试更新配置
    print('\n[测试 2] 更新 LOGO 配置...')
    token = login()
    if token:
        update_logo_config(token)
    
    print('\n[测试完成]')
