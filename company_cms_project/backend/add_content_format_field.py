"""
添加 content_format 字段到 posts 表
运行方式：python add_content_format_field.py
"""

import sys
import os

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models import Post

def migrate():
    """执行数据库迁移"""
    app = create_app()
    
    with app.app_context():
        try:
            # 检查字段是否已存在
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            columns = [col['name'] for col in inspector.get_columns('posts')]
            
            if 'content_format' in columns:
                print("✓ content_format 字段已存在，无需迁移")
                return
            
            # 添加字段
            print("开始添加 content_format 字段...")
            with db.engine.connect() as conn:
                # SQLite 语法
                conn.execute(db.text("ALTER TABLE posts ADD COLUMN content_format VARCHAR(20) DEFAULT 'rich'"))
                conn.commit()
            
            print("✓ content_format 字段添加成功！")
            print("✓ 默认值设置为 'rich' (富文本)")
            
        except Exception as e:
            print(f"✗ 迁移失败：{str(e)}")
            raise

if __name__ == '__main__':
    migrate()
