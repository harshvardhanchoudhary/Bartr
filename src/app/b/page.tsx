import Link from 'next/link'
import { BHeroServices } from '@/components/b/BHeroServices'
import { DEMO_SERVICES } from '@/lib/demo-data'

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: '◎',
    title: 'Offer a skill or post a brief',
    body: 'List what you do or describe what you need. Scope is locked when matched — no surprises.',
  },
  {
    step: '02',
    icon: '⇄',
    title: 'Match and agree milestones',
    body: 'Work is broken into milestones. Each one scoped and agreed before it starts.',
  },
  {
    step: '03',
    icon: '✦',
    title: 'Deliver → earn Credits',
    body: 'Complete a milestone, earn Credits. Spend them on any skill in the network — design, dev, copy, strategy.',
  },
]

export default function BartrBLandingPage() {
  const sampleServices = DEMO_SERVICES.slice(0, 6)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 52,
        background: 'rgba(246,244,241,0.94)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--brd)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/" style={{
            fontFamily: 'var(--font-instrument-serif)', fontSize: 20,
            color: 'var(--ink)', textDecoration: 'none',
          }}>
            Bartr
          </Link>
          <span style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 10,
            color: 'var(--grn)', background: 'var(--gbg)',
            border: '1px solid var(--gbd)', borderRadius: 99,
            padding: '2px 8px', letterSpacing: '0.06em',
          }}>
            B
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/b/briefs" style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 11,
            color: 'var(--muted)', padding: '5px 10px', textDecoration: 'none',
          }}>
            Open briefs
          </Link>
          <Link href="/b/browse" style={{
            padding: '5px 14px', borderRadius: 99,
            background: 'var(--grn)', color: 'white',
            fontFamily: 'var(--font-dm-sans)', fontSize: 13, fontWeight: 500,
            border: '1px solid #136038', textDecoration: 'none',
          }}>
            Browse skills
          </Link>
          <Link href="/login" style={{
            fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: 'var(--ink2)',
            padding: '5px 14px', border: '1px solid var(--brd2)',
            borderRadius: 99, background: 'var(--surf)', textDecoration: 'none',
          }}>
            Sign in
          </Link>
        </div>
      </nav>

      {/* ── Hero: split layout ── */}
      <section
        className="hero-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
          minHeight: 'calc(100svh - 52px)',
          maxHeight: 700,
        }}
      >
        {/* Left: pitch */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '40px 32px 40px 24px',
          borderRight: '1px solid var(--brd)',
        }}>
          <div style={{
            display: 'inline-flex', alignSelf: 'flex-start',
            fontFamily: 'var(--font-dm-mono)', fontSize: 10,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--grn)',
            background: 'var(--gbg)', border: '1px solid var(--gbd)',
            padding: '4px 10px', borderRadius: 99, marginBottom: 24,
          }}>
            Skills marketplace
          </div>

          <h1 style={{
            fontFamily: 'var(--font-instrument-serif)',
            fontSize: 'clamp(32px, 5vw, 52px)',
            lineHeight: 1.06, color: 'var(--ink)',
            letterSpacing: '-0.02em', marginBottom: 20,
          }}>
            Trade your skills,<br />not just your stuff
          </h1>

          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 12, maxWidth: 340 }}>
            Offer your expertise. Apply to briefs. Earn Credits —
            a currency that works across the whole Bartr network.
          </p>
          <p style={{ fontSize: 12, color: 'var(--faint)', fontFamily: 'var(--font-dm-mono)', marginBottom: 32, maxWidth: 320 }}>
            1 hr of senior work ≠ 1 hr of junior work. The market sets the rate.
          </p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            <Link href="/b/browse" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '13px 28px', borderRadius: 99,
              background: 'var(--grn)', color: 'white',
              fontFamily: 'var(--font-dm-sans)', fontSize: 15, fontWeight: 500,
              border: '1px solid #136038', textDecoration: 'none',
            }}>
              Browse skills →
            </Link>
            <Link href="/b/list" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '13px 24px', borderRadius: 99,
              background: 'var(--surf)', color: 'var(--ink2)',
              fontFamily: 'var(--font-dm-sans)', fontSize: 15, fontWeight: 500,
              border: '1px solid var(--brd2)', textDecoration: 'none',
            }}>
              Offer a skill
            </Link>
          </div>

          {/* Mini trust strip */}
          <div style={{
            display: 'flex', gap: 20, marginTop: 36,
            paddingTop: 24, borderTop: '1px solid var(--brd)',
            flexWrap: 'wrap',
          }}>
            {[
              { label: '50c free', desc: 'On join' },
              { label: 'No fees', desc: 'Keep all credits' },
              { label: 'Milestone', desc: 'Scope-locked' },
            ].map(t => (
              <div key={t.label}>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{t.label}</div>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: 'var(--faint)', letterSpacing: '0.06em', marginTop: 1 }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: animated service cards */}
        <BHeroServices services={sampleServices} />
      </section>

      {/* ── Credits economy strip ── */}
      <div style={{
        borderTop: '1px solid var(--gbd)', borderBottom: '1px solid var(--gbd)',
        background: 'var(--gbg)', padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 32, flexWrap: 'wrap',
      }}>
        {[
          { label: 'New members get', value: '50c free' },
          { label: 'Any skill', value: 'Design, dev, copy…' },
          { label: 'Spendable anywhere', value: 'In network' },
          { label: 'Invoices', value: 'Zero' },
        ].map(item => (
          <div key={item.label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 13, fontWeight: 500, color: 'var(--grn)' }}>{item.value}</div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.06em', marginTop: 2 }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* ── How it works ── */}
      <section style={{ padding: '48px 20px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{
          fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 28, textAlign: 'center',
        }}>
          How Bartr-B works
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {HOW_IT_WORKS.map(({ step, icon, title, body }) => (
            <div key={step} style={{
              padding: '20px 18px',
              background: 'var(--surf)', border: '1px solid var(--gbd)',
              borderRadius: 'var(--rl)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--grn)',
                  background: 'var(--gbg)', border: '1px solid var(--gbd)',
                  width: 30, height: 30, borderRadius: 99,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {step}
                </div>
                <span style={{ fontSize: 18 }}>{icon}</span>
              </div>
              <div style={{ fontWeight: 500, color: 'var(--ink)', marginBottom: 6, fontSize: 14, lineHeight: 1.3 }}>
                {title}
              </div>
              <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.65 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dual CTA ── */}
      <section style={{ padding: '0 20px 56px', maxWidth: 680, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{
            padding: '24px 20px', borderRadius: 'var(--rl)',
            background: 'var(--gbg)', border: '1px solid var(--gbd)',
          }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>◎</div>
            <div style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 18, color: 'var(--ink)', marginBottom: 8 }}>
              Have a skill?
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16 }}>
              List what you do, set your credit rate, and start earning from the network.
            </p>
            <Link href="/b/list" style={{
              display: 'inline-flex', padding: '10px 20px', borderRadius: 99,
              background: 'var(--grn)', color: 'white',
              fontFamily: 'var(--font-dm-sans)', fontSize: 13, fontWeight: 500,
              border: '1px solid #136038', textDecoration: 'none',
            }}>
              Offer a skill →
            </Link>
          </div>
          <div style={{
            padding: '24px 20px', borderRadius: 'var(--rl)',
            background: 'var(--surf)', border: '1px solid var(--brd)',
          }}>
            <div style={{ fontSize: 24, marginBottom: 12 }}>✦</div>
            <div style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 18, color: 'var(--ink)', marginBottom: 8 }}>
              Need a skill?
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16 }}>
              Post a brief with your scope, budget in Credits, and timeline. Providers apply.
            </p>
            <Link href="/b/briefs/new" style={{
              display: 'inline-flex', padding: '10px 20px', borderRadius: 99,
              background: 'var(--surf)', color: 'var(--ink2)',
              fontFamily: 'var(--font-dm-sans)', fontSize: 13, fontWeight: 500,
              border: '1px solid var(--brd2)', textDecoration: 'none',
            }}>
              Post a brief →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--brd)', padding: '24px 20px 40px' }}>
        <div style={{
          maxWidth: 680, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 16, color: 'var(--ink)' }}>Bartr-B</span>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)' }}>Trade your skills for what you need.</span>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { label: '← Bartr', href: '/' },
              { label: 'Browse', href: '/b/browse' },
              { label: 'Briefs', href: '/b/briefs' },
              { label: 'Terms', href: '/legal/terms' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--faint)',
                textDecoration: 'none', letterSpacing: '0.04em',
              }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
