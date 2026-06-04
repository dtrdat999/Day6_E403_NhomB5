import requests
import json
import sys

# Fix encoding on Windows
sys.stdout.reconfigure(encoding='utf-8')

url = 'http://127.0.0.1:8000/api/chat'
payload = {
    'messages': [{'role': 'user', 'content': 'Xin chao'}],
    'permissionGranted': False,
    'transactions': []
}

try:
    r = requests.post(url, json=payload, timeout=30)
    print(f"Status: {r.status_code}")
    data = r.json()
    print(f"Response: {json.dumps(data, ensure_ascii=False, indent=2)}")
except Exception as e:
    print(f"Error: {e}")
