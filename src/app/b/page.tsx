import Link from 'next/link'

/**
 * BARTR-B landing — skills + services marketplace
 * Green palette, same account as consumer Bartr
 */
export default function BartrBLandingPage() {
  return (
    <main
      className="min-h-screen flex flex-col"
      style={{
        background: `
          radial-gradient(900px 520px at 15% -10%, rgba(45,106,79,0.20), transparent 60%),
          radial-gradient(700px 400px at 85% 110%, rgba(82,183,136,0.10), transparent 60%),
          linear-gradient(180deg, #0a0d0b, #0a0a0a 50%, #080b09)
        `,
      }}
    >
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Link href="/" className="font-mono text-xs text-muted-2 hover:text-muted transition-colors">
          ← BARTR
        </Link>
        <Link href="/b/browse" className="btn text-xs px-3 py-1.5" style={{ borderColor: 'rgba(45,106,79,0.45)' }}>
          Browse skills
        </Link>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-3">
          <span
            className="inline-block font-mono text-xs tracking-[0.3em] uppercase px-3 py-1.5 rounded-full border"
            style={{
              color: '#52B788',
              borderColor: 'rgba(82,183,136,0.30)',
              background: 'rgba(45,106,79,0.12)',
            }}
          >
            Skills & Services
          </span>
        </div>

        <h1
          className="font-display text-[clamp(56px,14vw,120px)] leading-none tracking-widest mb-4"
          style={{ letterSpacing: '0.12em', color: '#52B788' }}
        >
          BARTR-B
        </h1>

        <p className="text-muted max-w-md text-base leading-relaxed mb-3">
          Trade your skills, not just your stuff. Freelancers and businesses exchange work — no cash, no awkward invoices.
        </p>
        <p className="text-muted-2 text-sm max-w-sm leading-relaxed mb-10">
          Earn Credits by delivering work. Spend them on any skill in the network, even if the timing doesn't match.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
          <Link
            href="/b/browse"
            className="w-full sm:flex-1 inline-flex items-center justify-center px-6 py-3.5 rounded-full text-base font-medium transition-all border"
            style={{
              background: 'linear-gradient(180deg, rgba(45,106,79,0.92), rgba(45,106,79,0.70))',
              borderColor: 'rgba(45,106,79,0.55)',
              color: 'white',
            }}
          >
            Browse skills
          </Link>
          <Link
            href="/b/list"
            className="w-full sm:flex-1 inline-flex items-center justify-center px-6 py-3.5 rounded-full text-base font-medium transition-all border border-white/10 text-muted hover:text-text hover:border-white/20"
          >
            Offer a skill
          </Link>
        </div>
      </section>

      {/* How it works — 3 steps */}
      <section className="px-6 py-12 max-w-3xl mx-auto w-full">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              step: '01',
              title: 'Post a brief or offer a skill',
              body: 'Describe what you need or what you do. Scope is locked upfront — no scope creep.',
            },
            {
              step: '02',
              title: 'Match, agree, milestone',
              body: 'Work is broken into milestones. Each one is agreed before it starts.',
            },
            {
              step: '03',
              title: 'Deliver → earn Credits',
              body: 'Complete a milestone, earn Credits. Spend them on any skill in the network — now or later.',
            },
          ].map(({ step, title, body }) => (
            <div
              key={step}
              className="rounded-lg border p-5"
              style={{
                background: 'rgba(45,106,79,0.06)',
                borderColor: 'rgba(45,106,79,0.20)',
              }}
            >
              <div
                className="font-mono text-xs mb-3"
                style={{ color: '#52B788' }}
              >
                {step}
              </div>
              <h3 className="font-semibold text-sm mb-2">{title}</h3>
              <p className="text-muted-2 text-xs leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Difference from Simbi / TimeBanks */}
      <section className="px-6 pb-12 max-w-3xl mx-auto w-full">
        <div
          className="rounded-lg border p-5"
          style={{
            background: 'rgba(45,106,79,0.04)',
            borderColor: 'rgba(255,255,255,0.06)',
          }}
        >
          <div className="font-mono text-xs text-muted-2 mb-3 uppercase tracking-widest">
            Not a time bank
          </div>
          <p className="text-sm text-muted leading-relaxed">
            1 hour of junior work ≠ 1 hour of senior work. Credits reflect the value of what you deliver, not time spent.
            The market sets the rate — you negotiate directly.
          </p>
        </div>
      </section>

      {/* Footer link back to consumer */}
      <footer className="text-center pb-8 text-xs text-muted-2">
        Looking to trade physical items?{' '}
        <Link href="/browse" className="underline hover:text-muted transition-colors">
          Use BARTR →
        </Link>
      </footer>
    </main>
  )
}
