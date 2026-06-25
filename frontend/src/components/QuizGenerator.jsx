import { useState } from 'react'
import { api } from '../api/client'

export default function QuizGenerator({ notes }) {
  const [numQ, setNumQ] = useState(5)
  const [difficulty, setDifficulty] = useState('medium')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [revealed, setRevealed] = useState({})

  async function handleGenerate() {
    if (!notes.trim()) return
    setLoading(true)
    setError('')
    setQuestions([])
    setRevealed({})
    try {
      const data = await api.quiz(notes, numQ, difficulty)
      if (data.error) setError(data.error)
      else if (!data.questions || data.questions.length === 0)
        setError('No questions could be generated. Try longer or more detailed notes.')
      else setQuestions(data.questions)
    } catch {
      setError('Could not connect to backend. Is it running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {!notes.trim() && (
        <div style={{ background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, padding: 12, fontSize: 14, color: '#7a6200' }}>
          Paste your notes in the Summarizer tab first.
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 13, color: '#555' }}>Questions</label>
          <input
            type="number"
            min={1} max={10}
            value={numQ}
            onChange={e => setNumQ(Number(e.target.value))}
            style={{ width: 60 }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 13, color: '#555' }}>Difficulty</label>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading || !notes.trim()}
          style={{ background: '#6c63ff', color: '#fff' }}
        >
          {loading ? 'Generating...' : 'Generate Quiz'}
        </button>
      </div>

      {error && (
        <div style={{ background: '#fff0f0', border: '1px solid #fcc', borderRadius: 8, padding: 12, color: '#c00', fontSize: 14 }}>
          {error}
        </div>
      )}

      {questions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {questions.map((q, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: 16 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a', marginBottom: 10 }}>
                {i + 1}. {q}
              </p>
              {!revealed[i] ? (
                <button
                  onClick={() => setRevealed(r => ({ ...r, [i]: true }))}
                  style={{ fontSize: 12, background: '#f0f4ff', color: '#6c63ff', border: '1px solid #c5d0ff', padding: '4px 12px' }}
                >
                  Think about it... (tap to mark done)
                </button>
              ) : (
                <span style={{ fontSize: 12, color: '#1D9E75', fontWeight: 500 }}>Answered</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
