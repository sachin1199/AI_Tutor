import { useState } from 'react'
import Summarizer from './components/Summarizer'
import QAChat from './components/QAChat'
import QuizGenerator from './components/QuizGenerator'

const TABS = ['Summarizer', 'Ask Questions', 'Quiz']

export default function App() {
  const [activeTab, setActiveTab] = useState(0)
  const [notes, setNotes] = useState('')

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f0' }}>
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #e0e0e0',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 32,
        height: 56,
      }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#6c63ff', letterSpacing: '-0.5px' }}>
          AI Tutor
        </span>
        <nav style={{ display: 'flex', gap: 4 }}>
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              style={{
                background: activeTab === i ? '#f0f4ff' : 'transparent',
                color: activeTab === i ? '#6c63ff' : '#555',
                border: 'none',
                borderRadius: 6,
                padding: '6px 14px',
                fontSize: 14,
                fontWeight: activeTab === i ? 500 : 400,
              }}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #e0e0e0',
          padding: 24,
        }}>
          {activeTab === 0 && <Summarizer notes={notes} setNotes={setNotes} />}
          {activeTab === 1 && <QAChat notes={notes} />}
          {activeTab === 2 && <QuizGenerator notes={notes} />}
        </div>
      </main>
    </div>
  )
}
