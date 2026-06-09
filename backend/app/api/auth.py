from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.api import deps # Will create dependency next
from app.core import security
from app.schemas.all import UserCreate, UserResponse, Token
from sqlalchemy.future import select

import logging
import os

router = APIRouter()

# Setup module-level logging
logging.basicConfig(filename='login_debug.log', level=logging.INFO, force=True)
logger = logging.getLogger(__name__)


@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(User).where(User.email == user_in.email))
        if result.scalars().first():
            raise HTTPException(status_code=400, detail="Email already registered")
        
        user = User(
            email=user_in.email,
            hashed_password=security.get_password_hash(user_in.password),
            full_name=user_in.full_name
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"REGISTER CRASH: {e}", exc_info=True)
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    logger.info(f"Login request for: {form_data.username}")
    print(f"Login request for: {form_data.username}")

    try:
        result = await db.execute(select(User).where(User.email == form_data.username))
        user = result.scalars().first()
        
        if not user:
            logger.warning("User not found")
            raise HTTPException(status_code=400, detail="Incorrect email or password")
        
        # Verify password
        is_valid = security.verify_password(form_data.password, user.hashed_password)
        if not is_valid:
            logger.warning("Invalid password")
            raise HTTPException(status_code=400, detail="Incorrect email or password")
        
        access_token = security.create_access_token(data={"sub": user.email})
        logger.info("Login success")
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"LOGIN CRASH: {e}", exc_info=True)
        import traceback
        traceback.print_exc()
        # Return generic error details
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(deps.get_current_user)
):
    """Validate token and return the currently authenticated user."""
    return current_user
