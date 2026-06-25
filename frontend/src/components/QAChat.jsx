import { useState } from 'react'
import { api } from '../api/client'

export default function QAChat({ notes }) {
  const [question, setQuestion] = useState('')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleAsk() {
    if (!question.trim() || !notes.trim()) return
    const q = question.trim()
    setQuestion('')
    setLoading(true)
    setHistory(h => [...h, { role: 'user', text: q }])
    try {
      const data = await api.ask(q, notes)
      const answerText = data.error
        ? data.error
        : `${data.answer}${data.confidence ? ` (confidence: ${data.confidence}%)` : ''}`
      setHistory(h => [...h, { role: 'ai', text: answerText }])
    } catch {
      setHistory(h => [...h, { role: 'ai', text: 'Could not connect to backend.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk() }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {!notes.trim() && (
        <div style={{ background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, padding: 12, fontSize: 14, color: '#7a6200' }}>
          Paste your notes in the Summarizer tab first — QA answers from your notes.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 300, background: '#fafafa', borderRadius: 8, padding: 16, border: '1px solid #eee' }}>
        {history.length === 0 && (
          <p style={{ color: '#aaa', fontSize: 14, textAlign: 'center', marginTop: 'auto', marginBottom: 'auto' }}>
            Ask anything about your notes
          </p>
        )}
        {history.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            background: msg.role === 'user' ? '#6c63ff' : '#fff',
            color: msg.role === 'user' ? '#fff' : '#1a1a1a',
            border: msg.role === 'ai' ? '1px solid #e0e0e0' : 'none',
            borderRadius: 10,
            padding: '8px 14px',
            maxWidth: '80%',
            fontSize: 14,
            lineHeight: 1.6,
          }}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '8px 14px', fontSize: 14, color: '#aaa' }}>
            Thinking...
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          style={{ flex: 1 }}
          placeholder="Ask a question about your notes..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading || !notes.trim()}
        />
        <button
          onClick={handleAsk}
          disabled={loading || !question.trim() || !notes.trim()}
          style={{ background: '#6c63ff', color: '#fff' }}
        >
          Ask
        </button>
      </div>
    </div>
  )
}
