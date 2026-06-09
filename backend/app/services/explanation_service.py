from app.core.config import settings
from app.core.config import settings

class ExplanationService:
    def __init__(self):
        self.llm = None
        self._initialized = False

    def _initialize(self):
        if self._initialized: return
        try:
            from langchain_openai import ChatOpenAI
            self.llm = ChatOpenAI(
                temperature=0.7, 
                model="gpt-3.5-turbo",
                api_key=settings.OPENAI_API_KEY or "mock-key",
            ) if settings.OPENAI_API_KEY else None
        except ImportError:
            self.llm = None
        self._initialized = True

    async def generate_summary(self, transcript: str) -> str:
        self._initialize()
        if not self.llm: return "Mock Summary: LLM API Key Missing."
        
        from langchain_core.prompts import PromptTemplate
        prompt = PromptTemplate.from_template(
            "Summarize the following lecture transcript in 3 concise paragraphs:\n\n{transcript}"
        )
        response = await self.llm.ainvoke(prompt.format(transcript=transcript[:15000])) # Limit context
        return response.content

    async def generate_explanation(self, transcript: str, level: str) -> str:
        """
        Level: "beginner", "intermediate", "advanced"
        """
        self._initialize()
        if not self.llm: return f"Mock {level} explanation."
        
        prompts = {
            "beginner": "Explain the core concepts of this lecture to a 10-year-old:",
            "intermediate": "Explain the concepts to a college undergraduate:",
            "advanced": "Explain the concepts to a PhD expert in the field:"
        }
        
        template = f"{prompts.get(level, prompts['intermediate'])}\n\n{{transcript}}"
        response = await self.llm.ainvoke(template.format(transcript=transcript[:15000]))
        return response.content

explanation_service = ExplanationService()
