import { useState } from 'react'
import { api } from '../api/client'

export default function Summarizer({ notes, setNotes }) {
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSummarize() {
    if (!notes.trim()) return
    setLoading(true)
    setError('')
    setSummary('')
    try {
      const data = await api.summarize(notes)
      if (data.error) setError(data.error)
      else setSummary(data.summary)
    } catch {
      setError('Could not connect to backend. Is it running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 6 }}>
          Paste your notes
        </label>
        <textarea
          rows={10}
          placeholder="Paste lecture notes, textbook passages, or any study material here..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </div>

      <button
        onClick={handleSummarize}
        disabled={loading || !notes.trim()}
        style={{ background: '#6c63ff', color: '#fff', alignSelf: 'flex-start' }}
      >
        {loading ? 'Summarizing...' : 'Summarize'}
      </button>

      {error && (
        <div style={{ background: '#fff0f0', border: '1px solid #fcc', borderRadius: 8, padding: 12, color: '#c00', fontSize: 14 }}>
          {error}
        </div>
      )}

      {summary && (
        <div style={{ background: '#f0f4ff', border: '1px solid #c5d0ff', borderRadius: 8, padding: 16 }}>
          <p style={{ fontSize: 13, color: '#6c63ff', fontWeight: 500, marginBottom: 8 }}>Summary</p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#1a1a1a' }}>{summary}</p>
        </div>
      )}
    </div>
  )
}
