import Link from 'next/link'

/**
 * Root landing — exactly three elements:
 * BARTR wordmark + Bartr button + Bartr-B button
 * Nothing else.
 */
export default function RootPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: `
          radial-gradient(900px 520px at 20% -10%, rgba(200,53,42,0.16), transparent 60%),
          radial-gradient(600px 400px at 80% 110%, rgba(45,106,79,0.12), transparent 60%),
          linear-gradient(180deg, #08090c, #0a0a0a 40%, #07080b)
        `,
      }}
    >
      <div className="flex flex-col items-center gap-12 px-6">
        {/* Wordmark */}
        <div className="flex flex-col items-center gap-2">
          <h1
            className="font-display text-[clamp(72px,18vw,160px)] leading-none tracking-widest text-white"
            style={{ letterSpacing: '0.12em' }}
          >
            BARTR
          </h1>
          <p className="font-mono text-muted text-sm tracking-widest uppercase">
            Trade what you have for what you love
          </p>
        </div>

        {/* Two buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm">
          <Link
            href="/browse"
            className="btn btn-primary btn-lg w-full sm:w-auto flex-1 font-display text-lg tracking-widest"
          >
            BARTR
          </Link>

          <Link
            href="/b"
            className="btn btn-green btn-lg w-full sm:w-auto flex-1 font-display text-lg tracking-widest"
          >
            BARTR-B
          </Link>
        </div>
      </div>
    </main>
  )
}
