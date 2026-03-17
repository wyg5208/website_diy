"""
检查 LOGO 配置是否保存到数据库
"""
import sqlite3
import json

# 连接数据库
db_path = 'company_cms_project/backend/data/cms.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# 查询 logo_config
cursor.execute("SELECT * FROM site_settings WHERE key_name = 'logo_config'")
row = cursor.fetchone()

if row:
    print("✓ 找到 logo_config 记录")
    print(f"ID: {row[0]}")
    print(f"键名：{row[1]}")
    print(f"值：{row[2]}")
    print(f"\n格式化后的值:")
    try:
        value = json.loads(row[2])
        print(json.dumps(value, indent=2, ensure_ascii=False))
    except:
        print(row[2])
else:
    print("✗ 未找到 logo_config 记录")
    
# 显示所有 site_settings
print("\n" + "="*50)
print("所有 site_settings 记录:")
cursor.execute("SELECT id, key_name, group_name FROM site_settings")
rows = cursor.fetchall()
for row in rows:
    print(f"- {row[1]} (分组：{row[2]})")

conn.close()
