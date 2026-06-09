from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# --- Lecture Schemas ---
class LectureBase(BaseModel):
    title: str

class LectureResponse(LectureBase):
    id: int
    filename: str
    status: str
    upload_date: datetime
    duration: Optional[float]
    summary: Optional[str]
    file_path: Optional[str]
    clean_file_path: Optional[str]
    owner_id: int
    class Config:
        from_attributes = True

class LectureFullResponse(LectureResponse):
    transcript_text: Optional[str]
    transcript_json: Optional[str]
    diarization_json: Optional[str]
    explanation_beginner: Optional[str]
    explanation_intermediate: Optional[str]
    explanation_advanced: Optional[str]

# --- Quiz Schemas ---
class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    answer: str # Correct option letter/text
    topic: str

class QuizCreate(BaseModel):
    title: str
    lecture_id: int
    questions: List[QuizQuestion]

class QuizResponse(BaseModel):
    id: int
    title: str
    lecture_id: int
    questions: List[QuizQuestion]
    class Config:
        from_attributes = True

# --- Chat Schema ---
class ChatRequest(BaseModel):
    message: str
    lecture_id: int

class ChatResponse(BaseModel):
    response: str
    sources: List[str]
