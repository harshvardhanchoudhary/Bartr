import Link from 'next/link'

const STEPS = [
  {
    step: '01',
    title: 'Post a brief or offer a skill',
    body: 'Describe what you need or what you do. Scope is agreed upfront — no surprises.',
  },
  {
    step: '02',
    title: 'Match, agree, milestone',
    body: 'Work broken into milestones. Each one scoped before it starts.',
  },
  {
    step: '03',
    title: 'Deliver → earn Credits',
    body: 'Complete a milestone, earn Credits. Spend them on any skill in the network — now or later.',
  },
]

export default function BartrBLandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Top nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 52,
        background: 'rgba(246,244,241,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--brd)',
        position: 'sticky', top: 0, zIndex: 30,
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-instrument-serif)', fontSize: 20,
          color: 'var(--ink)', textDecoration: 'none',
        }}>
          Bartr
        </Link>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/b/browse" style={{
            padding: '5px 14px', borderRadius: 99,
            background: 'var(--grn)', color: 'white',
            fontFamily: 'var(--font-dm-sans)', fontSize: 13,
            border: '1px solid #136038', textDecoration: 'none',
          }}>
            Browse skills
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '52px 24px 40px', textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
        <div style={{
          display: 'inline-block', fontFamily: 'var(--font-dm-mono)', fontSize: 10,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--grn)',
          background: 'var(--gbg)', border: '1px solid var(--gbd)',
          padding: '4px 10px', borderRadius: 99, marginBottom: 20,
        }}>
          Skills marketplace
        </div>

        <h1 style={{
          fontFamily: 'var(--font-instrument-serif)',
          fontSize: 'clamp(36px,9vw,56px)', lineHeight: 1.1,
          color: 'var(--ink)', marginBottom: 16, letterSpacing: '-0.02em',
        }}>
          Trade your skills,<br />not just your stuff
        </h1>

        <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>
          Freelancers and businesses exchange work. No cash, no awkward invoices.
          Earn Credits by delivering — spend them on any skill in the network.
        </p>
        <p style={{ fontSize: 13, color: 'var(--faint)', lineHeight: 1.6, marginBottom: 32 }}>
          1 hr of junior work ≠ 1 hr of senior work. The market sets the rate — not a time bank.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/b/browse" style={{
            display: 'inline-flex', padding: '13px 28px', borderRadius: 99,
            background: 'var(--grn)', color: 'white',
            fontFamily: 'var(--font-dm-sans)', fontSize: 15, fontWeight: 500,
            border: '1px solid #136038', textDecoration: 'none',
          }}>
            Browse skills →
          </Link>
          <Link href="/b/list" style={{
            display: 'inline-flex', padding: '13px 24px', borderRadius: 99,
            background: 'var(--surf)', color: 'var(--ink2)',
            fontFamily: 'var(--font-dm-sans)', fontSize: 15, fontWeight: 500,
            border: '1px solid var(--brd2)', textDecoration: 'none',
          }}>
            Offer a skill
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '0 20px 48px', maxWidth: 680, margin: '0 auto' }}>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20, textAlign: 'center' }}>
          How Bartr-B works
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {STEPS.map(({ step, title, body }) => (
            <div key={step} style={{
              padding: '18px 16px',
              background: 'var(--gbg)', border: '1px solid var(--gbd)',
              borderRadius: 'var(--rl)',
            }}>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--grn)',
                marginBottom: 10,
              }}>
                {step}
              </div>
              <div style={{ fontWeight: 500, color: 'var(--ink)', marginBottom: 6, fontSize: 14, lineHeight: 1.3 }}>
                {title}
              </div>
              <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Credit economy explainer */}
      <section style={{
        margin: '0 20px 48px',
        padding: '20px 24px',
        background: 'var(--surf)', border: '1px solid var(--brd)',
        borderRadius: 'var(--rl)', maxWidth: 640,
        marginLeft: 'auto', marginRight: 'auto',
      }}>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 8 }}>
          Credits economy
        </div>
        <p style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.7 }}>
          New members start with <strong style={{ color: 'var(--grn)' }}>50c</strong> to kickstart trading.
          Deliver a milestone → earn Credits. Spend Credits on design, dev, copy, strategy — any skill in the network.
          No invoices. No payment processors. Just skills traded fairly.
        </p>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--brd)', padding: '24px 20px',
        textAlign: 'center', fontSize: 13, color: 'var(--faint)',
      }}>
        Trading physical items?{' '}
        <Link href="/browse" style={{ color: 'var(--red)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
          Use Bartr →
        </Link>
      </footer>
    </div>
  )
}
