import json
import re
import os

class QuizService:
    """
    Local LLM Quiz Service using HuggingFace transformers (Qwen2.5-0.5B-Instruct).
    No external API keys required - runs entirely on local GPU/CPU.
    """
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self._loaded = False

    def _load_model(self):
        """Lazy-load the model only when needed to save VRAM."""
        if self._loaded:
            return
        
        print("[QUIZ LLM] Loading Qwen2.5-0.5B-Instruct for quiz generation...")
        try:
            import torch
            from transformers import AutoModelForCausalLM, AutoTokenizer

            model_name = "Qwen/Qwen2.5-0.5B-Instruct"
            
            self.tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
            
            # FORCED CPU: WDDM driver hangs on CUDA compute
            self.model = AutoModelForCausalLM.from_pretrained(
                model_name, torch_dtype=torch.float32, trust_remote_code=True, device_map="cpu"
            )
            print("[QUIZ LLM] Model loaded on CPU (float32) - FORCED CPU MODE")
            
            self._loaded = True
        except Exception as e:
            print(f"[QUIZ LLM] Model load failed: {e}")
            self._loaded = False

    def _generate(self, prompt: str, max_new_tokens: int = 1024) -> str:
        """Run inference on the local LLM."""
        self._load_model()
        if not self.model or not self.tokenizer:
            return ""
        
        import torch
        
        messages = [
            {"role": "system", "content": "You are a helpful teaching assistant. Always respond with valid JSON only."},
            {"role": "user", "content": prompt}
        ]
        
        text = self.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        inputs = self.tokenizer([text], return_tensors="pt")
        
        device = next(self.model.parameters()).device
        inputs = {k: v.to(device) for k, v in inputs.items()}
        
        with torch.no_grad():
            output = self.model.generate(
                **inputs,
                max_new_tokens=max_new_tokens,
                temperature=0.7,
                top_p=0.9,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id
            )
        
        response = self.tokenizer.decode(output[0][inputs["input_ids"].shape[1]:], skip_special_tokens=True)
        return response.strip()

    def _extract_json(self, text: str):
        """Robustly extract JSON from LLM output."""
        # Try direct parse
        try:
            return json.loads(text)
        except Exception:
            pass
        
        # Try to find JSON array in text
        match = re.search(r'\[.*\]', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except Exception:
                pass
        
        # Try to find JSON object in text
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except Exception:
                pass
        
        return None

    async def generate_quiz(self, transcript: str, num_questions: int = 5):
        """
        Generate specified number of MCQs + Short Questions from the FULL transcript.
        """
        if not transcript or len(transcript.strip()) == 0:
            return self._smart_fallback("Empty transcript provided")
            
        # Ensure num_questions is within safe bounds (1-30)
        num_questions = max(1, min(30, num_questions))
        
        # Chunking strategy to avoid OOM while covering the whole transcript
        chunk_size = 2500
        transcript_chunks = [transcript[i:i+chunk_size] for i in range(0, len(transcript), chunk_size)]
        
        # Select chunks evenly
        if len(transcript_chunks) > num_questions:
            step = len(transcript_chunks) / num_questions
            selected_chunks = [transcript_chunks[int(i*step)] for i in range(num_questions)]
        else:
            selected_chunks = transcript_chunks * (num_questions // len(transcript_chunks) + 1)
            selected_chunks = selected_chunks[:num_questions]
            
        all_questions = []
        
        print(f"[QUIZ LLM] Generating {num_questions} MCQs + Short Questions from transcript...")
        
        for i, chunk in enumerate(selected_chunks):
            prompt = f"""Based on the following lecture transcript segment, generate EXACTLY TWO items:
1. One Multiple-Choice Question (MCQ).
2. One Concept-Based Short Question with its answer.

TRANSCRIPT SEGMENT:
{chunk}

Return a valid JSON object with exactly these fields:
{{
  "mcq": {{
    "question": "question text",
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "answer": "A/B/C/D",
    "topic": "topic name"
  }},
  "short_question": {{
    "question": "question text",
    "answer": "concise accurate answer"
  }}
}}

Return ONLY the JSON object."""

            try:
                raw = self._generate(prompt, max_new_tokens=600)
                result = self._extract_json(raw)
                    
                if isinstance(result, dict):
                    # Process MCQ
                    if "mcq" in result:
                        m = result["mcq"]
                        all_questions.append({
                            "type": "mcq",
                            "question": m.get("question", "Question?"),
                            "options": m.get("options", ["A", "B", "C", "D"]),
                            "answer": m.get("answer", "A"),
                            "topic": m.get("topic", "General")
                        })
                    
                    # Process Short Question
                    if "short_question" in result:
                        s = result["short_question"]
                        all_questions.append({
                            "type": "short",
                            "question": s.get("question", "What is discussed here?"),
                            "answer": s.get("answer", "No answer provided."),
                            "topic": result.get("mcq", {}).get("topic", "General")
                        })
                else:
                    print(f"[QUIZ LLM] WARNING: Invalid format for segment {i+1}")
            except Exception as e:
                print(f"[QUIZ LLM] WARNING: Generation failed for segment {i+1}: {e}")
                
        if len(all_questions) >= 1:
            return all_questions
            
        return self._smart_fallback(transcript)

    async def evaluate_answer(self, transcript: str, question: str, user_answer: str):
        """Evaluate a user's answer using local LLM as a teacher."""
        truncated = transcript[:2000]
        
        prompt = f"""You are a teacher evaluating a student's answer.

LECTURE CONTEXT:
{truncated}

QUESTION: {question}
STUDENT'S ANSWER: {user_answer}

Evaluate if the student's answer is correct based on the lecture content.
Return a JSON object with:
- "is_correct": true or false
- "feedback": a brief 1-2 sentence explanation

Return ONLY the JSON object."""

        try:
            raw = self._generate(prompt, max_new_tokens=300)
            result = self._extract_json(raw)
            
            if isinstance(result, dict) and "is_correct" in result:
                return {
                    "is_correct": bool(result["is_correct"]),
                    "feedback": str(result.get("feedback", "No feedback available."))
                }
        except Exception as e:
            print(f"[QUIZ LLM] Evaluation error: {e}")
        
        return {
            "is_correct": False,
            "feedback": "Evaluation could not be completed. Please review the lecture material."
        }

    def _smart_fallback(self, transcript: str):
        """Generate basic questions from transcript keywords when LLM fails."""
        words = transcript.split()
        
        # Extract potential topics from the transcript
        sentences = [s.strip() for s in transcript.replace('\n', '. ').split('.') if len(s.strip()) > 20]
        
        questions = []
        for i, sent in enumerate(sentences[:5]):
            # Create a question from each sentence
            topic_words = [w for w in sent.split() if len(w) > 4 and w[0].isupper()]
            topic = topic_words[0] if topic_words else "this topic"
            
            questions.append({
                "question": f"According to the lecture, what was discussed about {topic}?",
                "options": [
                    f"A) {sent[:60]}...",
                    "B) This was not mentioned in the lecture",
                    "C) The opposite was stated",
                    "D) This is unrelated to the lecture content"
                ],
                "answer": "A",
                "topic": topic
            })
        
        if not questions:
            questions = [{
                "question": "What is the main topic of this lecture?",
                "options": ["A) The subject discussed", "B) Unrelated topic", "C) Not mentioned", "D) None of the above"],
                "answer": "A",
                "topic": "General"
            }]
        
        return questions

quiz_service = QuizService()

