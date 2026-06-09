import asyncio
import sys
import os
sys.path.append(os.getcwd())
from app.database import AsyncSessionLocal
from app.models.user import User
from app.core.security import verify_password
from sqlalchemy import select

async def main():
    try:
        async with AsyncSessionLocal() as session:
            print("Fetching user...")
            result = await session.execute(select(User).where(User.email == "test@lectra.ai"))
            user = result.scalar_one_or_none()
            if not user:
                print("User not found!")
                return
            
            print(f"User found. Hash: {user.hashed_password}")
            
            print("Verifying password 'password123'...")
            # This is where 500 likely happens
            is_valid = verify_password("password123", user.hashed_password) 
            print(f"Verification result: {is_valid}")

            if is_valid:
                print("Creating access token...")
                from app.core.security import create_access_token
                token = create_access_token(data={"sub": user.email})
                print(f"Token created: {token[:20]}...")
            
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
