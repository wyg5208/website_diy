import requests
import json

# 测试底栏配置保存功能
base_url = "http://127.0.0.1:5000/api/v1"

def test_save_footer_config():
    """测试保存底栏配置"""
    print("=== 测试保存底栏配置 ===")
    
    # 首先尝试不带token的请求（应该失败）
    config = {
        "enabled": True,
        "height": 300,
        "backgroundColor": "#ff0000",
        "textColor": "rgba(255,255,255,0.8)",
        "title": "测试保存标题",
        "description": "这是测试保存的描述",
        "copyright": "©2026 测试保存",
        "elements": []
    }
    
    print("1. 测试无认证保存（应该失败）:")
    response = requests.put(f"{base_url}/settings/footer", json=config)
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    print()
    
    # 创建一个测试用户并获取token
    print("2. 创建测试用户并登录:")
    # 先注册用户
    register_data = {
        "username": "testuser",
        "password": "testpass123",
        "email": "test@example.com",
        "display_name": "测试用户"
    }
    
    try:
        reg_response = requests.post(f"{base_url}/auth/register", json=register_data)
        print(f"注册响应: {reg_response.status_code}")
    except:
        print("用户可能已存在")
    
    # 登录获取token
    login_data = {
        "username": "admin",
        "password": "admin123"  # admin用户的密码
    }
    
    login_response = requests.post(f"{base_url}/auth/login", json=login_data)
    if login_response.status_code == 200:
        token = login_response.json()['data']['access_token']
        print(f"获取到token: {token[:20]}...")
        
        # 使用token保存配置
        print("\n3. 使用认证保存配置:")
        headers = {"Authorization": f"Bearer {token}"}
        save_response = requests.put(f"{base_url}/settings/footer", json=config, headers=headers)
        print(f"保存状态码: {save_response.status_code}")
        print(f"保存响应: {save_response.json()}")
        
        # 验证保存结果
        print("\n4. 验证保存结果:")
        get_response = requests.get(f"{base_url}/settings/footer")
        print(f"获取状态码: {get_response.status_code}")
        saved_config = get_response.json()
        print(f"保存的配置: {json.dumps(saved_config, indent=2, ensure_ascii=False)}")
        
    else:
        print(f"登录失败: {login_response.json()}")

if __name__ == "__main__":
    test_save_footer_config()