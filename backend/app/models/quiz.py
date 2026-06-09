from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    lecture_id = Column(Integer, ForeignKey("lectures.id"))
    
    # JSON Structure: 
    # [{"question": "...", "options": ["A", "B", "C", "D"], "answer": "A", "topic": "..."}]
    questions = Column(JSON) 
    
    lecture = relationship("Lecture", back_populates="quizzes")
    results = relationship("Result", back_populates="quiz", cascade="all, delete-orphan")
