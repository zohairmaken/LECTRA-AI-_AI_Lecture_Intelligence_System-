import requests
import json

url = "http://127.0.0.1:8000/api/v1/auth/token"
payload = {"username": "test@lectra.ai", "password": "password123"}
headers = {"Content-Type": "application/x-www-form-urlencoded"}

try:
    resp = requests.post(url, data=payload, headers=headers)
    print(f"Status: {resp.status_code}")
    print(f"Body: {resp.text}")
except Exception as e:
    print(f"Request failed: {e}")
