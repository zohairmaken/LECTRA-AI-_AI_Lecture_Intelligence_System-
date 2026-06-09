from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    
    score = Column(Float) # Percentage
    details = Column(JSON) # Detailed answer breakdown
    completed_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="results")
    quiz = relationship("Quiz", back_populates="results")
