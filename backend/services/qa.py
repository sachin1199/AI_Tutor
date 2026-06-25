import os
from dotenv import load_dotenv
from groq import Groq
from utils.text_processing import clean_text
load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def answer_question(question: str, context: str) -> dict:
    context = clean_text(context)
    question = clean_text(question)

    if not question or not context:
        return {"error": "Both question and notes are required."}

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a precise study assistant. Answer the student's question using only the provided notes. "
                    "Rules: be concise and direct, use technical terms from the notes, "
                    "if the answer requires explaining a mechanism do so step by step, "
                    "if the answer is not in the notes say exactly: 'This topic is not covered in your notes.' "
                    "Never make up information not present in the notes."
                )
            },
            {"role": "user", "content": f"Notes:\n{context}\n\nQuestion: {question}"}
        ],
        max_tokens=400,
    )
    return {"answer": response.choices[0].message.content.strip(), "confidence": None}
