import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/fcD-iW8YZHyBp1qq/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-[0_6px_30px_rgba(59,130,246,0.55)]">
            TypeRush Arcade
          </h1>
          <p className="mt-4 text-blue-200 max-w-2xl mx-auto">
            A fast, modern typing mini‑game. Race the timer, push your WPM, and track your progress over time.
          </p>
          <p className="mt-2 text-xs text-blue-300/80">Hint: Press CTRL + Enter to try again quickly</p>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
    </section>
  )
}
