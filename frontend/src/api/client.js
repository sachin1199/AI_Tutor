const BASE = 'http://localhost:8000'

async function post(endpoint, body) {
  const res = await fetch(`${BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const api = {
  summarize: (text) => post('/summarize', { text }),
  ask: (question, context) => post('/qa', { question, context }),
  quiz: (text, num_questions, difficulty) => post('/quiz', { text, num_questions, difficulty }),
}
