import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select
from app.models.user import User
from app.core.config import settings
import bcrypt

# Database setup
engine = create_async_engine(settings.DATABASE_URL, echo=True)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def ensure_user():
    email = "test@lectra.ai"
    password = "password123"
    
    # Direct bcrypt hashing to avoid passlib issues in this script
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_pw = bcrypt.hashpw(password_bytes, salt).decode('utf-8')

    async with async_session() as session:
        async with session.begin():
            # Check if user exists
            result = await session.execute(select(User).where(User.email == email))
            user = result.scalars().first()
            
            if user:
                print(f"Updating existing user: {email}")
                user.hashed_password = hashed_pw
                user.full_name = "Test Operator"
            else:
                print(f"Creating new user: {email}")
                user = User(
                    email=email,
                    hashed_password=hashed_pw,
                    full_name="Test Operator"
                )
                session.add(user)
        
        await session.commit()
    print(f"--- [DONE] Test User {email} is ready with password: {password} ---")

if __name__ == "__main__":
    asyncio.run(ensure_user())
