import asyncio
import sys
import os
import bcrypt

sys.path.append(os.getcwd())
from app.database import AsyncSessionLocal
from app.models.user import User
from sqlalchemy import select

async def main():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.email == "test@lectra.ai"))
        user = result.scalar_one_or_none()
        if user:
            # Manually hash
            pwd_bytes = "password123".encode('utf-8')
            salt = bcrypt.gensalt()
            hashed = bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')
            
            user.hashed_password = hashed
            await session.commit()
            print("PASSWORD_RESET_SUCCESS")
        else:
            print("USER_NOT_FOUND")

if __name__ == "__main__":
    asyncio.run(main())
