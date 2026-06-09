import asyncio
import sys
import os

# Add current directory to path so import app works
sys.path.append(os.getcwd())

from app.database import AsyncSessionLocal
from app.models.user import User
from sqlalchemy import select

async def main():
    try:
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(User))
            users = result.scalars().all()
            if not users:
                print("NO_USERS_FOUND")
            else:
                for u in users:
                    print(f"User: {u.email}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
