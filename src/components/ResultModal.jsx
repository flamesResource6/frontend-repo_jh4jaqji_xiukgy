import { useEffect } from 'react'

export default function ResultModal({ open, onClose, result, history, onTryAgain }) {
  useEffect(() => {
    function onKey(e) {
      if (!open) return
      if (e.key === 'Escape') onClose?.()
      if (e.ctrlKey && e.key === 'Enter') onTryAgain?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, onTryAgain])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-slate-900 border border-blue-500/30 rounded-2xl shadow-2xl w-[92vw] max-w-2xl mx-auto p-6 text-blue-100">
        <h3 className="text-2xl font-bold">Your Result</h3>
        <p className="text-blue-300/80 text-sm">Completed typing test summary</p>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <Card label="WPM" value={result?.wpm ?? 0} />
          <Card label="Accuracy" value={`${result?.accuracy ?? 0}%`} />
          <Card label="Mistakes" value={result?.mistakes ?? 0} />
        </div>

        <div className="mt-6">
          <h4 className="text-sm uppercase tracking-widest text-blue-400/80 mb-2">Progress</h4>
          <MiniLineChart data={history} />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs text-blue-300/80">Tip: CTRL + Enter to restart</span>
          <div className="flex gap-2">
            <button onClick={onTryAgain} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">Try again</button>
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600">Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Card({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-800/70 border border-blue-500/20 p-4 text-center">
      <div className="text-[10px] uppercase tracking-widest text-blue-400/80">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}

function MiniLineChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="h-28 rounded-lg bg-slate-800/70 border border-blue-500/20 flex items-center justify-center text-blue-300/70">No data yet</div>
  }
  const width = 560
  const height = 120
  const padding = 20

  const wpmValues = data.map(d => d.wpm)
  const min = Math.min(...wpmValues)
  const max = Math.max(...wpmValues)
  const range = Math.max(1, max - min)

  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(1, data.length - 1)) * (width - padding * 2)
    const y = height - padding - ((d.wpm - min) / range) * (height - padding * 2)
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} className="w-full h-28">
      <polyline fill="none" stroke="#60a5fa" strokeWidth="3" points={points} />
      {data.map((d, i) => {
        const x = padding + (i / Math.max(1, data.length - 1)) * (width - padding * 2)
        const y = height - padding - ((d.wpm - min) / range) * (height - padding * 2)
        return <circle key={i} cx={x} cy={y} r="3" fill="#93c5fd" />
      })}
    </svg>
  )
}
