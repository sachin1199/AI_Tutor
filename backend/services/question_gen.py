import os
from groq import Groq
from dotenv import load_dotenv

from utils.text_processing import clean_text
import json
load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

DIFFICULTY_PROMPTS = {
    "easy": (
        "Generate ONLY recall-based questions. Each question must start with: "
        "'What is', 'Define', 'Who', 'When', or 'Where'. "
        "These should test basic memory of facts and definitions."
    ),
    "medium": (
        "Generate ONLY explanation-based questions. Each question must start with: "
        "'How does', 'Why does', 'Why is', or 'Explain how'. "
        "These should require the student to explain mechanisms and relationships, not just recall facts."
    ),
    "hard": (
        "Generate ONLY deep reasoning questions. Use formats like: "
        "'What would happen if X were removed?', "
        "'Why does X perform better than Y?', "
        "'How does X improve Z?', "
        "'What is the consequence of...', "
        "'Compare X and Y in terms of...'. "
        "These must require critical thinking, not simple recall."
    )
}

def generate_questions(text: str, num_questions: int = 5, difficulty: str = "medium") -> dict:
    text = clean_text(text)
    if not text:
        return {"error": "No text provided."}

    difficulty_instruction = DIFFICULTY_PROMPTS.get(difficulty, DIFFICULTY_PROMPTS["medium"])

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": (
                    f"You are an expert educator generating quiz questions. {difficulty_instruction} "
                    f"Important rules: do NOT just reword sentences from the text, "
                    f"questions must require thinking not just copying, "
                    f"include specific technical terms from the text. "
                    f"Return ONLY a JSON array of question strings, no other text. "
                    f'Example format: ["Question 1?", "Question 2?"]'
                )
            },
            {"role": "user", "content": f"Generate exactly {num_questions} {difficulty} questions from these notes:\n\n{text}"}
        ],
        max_tokens=600,
    )

    raw = response.choices[0].message.content.strip()

    try:
        start = raw.index("[")
        end = raw.rindex("]") + 1
        questions = json.loads(raw[start:end])
        return {"questions": questions[:num_questions]}
    except Exception:
        lines = [l.strip().lstrip("0123456789.-) ") for l in raw.split("\n") if "?" in l]
        return {"questions": lines[:num_questions]}
