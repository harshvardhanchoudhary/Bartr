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
    body: 'Complete a milestone, earn Credits. Spend them on any skill in the network.',
  },
]

const STATS = [
  { value: '50c', label: 'Free on join' },
  { value: '0', label: 'Platform fees' },
  { value: '∞', label: 'Skills available' },
  { value: '100%', label: 'Scope locked' },
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
        background: 'rgba(246,244,241,0.92)',
        backdropFilter: 'blur(20px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
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
            display: 'none',
          }} className="sm-show">
            Open briefs
          </Link>
          <Link href="/b/browse" style={{
            padding: '6px 16px', borderRadius: 99,
            background: 'var(--grn)', color: 'white',
            fontFamily: 'var(--font-dm-sans)', fontSize: 13, fontWeight: 500,
            border: '1px solid #047857', textDecoration: 'none',
          }}>
            Browse skills
          </Link>
          <Link href="/login" style={{
            fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: 'var(--ink2)',
            padding: '6px 14px', border: '1px solid var(--brd2)',
            borderRadius: 99, background: 'var(--surf)', textDecoration: 'none',
            display: 'none',
          }} className="sm-show">
            Sign in
          </Link>
        </div>
      </nav>

      {/* ── Hero: dark emerald bg so glassmorphism is visible ── */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #022c22 0%, #065f46 40%, #047857 70%, #059669 100%)',
        overflow: 'hidden',
        minHeight: 520,
      }}>
        {/* Grid texture */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        {/* Glows */}
        <div style={{
          position: 'absolute', top: -100, right: -100, zIndex: 0,
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(52,211,153,0.14) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: '15%', zIndex: 0,
          width: 350, height: 350, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(5,150,105,0.18) 0%, transparent 70%)',
        }} />

        {/* Content: stacks on mobile, side-by-side on wide */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr)',
          maxWidth: 1100,
          margin: '0 auto',
        }} className="b-hero-grid">

          {/* Left: pitch */}
          <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '48px 24px 32px',
          }}>
            <div style={{
              display: 'inline-flex', alignSelf: 'flex-start',
              fontFamily: 'var(--font-dm-mono)', fontSize: 9,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'rgba(52,211,153,0.9)',
              background: 'rgba(52,211,153,0.1)',
              border: '1px solid rgba(52,211,153,0.25)',
              padding: '4px 12px', borderRadius: 99, marginBottom: 24,
            }}>
              Skills marketplace · Credits economy
            </div>

            <h1 style={{
              fontFamily: 'var(--font-instrument-serif)',
              fontSize: 'clamp(28px, 5vw, 50px)',
              lineHeight: 1.06, color: '#fff',
              letterSpacing: '-0.02em', marginBottom: 20,
            }}>
              Trade your skills,<br />not just your stuff
            </h1>

            <p style={{
              fontSize: 15, color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.65, marginBottom: 10, maxWidth: 380,
            }}>
              Offer your expertise. Apply to briefs. Earn Credits —
              a currency that works across the whole Bartr network.
            </p>
            <p style={{
              fontSize: 10, color: 'rgba(255,255,255,0.4)',
              fontFamily: 'var(--font-dm-mono)', marginBottom: 32, maxWidth: 320,
              letterSpacing: '0.02em',
            }}>
              1 hr senior work ≠ 1 hr junior work. The market sets the rate.
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
              <Link href="/b/browse" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '13px 28px', borderRadius: 99,
                background: '#059669', color: '#fff',
                fontFamily: 'var(--font-dm-sans)', fontSize: 15, fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.15)',
                textDecoration: 'none',
                boxShadow: '0 4px 24px rgba(5,150,105,0.45)',
              }}>
                Browse skills →
              </Link>
              <Link href="/b/list" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '13px 24px', borderRadius: 99,
                background: 'rgba(255,255,255,0.10)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                color: 'rgba(255,255,255,0.85)',
                fontFamily: 'var(--font-dm-sans)', fontSize: 15, fontWeight: 500,
                border: '1px solid rgba(255,255,255,0.2)',
                textDecoration: 'none',
              }}>
                Offer a skill
              </Link>
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex', gap: 20, flexWrap: 'wrap',
              paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.12)',
            }}>
              {STATS.map(s => (
                <div key={s.label}>
                  <div style={{
                    fontFamily: 'var(--font-dm-mono)', fontSize: 16,
                    fontWeight: 600, color: 'rgba(52,211,153,0.9)',
                  }}>
                    {s.value}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                    color: 'rgba(255,255,255,0.4)',
                    letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2,
                  }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: glass service cards — visible because dark bg behind them */}
          <div className="b-hero-right">
            <BHeroServices services={sampleServices} />
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: '56px 20px 0', maxWidth: 740, margin: '0 auto' }}>
        <div style={{
          textAlign: 'center', marginBottom: 36,
        }}>
          <div style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8,
          }}>
            How Bartr-B works
          </div>
          <div style={{
            fontFamily: 'var(--font-instrument-serif)',
            fontSize: 'clamp(22px, 3vw, 32px)',
            color: 'var(--ink)', lineHeight: 1.2,
          }}>
            Skills meet Credits. Work meets reward.
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {HOW_IT_WORKS.map(({ step, icon, title, body }) => (
            <div key={step} style={{
              padding: '22px 20px',
              background: 'var(--surf)', border: '1px solid var(--brd)',
              borderRadius: 16, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: -8, right: 12,
                fontFamily: 'var(--font-instrument-serif)',
                fontSize: 64, color: 'var(--brd)', lineHeight: 1,
                userSelect: 'none', pointerEvents: 'none',
              }}>
                {step}
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span style={{ fontSize: 28, display: 'block', marginBottom: 12 }}>{icon}</span>
                <div style={{ fontWeight: 500, color: 'var(--ink)', marginBottom: 8, fontSize: 15, lineHeight: 1.3 }}>
                  {title}
                </div>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65 }}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dual CTA ── */}
      <section style={{ padding: '40px 20px 56px', maxWidth: 740, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          <div style={{
            padding: '28px 24px', borderRadius: 16,
            background: 'linear-gradient(135deg, #022c22 0%, #065f46 100%)',
            border: '1px solid rgba(52,211,153,0.2)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', right: -20, bottom: -20,
              width: 120, height: 120, borderRadius: '50%',
              background: 'rgba(52,211,153,0.08)',
            }} />
            <div style={{ fontSize: 32, marginBottom: 12 }}>◎</div>
            <div style={{
              fontFamily: 'var(--font-instrument-serif)', fontSize: 20,
              color: '#fff', marginBottom: 8,
            }}>
              Have a skill?
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 20 }}>
              List what you do, set your credit rate, start earning from the network.
            </p>
            <Link href="/b/list" style={{
              display: 'inline-flex', padding: '10px 22px', borderRadius: 99,
              background: '#059669', color: 'white',
              fontFamily: 'var(--font-dm-sans)', fontSize: 13, fontWeight: 500,
              border: '1px solid rgba(255,255,255,0.15)',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(5,150,105,0.4)',
            }}>
              Offer a skill →
            </Link>
          </div>

          <div style={{
            padding: '28px 24px', borderRadius: 16,
            background: 'var(--surf)', border: '1px solid var(--brd)',
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✦</div>
            <div style={{
              fontFamily: 'var(--font-instrument-serif)', fontSize: 20,
              color: 'var(--ink)', marginBottom: 8,
            }}>
              Need a skill?
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 20 }}>
              Post a brief with scope, budget in Credits, and timeline. Providers apply.
            </p>
            <Link href="/b/briefs/new" style={{
              display: 'inline-flex', padding: '10px 22px', borderRadius: 99,
              background: 'var(--ink)', color: 'white',
              fontFamily: 'var(--font-dm-sans)', fontSize: 13, fontWeight: 500,
              border: '1px solid transparent', textDecoration: 'none',
            }}>
              Post a brief →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--brd)', padding: '24px 20px 40px' }}>
        <div style={{
          maxWidth: 740, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 16, color: 'var(--ink)' }}>Bartr-B</span>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)' }}>Trade your skills for what you need.</span>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[
              { label: '← Bartr', href: '/' },
              { label: 'Browse', href: '/b/browse' },
              { label: 'Briefs', href: '/b/briefs' },
              { label: 'Terms', href: '/legal/terms' },
            ].map(l => (
              <Link key={l.href} href={l.href} style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--faint)',
                textDecoration: 'none',
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
