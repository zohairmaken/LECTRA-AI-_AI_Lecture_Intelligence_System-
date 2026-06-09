import requests
import wave
import struct
import time

# Generate 1s silence wav
with wave.open("test_audio.wav", "w") as f:
    f.setnchannels(1)
    f.setsampwidth(2)
    f.setframerate(44100)
    f.writeframes(b'\x00\x00' * 44100)

print("Generated test_audio.wav")

# Login
auth_url = "http://127.0.0.1:8000/api/v1/auth/token"
payload = {"username": "test@lectra.ai", "password": "password123"}
print("Logging in...")
auth_resp = requests.post(auth_url, data=payload)
if auth_resp.status_code != 200:
    print(f"Login failed: {auth_resp.text}")
    exit(1)

token = auth_resp.json()['access_token']
headers = {"Authorization": f"Bearer {token}"}

# Upload
url = "http://127.0.0.1:8000/api/v1/lectures/upload"
files = {'file': open('test_audio.wav', 'rb')}
print("Uploading file...")
resp = requests.post(url, files=files, headers=headers)
print(f"Upload Result: {resp.status_code}")
print(f"Body: {resp.text}")
