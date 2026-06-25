from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.summarizer import summarize
from services.qa import answer_question
from services.question_gen import generate_questions

app = FastAPI(title="AI Tutor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SummarizeRequest(BaseModel):
    text: str


class QARequest(BaseModel):
    question: str
    context: str


class QuizRequest(BaseModel):
    text: str
    num_questions: int = 5
    difficulty: str = "medium"


@app.get("/")
def root():
    return {"status": "AI Tutor API is running"}


@app.post("/summarize")
def summarize_route(req: SummarizeRequest):
    return summarize(req.text)


@app.post("/qa")
def qa_route(req: QARequest):
    return answer_question(req.question, req.context)


@app.post("/quiz")
def quiz_route(req: QuizRequest):
    return generate_questions(req.text, req.num_questions, req.difficulty)
