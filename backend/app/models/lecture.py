from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Lecture(Base):
    __tablename__ = "lectures"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    filename = Column(String)
    file_path = Column(String)
    clean_file_path = Column(String, nullable=True) # Path to noise-reduced version
    file_type = Column(String) # audio/mp3, etc.
    upload_date = Column(DateTime, default=datetime.utcnow)
    
    # Processing Status
    status = Column(String, default="Queued") # Queued, Processing, Completed, Failed
    duration = Column(Float, nullable=True) # Duration in seconds
    
    # Granular Status (Progressive UI)
    status_audio = Column(String, default="Pending") # Pending, Processing, Ready, Failed
    status_transcript = Column(String, default="Pending")
    status_diarization = Column(String, default="Pending")
    
    # Generated Content
    transcript_text = Column(Text, nullable=True) # User-friendly merged transcript
    transcript_json = Column(Text, nullable=True) # Raw JSON with timestamps/speakers
    diarization_json = Column(Text, nullable=True) # Raw diarization segments JSON
    
    summary = Column(Text, nullable=True)
    explanation_beginner = Column(Text, nullable=True)
    explanation_intermediate = Column(Text, nullable=True)
    explanation_advanced = Column(Text, nullable=True)
    
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="lectures")
    
    quizzes = relationship("Quiz", back_populates="lecture", cascade="all, delete-orphan")
