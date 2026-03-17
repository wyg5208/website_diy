"""
用户管理功能测试脚本
测试用户管理的各项 API 功能
"""

import requests
import json

BASE_URL = 'http://localhost:5000/api'

def test_users_api():
    """测试用户管理 API"""
    
    # 1. 登录获取 token
    print("=" * 50)
    print("步骤 1: 登录获取 token")
    login_data = {
        'username': 'admin',
        'password': 'admin123'
    }
    login_response = requests.post(f'{BASE_URL}/auth/login', json=login_data)
    print(f"登录状态码：{login_response.status_code}")
    
    if login_response.status_code != 200:
        print("登录失败，请确保后端服务已启动且有 admin 用户")
        return
    
    token = login_response.json()['data']['access_token']
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    print(f"获取 token 成功：{token[:20]}...")
    
    # 2. 获取用户列表
    print("\n" + "=" * 50)
    print("步骤 2: 获取用户列表")
    response = requests.get(f'{BASE_URL}/users', headers=headers)
    print(f"状态码：{response.status_code}")
    print(f"响应：{json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    
    # 3. 创建新用户
    print("\n" + "=" * 50)
    print("步骤 3: 创建新用户")
    new_user_data = {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'test1234',
        'display_name': '测试用户',
        'status': 1
    }
    response = requests.post(f'{BASE_URL}/users', headers=headers, json=new_user_data)
    print(f"状态码：{response.status_code}")
    print(f"响应：{json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    
    user_id = None
    if response.status_code == 201:
        user_id = response.json()['data']['user']['id']
        print(f"创建用户成功，ID: {user_id}")
    
    # 4. 获取单个用户详情
    if user_id:
        print("\n" + "=" * 50)
        print(f"步骤 4: 获取用户 {user_id} 详情")
        response = requests.get(f'{BASE_URL}/users/{user_id}', headers=headers)
        print(f"状态码：{response.status_code}")
        print(f"响应：{json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        
        # 5. 更新用户信息
        print("\n" + "=" * 50)
        print(f"步骤 5: 更新用户 {user_id}")
        update_data = {
            'display_name': '更新的测试用户',
            'status': 0  # 禁用
        }
        response = requests.put(f'{BASE_URL}/users/{user_id}', headers=headers, json=update_data)
        print(f"状态码：{response.status_code}")
        print(f"响应：{json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        
        # 6. 重置密码
        print("\n" + "=" * 50)
        print(f"步骤 6: 重置用户 {user_id} 密码")
        reset_data = {
            'password': 'newpass123'
        }
        response = requests.post(f'{BASE_URL}/users/{user_id}/reset-password', headers=headers, json=reset_data)
        print(f"状态码：{response.status_code}")
        print(f"响应：{json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        
        # 7. 删除用户
        print("\n" + "=" * 50)
        print(f"步骤 7: 删除用户 {user_id}")
        response = requests.delete(f'{BASE_URL}/users/{user_id}', headers=headers)
        print(f"状态码：{response.status_code}")
        print(f"响应：{json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    
    print("\n" + "=" * 50)
    print("所有测试完成！")

if __name__ == '__main__':
    try:
        test_users_api()
    except Exception as e:
        print(f"测试过程中发生错误：{e}")
