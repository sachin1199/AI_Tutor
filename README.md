# AI Tutor

A full-stack AI-powered study tool with Summarization, Q&A, and Quiz generation.

## Stack

* **Backend:** FastAPI + HuggingFace Transformers (Python)
* **Frontend:** React + Vite

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/sachin1199/AI_Tutor.git
cd ai-tutor
```

### 2. Create and activate a virtual environment

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Linux/macOS:

```bash
source venv/bin/activate
```

### 3. Install backend dependencies

```bash
pip install -r backend/requirements.txt
```

### 4. Start the backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000

---

### 5. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

## Models Used

| Feature         | Model                         |
| --------------- | ----------------------------- |
| Summarization   | sshleifer/distilbart-cnn-12-6 |
| Q&A             | deepset/minilm-uncased-squad2 |
| Quiz Generation | valhalla/t5-small-qg-prepend  |

Models are automatically downloaded on first run and cached locally for future use.

---

## Usage

1. Open http://localhost:5173
2. Paste notes into the Summarizer tab
3. Ask questions in the Q&A tab
4. Generate practice questions in the Quiz tab
