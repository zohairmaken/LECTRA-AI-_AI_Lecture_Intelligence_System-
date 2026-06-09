from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.api import deps
from app.schemas.all import ChatRequest, ChatResponse
from app.services.rag_service import rag_service
from app.core.config import settings

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat_with_lecture(
    request: ChatRequest,
    current_user = Depends(deps.get_current_user)
):
    # 1. Retrieve Context
    context_docs = rag_service.query(request.lecture_id, request.message)
    context_text = "\n".join(context_docs) if context_docs else ""
    
    try:
        from langchain_openai import ChatOpenAI
        llm = ChatOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
    except ImportError:
        llm = None
        
    if not llm:
        return {"response": "Mock Response: OpenAI Key Missing", "sources": context_docs or []}

    # 2. Generate Answer
    prompt = f"""
    Answer the user query based ONLY on the following context from the lecture.
    
    CONTEXT:
    {context_text}
    
    QUERY:
    {request.message}
    """
    
    response = await llm.ainvoke(prompt)
    
    return {
        "response": response.content,
        "sources": context_docs or []
    }
