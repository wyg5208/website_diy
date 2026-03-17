import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from backend.app import create_app, db
from backend.app.models import SiteSetting

app = create_app()
with app.app_context():
    setting = SiteSetting.query.filter_by(key_name='footer_config').first()
    print('配置是否存在:', setting is not None)
    if setting:
        print('配置内容:')
        import json
        print(json.dumps(setting.value, indent=2, ensure_ascii=False))
        print('\n更新时间:', setting.updated_at)