from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import auth, lecture, chatbot, quiz
from app.database import engine, Base

# Import all models so relationships resolve before create_all
from app.models import User, Lecture, Quiz, Result  # noqa: F401
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json")

# Create upload dir if not exists
if not os.path.exists(settings.UPLOAD_DIR):
    os.makedirs(settings.UPLOAD_DIR)

# Serve static files
app.mount("/sub/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


# CORS
origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
    "http://[::1]:5173",
    "http://localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(lecture.router, prefix=f"{settings.API_V1_STR}/lectures", tags=["Lectures"])
app.include_router(chatbot.router, prefix=f"{settings.API_V1_STR}/chat", tags=["Chat"])
app.include_router(quiz.router, prefix=f"{settings.API_V1_STR}/quiz", tags=["Quiz"])

@app.on_event("startup")
async def init_db():
    # 1. Initialize DB (Fast, keeps system responsive)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # 2. Background AI Loading (Sequential to avoid race conditions/heavy load)
    import asyncio
    from app.services.audio_service import audio_service
    from app.services.diarization_service import diarization_service
    from app.services.transcription_service import transcription_service
    from app.services.rag_service import rag_service

    async def background_init():
        print("--- [BACKGROUND] Starting AI Model Warmup ---")
        # Run sync in thread to avoid blocking loop
        await asyncio.to_thread(audio_service._initialize)
        # Diarization/Whisper/RAG follow similar lazy patterns
        print("--- [BACKGROUND] AI Services Ready ---")

    print("--- [STARTUP] Backend Ready. AI Loading in background. ---")
    asyncio.create_task(background_init())

@app.get("/")
def health_check():
    return {"status": "ok", "system": "LECTRA-AI Backend"}
