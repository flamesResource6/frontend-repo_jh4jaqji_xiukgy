import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const DEFAULT_TIME = 30

const sampleTexts = [
  'The quick brown fox jumps over the lazy dog',
  'Practice makes progress, keep typing and stay focused',
  'JavaScript and React make interactive web apps fun to build',
  'Typing fast is a superpower for gamers and coders alike',
  'Speed, accuracy, and rhythm are keys to master typing',
]

function useCountdown(seconds, onFinish) {
  const [time, setTime] = useState(seconds)
  const timerRef = useRef(null)

  const start = useCallback(() => {
    clearInterval(timerRef.current)
    setTime(seconds)
    timerRef.current = setInterval(() => {
      setTime(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          onFinish?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [seconds, onFinish])

  const stop = useCallback(() => {
    clearInterval(timerRef.current)
  }, [])

  const reset = useCallback(() => {
    clearInterval(timerRef.current)
    setTime(seconds)
  }, [seconds])

  useEffect(() => () => clearInterval(timerRef.current), [])

  return { time, start, stop, reset }
}

export default function TypingGame({ onFinish }) {
  const [text, setText] = useState('')
  const [input, setInput] = useState('')
  const [started, setStarted] = useState(false)
  const [mistakes, setMistakes] = useState(0)
  const [duration, setDuration] = useState(DEFAULT_TIME)

  const { time, start, stop, reset } = useCountdown(duration, () => handleFinish(true))

  const words = useMemo(() => text.split(' '), [text])
  const chars = useMemo(() => text.split(''), [text])

  useEffect(() => {
    // pick random text on mount
    setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)])
  }, [])

  const accuracy = useMemo(() => {
    if (!input.length) return 100
    let correct = 0
    for (let i = 0; i < input.length; i++) {
      if (input[i] === text[i]) correct++
    }
    return Math.max(0, Math.round((correct / input.length) * 100))
  }, [input, text])

  const wpm = useMemo(() => {
    const wordsTyped = input.trim().split(/\s+/).filter(Boolean).length
    const elapsed = duration - time || 1
    return Math.round((wordsTyped / (elapsed / 60)) || 0)
  }, [input, time, duration])

  const handleChange = (e) => {
    const val = e.target.value
    // count mistakes: character mismatch at current position
    const idx = val.length - 1
    if (idx >= 0 && text[idx] !== val[idx]) setMistakes(m => m + 1)
    setInput(val)
    if (!started && val.length > 0) {
      setStarted(true)
      start()
    }
    if (val.length >= text.length) {
      handleFinish(false)
    }
  }

  const tryAgain = useCallback(() => {
    stop()
    setInput('')
    setMistakes(0)
    setStarted(false)
    setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)])
    reset()
  }, [reset, stop])

  const handleFinish = useCallback((timeUp) => {
    stop()
    const result = {
      wpm,
      accuracy,
      mistakes,
      duration,
      timestamp: new Date().toISOString()
    }
    onFinish?.(result)
  }, [wpm, accuracy, mistakes, duration, stop, onFinish])

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault()
        tryAgain()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [tryAgain])

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Stat label="Timer" value={`${time}s`} />
          <Stat label="WPM" value={wpm} />
          <Stat label="Accuracy" value={`${accuracy}%`} />
          <Stat label="Mistakes" value={mistakes} />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={tryAgain} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition">
            Try again (Ctrl + Enter)
          </button>
          <select
            className="bg-slate-800 text-blue-200 border border-blue-500/30 rounded-lg px-3 py-2"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            <option value={15}>15s</option>
            <option value={30}>30s</option>
            <option value={60}>60s</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-blue-500/20 bg-slate-900/60 p-6">
        <div className="text-sm uppercase text-blue-400/80 tracking-widest mb-3">Type this</div>
        <div className="text-xl md:text-2xl leading-relaxed">
          {chars.map((c, i) => {
            const typed = input[i]
            const status = typed == null ? 'pending' : typed === c ? 'correct' : 'wrong'
            return (
              <span key={i} className={
                status === 'pending' ? 'text-blue-300/50' : status === 'correct' ? 'text-blue-100' : 'text-rose-400'
              }>
                {c}
              </span>
            )
          })}
        </div>

        <input
          autoFocus
          className="mt-6 w-full bg-slate-800 border border-blue-500/30 rounded-lg p-3 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={handleChange}
          placeholder="Start typing here..."
        />
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="px-3 py-2 rounded-lg bg-slate-800/70 border border-blue-500/20 text-blue-100">
      <div className="text-[10px] uppercase tracking-widest text-blue-400/80">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  )
}
