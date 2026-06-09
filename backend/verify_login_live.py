import requests
import sys

BASE_URL = "http://localhost:8000/api/v1"

def test_live_login(email, password):
    print(f"Testing login for {email} against {BASE_URL}...")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/token",
            data={"username": email, "password": password}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ LOGIN SUCCESS")
            return True
        else:
            print("❌ LOGIN FAILED")
            return False
            
    except Exception as e:
        print(f"❌ CONNECTION ERROR: {e}")
        return False

if __name__ == "__main__":
    # Test the user we just 'fixed'
    success = test_live_login("test@lectra.ai", "test1234")
    if not success:
        sys.exit(1)
