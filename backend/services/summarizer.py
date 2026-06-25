import os
from groq import Groq
from dotenv import load_dotenv
from utils.text_processing import clean_text, is_too_short
load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def summarize(text: str) -> dict:
    text = clean_text(text)
    if is_too_short(text):
        return {"error": "Text is too short. Please paste at least a few sentences."}

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert study assistant. Summarize the following notes in exactly 4 sentences. "
                    "Rules: no repeated ideas across sentences, include specific technical terms from the text, "
                    "each sentence must add new information not covered by the previous ones, "
                    "prioritize mechanisms and relationships over basic definitions."
                )
            },
            {"role": "user", "content": f"Summarize these notes:\n\n{text}"}
        ],
        max_tokens=300,
    )

    raw = response.choices[0].message.content.strip()
    cleaned = _remove_redundancy(raw)
    return {"summary": cleaned}


def _remove_redundancy(text: str) -> str:
    sentences = [s.strip() for s in text.split('.') if s.strip()]
    seen_phrases = []
    unique = []
    for sentence in sentences:
        words = set(sentence.lower().split())
        is_redundant = any(
            len(words & set(prev.lower().split())) / max(len(words), 1) > 0.6
            for prev in seen_phrases
        )
        if not is_redundant:
            unique.append(sentence)
            seen_phrases.append(sentence)
    return '. '.join(unique) + '.'
