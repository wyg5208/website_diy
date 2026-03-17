import requests
import json

# 测试底栏配置API
base_url = "http://127.0.0.1:5000/api/v1"

def test_get_footer_config():
    """测试获取底栏配置"""
    print("=== 测试获取底栏配置 ===")
    response = requests.get(f"{base_url}/settings/footer")
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    print()

def test_update_footer_config():
    """测试更新底栏配置"""
    print("=== 测试更新底栏配置 ===")
    config = {
        "enabled": True,
        "height": 250,
        "backgroundColor": "#1a1a1a",
        "textColor": "rgba(255,255,255,0.6)",
        "title": "测试标题 - CORPCMS 企业内容管理平台",
        "description": "这是测试的描述文字，专业的 Python 后端与现代 React 前端技术栈",
        "copyright": "©2026 测试版本 | 工业级解决方案",
        "elements": [
            {
                "id": "title-element",
                "type": "text",
                "content": "测试标题 - CORPCMS 企业内容管理平台",
                "style": {"fontSize": "20px", "fontWeight": "bold", "color": "#ffffff", "marginBottom": "20px"}
            },
            {
                "id": "desc-element",
                "type": "text",
                "content": "这是测试的描述文字，专业的 Python 后端与现代 React 前端技术栈",
                "style": {"color": "rgba(255,255,255,0.6)", "marginBottom": "20px"}
            }
        ]
    }
    
    response = requests.put(
        f"{base_url}/settings/footer",
        json=config,
        headers={"Authorization": "Bearer fake-token"}  # 这里会因为没有有效token而失败，但我们主要测试接口结构
    )
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    print()

if __name__ == "__main__":
    test_get_footer_config()
    test_update_footer_config()