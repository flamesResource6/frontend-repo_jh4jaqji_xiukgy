import { useCallback, useEffect, useMemo, useState } from 'react'
import Hero from './components/Hero'
import TypingGame from './components/TypingGame'
import ResultModal from './components/ResultModal'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  const [showResult, setShowResult] = useState(false)
  const [lastResult, setLastResult] = useState(null)
  const [history, setHistory] = useState([])

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/results`)
      if (res.ok) {
        const data = await res.json()
        setHistory(data)
      }
    } catch (e) {
      // ignore if backend/db not configured
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleFinish = useCallback(async (result) => {
    setLastResult(result)
    setShowResult(true)
    try {
      await fetch(`${API_BASE}/api/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      })
    } catch (e) {
      // ignore errors to keep game flowing
    }
    fetchHistory()
  }, [fetchHistory])

  const handleTryAgain = useCallback(() => {
    setShowResult(false)
    // nothing else, TypingGame exposes own reset via key combo
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-blue-100">
      <Hero />

      <main className="relative z-10 max-w-4xl mx-auto px-6 pb-24 -mt-24">
        <div className="rounded-3xl border border-blue-500/20 bg-slate-900/60 backdrop-blur-md p-6 md:p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Arcade Mode</h2>
            <p className="text-blue-300/80 text-sm">Type the phrase before the timer ends. Your WPM and accuracy will be recorded.</p>
          </div>

          <TypingGame onFinish={handleFinish} />
        </div>
      </main>

      <ResultModal
        open={showResult}
        onClose={() => setShowResult(false)}
        result={lastResult}
        history={history}
        onTryAgain={handleTryAgain}
      />
    </div>
  )
}
