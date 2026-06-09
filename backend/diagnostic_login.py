import requests
import json

URL = "http://127.0.0.1:8000/api/v1/auth/token"

def test_login(username, password):
    print(f"--- Testing Login for: {username} ---")
    data = {
        "username": username,
        "password": password
    }
    try:
        # FastAPI OAuth2PasswordRequestForm expects form-data
        response = requests.post(URL, data=data)
        print(f"Status: {response.status_code}")
        try:
            print(f"Response Body: {response.json()}")
        except:
            print(f"Raw Response Content: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")
    print("-" * 30)

if __name__ == "__main__":
    # Test with known test user
    test_login("test@lectra.ai", "password123")
    # Test with non-existent user
    test_login("nonexistent@void.com", "random")
    # Test with empty fields
    test_login("", "")
