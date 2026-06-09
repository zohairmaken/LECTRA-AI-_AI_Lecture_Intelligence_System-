import requests
import sys

def check_backend():
    print("--- LECTRA-AI BACKEND DIAGNOSTIC ---")
    urls = [
        "http://localhost:8000/api/v1/auth/test",
        "http://localhost:8000/api/v1/lectures/",
        "http://localhost:8000/docs"
    ]
    
    for url in urls:
        try:
            print(f"Checking {url}...", end=" ")
            resp = requests.get(url, timeout=5)
            print(f"SUCCESS [{resp.status_code}]")
        except Exception as e:
            print(f"FAILED: {e}")

if __name__ == "__main__":
    check_backend()
