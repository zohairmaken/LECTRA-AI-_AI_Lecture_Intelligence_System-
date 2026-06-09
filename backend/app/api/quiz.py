from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.api import deps
from app.models.lecture import Lecture
from app.models.quiz import Quiz
from app.models.result import Result
from app.services.quiz_service import quiz_service
from typing import Dict, List, Optional
from datetime import datetime

router = APIRouter()

class EvaluateRequest(BaseModel):
    question: str
    user_answer: str

class SubmitQuizRequest(BaseModel):
    answers: Dict[str, str] # e.g. {"0": "A", "1": "C", "2": "B"}

class GenerateQuizRequest(BaseModel):
    num_questions: Optional[int] = 5
    force: Optional[bool] = False

@router.post("/{lecture_id}/generate")
async def generate_quiz(
    lecture_id: int,
    req: GenerateQuizRequest = GenerateQuizRequest(),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    result = await db.execute(select(Lecture).where(Lecture.id == lecture_id, Lecture.owner_id == current_user.id))
    lecture = result.scalars().first()
    
    if not lecture or not lecture.transcript_text:
        raise HTTPException(status_code=400, detail="Transcript not ready. Please wait for processing to complete.")

    # Check if a quiz already exists for this lecture (unless forcing)
    quiz_res = await db.execute(select(Quiz).where(Quiz.lecture_id == lecture_id))
    existing_quiz = quiz_res.scalars().first()
    
    if existing_quiz and not req.force:
        print(f"[QUIZ API] Returning existing quiz {existing_quiz.id} for lecture {lecture_id}")
        return {"id": existing_quiz.id, "questions": existing_quiz.questions}

    print(f"[QUIZ API] Generating NEW quiz for lecture {lecture_id} (n={req.num_questions}) using local LLM...")
    quiz_data = await quiz_service.generate_quiz(lecture.transcript_text, num_questions=req.num_questions)
    
    if existing_quiz and req.force:
        existing_quiz.questions = quiz_data
        existing_quiz.title = f"Quiz for: {lecture.title} (Updated)"
        db.add(existing_quiz)
        await db.commit()
        await db.refresh(existing_quiz)
        return {"id": existing_quiz.id, "questions": existing_quiz.questions}
    
    # Save Quiz to DB
    new_quiz = Quiz(
        title=f"Quiz for: {lecture.title}",
        lecture_id=lecture.id,
        questions=quiz_data
    )
    db.add(new_quiz)
    await db.commit()
    await db.refresh(new_quiz)
    
    print(f"[QUIZ API] Quiz saved with ID {new_quiz.id}. Generated {len(quiz_data)} questions successfully.")
    return {"id": new_quiz.id, "questions": new_quiz.questions}

@router.post("/{quiz_id}/submit")
async def submit_quiz(
    quiz_id: int,
    req: SubmitQuizRequest,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """
    Submit quiz answers for evaluation.
    Uses fast MCQ matching against stored correct answers.
    Stores result in DB for Learning Hub.
    """
    # Fetch quiz and joined lecture
    quiz_res = await db.execute(select(Quiz).options(selectinload(Quiz.lecture)).where(Quiz.id == quiz_id))
    quiz = quiz_res.scalars().first()
    
    if not quiz or quiz.lecture.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Quiz not found")

    questions = quiz.questions
    if not questions:
        raise HTTPException(status_code=400, detail="Quiz has no questions")

    # Evaluate each answer using MCQ matching (fast, no LLM needed)
    correct_count = 0
    eval_details = []
    total_questions = len(questions)
    
    if not req.answers:
        raise HTTPException(status_code=400, detail="No answers provided")

    print(f"[QUIZ API] Evaluating {len(req.answers)} answers for quiz {quiz_id} (MCQ matching)...")
    
    for idx, question_data in enumerate(questions):
        q_text = question_data.get("question", f"Question {idx + 1}")
        correct_answer = question_data.get("answer", "")
        options = question_data.get("options", [])
        topic = question_data.get("topic", "")
        
        # User's answer — look up by index (string key) or question text
        user_ans = req.answers.get(str(idx), req.answers.get(q_text, ""))
        
        # Normalize for comparison
        # The correct answer might be "A", "B", etc.
        # The user answer might be the full option text like "A) Something" or just "A"
        correct_letter = correct_answer.strip().upper()[:1] if correct_answer else ""
        user_letter = user_ans.strip().upper()[:1] if user_ans else ""
        
        # Also check if user submitted the full option text
        is_correct = False
        if user_letter and correct_letter:
            is_correct = (user_letter == correct_letter)
        
        # If user submitted full option text, check if it matches the correct option
        if not is_correct and user_ans and correct_letter:
            for opt in options:
                opt_letter = opt.strip().upper()[:1] if opt else ""
                if opt_letter == correct_letter and user_ans.strip() == opt.strip():
                    is_correct = True
                    break
        
        if is_correct:
            correct_count += 1
            
        # Find the correct option text for display
        correct_option_text = correct_answer
        for opt in options:
            if opt.strip().upper().startswith(correct_letter):
                correct_option_text = opt
                break
            
        eval_details.append({
            "questionText": q_text,
            "userAnswer": user_ans,
            "correctAnswer": correct_option_text,
            "isCorrect": is_correct,
            "topic": topic,
            "feedback": "Correct!" if is_correct else f"The correct answer is: {correct_option_text}"
        })

    score_pct = round((correct_count / total_questions) * 100, 2) if total_questions > 0 else 0
    
    # Save the Result in DB for Learning Hub
    new_result = Result(
        user_id=current_user.id,
        quiz_id=quiz.id,
        score=score_pct,
        details=eval_details
    )
    db.add(new_result)
    await db.commit()
    await db.refresh(new_result)
    
    print(f"[QUIZ API] Quiz {quiz_id} evaluated: {correct_count}/{total_questions} correct ({score_pct}%)")
    print(f"[QUIZ API] Result saved to Learning Hub with ID {new_result.id}")
    
    return {
        "score": score_pct,
        "correctAnswers": correct_count,
        "totalQuestions": total_questions,
        "details": eval_details,
        "result_id": new_result.id
    }

@router.get("/history")
async def get_quiz_history(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """Fetch all past results for the Learning Hub"""
    res = await db.execute(
        select(Result)
        .options(selectinload(Result.quiz).selectinload(Quiz.lecture))
        .where(Result.user_id == current_user.id)
        .order_by(Result.completed_at.desc())
    )
    results = res.scalars().all()
    
    history = []
    for r in results:
        # Get quiz questions for review
        quiz_questions = r.quiz.questions if r.quiz else []
        
        history.append({
            "id": r.id,
            "quiz_id": r.quiz_id,
            "lecture_title": r.quiz.lecture.title if r.quiz and r.quiz.lecture else r.quiz.title if r.quiz else "Unknown",
            "score": r.score,
            "completed_at": r.completed_at,
            "details": r.details,
            "questions": quiz_questions
        })
        
    return history

@router.get("/{quiz_id}")
async def get_quiz(
    quiz_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(deps.get_current_user)
):
    """Fetch a specific quiz to render for taking"""
    quiz_res = await db.execute(select(Quiz).options(selectinload(Quiz.lecture)).where(Quiz.id == quiz_id))
    quiz = quiz_res.scalars().first()
    
    if not quiz or quiz.lecture.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Quiz not found")
        
    return {"id": quiz.id, "title": quiz.title, "questions": quiz.questions}
