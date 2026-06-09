from langchain_openai import ChatOpenAI
from app.core.config import settings

class StudyPlanService:
    def __init__(self):
        self.llm = ChatOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

    async def generate_plan(self, weak_topics: list):
        if not self.llm: return "Mock Study Plan: Focus on " + ", ".join(weak_topics)
        
        prompt = f"Create a 3-day study plan to improve these topics: {', '.join(weak_topics)}"
        response = await self.llm.ainvoke(prompt)
        return response.content

studyplan_service = StudyPlanService()
