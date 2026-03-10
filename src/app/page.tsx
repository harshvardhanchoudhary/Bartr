import Link from 'next/link'
import { LandingGate } from '@/components/landing/LandingGate'
import { HeroListings } from '@/components/landing/HeroListings'
import { ActivityTicker } from '@/components/landing/ActivityTicker'
import { LiveStats } from '@/components/landing/LiveStats'

const SAMPLE_LISTINGS = [
  { id: 'demo-2', emoji: '👕', title: "Vintage Levi's 501 Jacket", category: 'Fashion', condition: 'Good', value: 75, user: 'jordanmc', wants: ['Photography books', 'Film camera', 'Vinyl'] },
  { id: 'demo-1', emoji: '📷', title: 'Fujifilm X-T20 + 18-55mm', category: 'Electronics', condition: 'Good', value: 420, user: 'tessafilm', wants: ['Laptop', 'iPad', 'Camera gear'] },
  { id: 'demo-3', emoji: '🎸', title: 'Fender Telecaster (Squier)', category: 'Music', condition: 'Good', value: 220, user: 'mikeb', wants: ['Synth', 'Effects pedals', 'Studio monitors'] },
  { id: 'demo-7', emoji: '📚', title: 'Philosophy Books ×12', category: 'Books', condition: 'Good', value: 60, user: 'samirk', wants: ['Fiction', 'Art books', 'Journals'] },
  { id: 'demo-4', emoji: '🧥', title: "Arc'teryx Beta AR Jacket", category: 'Fashion', condition: 'Like new', value: 340, user: 'pablor', wants: ['Snowboard gear', 'Hiking boots', 'Camping'] },
  { id: 'demo-5', emoji: '🖥️', title: 'iPad Pro 11" (2021)', category: 'Electronics', condition: 'Like new', value: 580, user: 'lilyc', wants: ['MacBook', 'Camera', 'Audio gear'] },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'List what you have', desc: 'Add photos, set an estimated value, say what you want in return.' },
  { step: '02', title: 'Make or receive an offer', desc: 'Browse listings, pick items from your stash, see the value balance before you send.' },
  { step: '03', title: 'Meet and swap', desc: "Agree on a time and place. The trade is logged on the public ledger — that's the trust layer." },
]

const LIVE_TRADES = [
  { emoji: '📷', item: 'Fujifilm X-T20', for: 'iPad Pro 11"', city: 'London', time: '2h ago', color: '#1D5FA8' },
  { emoji: '👕', item: "Levi's 501 jacket", for: 'Film camera + books', city: 'Bristol', time: '5h ago', color: '#C4312A' },
  { emoji: '🎸', item: 'Fender Telecaster', for: 'Korg Minilogue XD', city: 'Manchester', time: '1d ago', color: '#7C3AED' },
  { emoji: '🧥', item: "Arc'teryx Beta AR", for: 'Snowboard gear', city: 'Edinburgh', time: '1d ago', color: '#059669' },
]

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ── Nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 52,
        background: 'rgba(246,244,241,0.94)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--brd)',
      }}>
        <span style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 22, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
          Bartr
        </span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/how-it-works" style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--muted)',
            padding: '5px 10px', textDecoration: 'none',
          }}>
            How it works
          </Link>
          <Link href="/b" style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--grn)',
            padding: '5px 12px', border: '1px solid var(--gbd)',
            borderRadius: 99, background: 'var(--gbg)', textDecoration: 'none',
          }}>
            Bartr-B ↗
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
        style={{ display: 'grid', gap: 0, minHeight: 'calc(100svh - 52px)', maxHeight: 700 }}
        className="hero-grid"
      >
        {/* Left: pitch */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '40px 32px 40px 24px',
          borderRight: '1px solid var(--brd)',
        }}>
          {/* Live badge */}
          <div style={{
            display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-dm-mono)', fontSize: 10,
            letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--red)',
            background: 'var(--rbg)', border: '1px solid var(--rbd)',
            padding: '4px 10px', borderRadius: 99, marginBottom: 24,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: 'var(--red)',
              animation: 'pulse-dot 2.2s ease-in-out infinite', display: 'inline-block',
            }} />
            Live network · No cash required
          </div>

          <h1 style={{
            fontFamily: 'var(--font-instrument-serif)',
            fontSize: 'clamp(36px, 5vw, 58px)',
            lineHeight: 1.06, color: 'var(--ink)',
            letterSpacing: '-0.02em', marginBottom: 20,
          }}>
            Trade what you have<br />for what you love
          </h1>

          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 32, maxWidth: 340 }}>
            Swap your stuff directly with people nearby.
            No money changes hands — just honest trades.
          </p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            <Link href="/browse" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '13px 28px', borderRadius: 99,
              background: 'var(--red)', color: 'white',
              fontFamily: 'var(--font-dm-sans)', fontSize: 15, fontWeight: 500,
              border: '1px solid var(--rbn)', textDecoration: 'none',
            }}>
              Browse listings →
            </Link>
            <Link href="/list" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '13px 24px', borderRadius: 99,
              background: 'var(--surf)', color: 'var(--ink2)',
              fontFamily: 'var(--font-dm-sans)', fontSize: 15, fontWeight: 500,
              border: '1px solid var(--brd2)', textDecoration: 'none',
            }}>
              List something
            </Link>
          </div>

          <p style={{ fontSize: 11, color: 'var(--faint)', fontFamily: 'var(--font-dm-mono)' }}>
            No account needed to browse
          </p>

          {/* Mini trust strip */}
          <div style={{
            display: 'flex', gap: 20, marginTop: 36,
            paddingTop: 24, borderTop: '1px solid var(--brd)', flexWrap: 'wrap',
          }}>
            {[
              { label: 'No cash', desc: 'Items only' },
              { label: 'No fees', desc: 'Free forever' },
              { label: '4.9★', desc: 'Community rated' },
            ].map(t => (
              <div key={t.label}>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{t.label}</div>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: 'var(--faint)', letterSpacing: '0.06em', marginTop: 1 }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: animated listing bento */}
        <HeroListings listings={SAMPLE_LISTINGS} />
      </section>

      {/* ── Live stats counter strip ── */}
      <LiveStats />

      {/* ── Activity ticker ── */}
      <ActivityTicker />

      {/* ── Trades happening now ── */}
      <section style={{ padding: '40px 20px 16px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20,
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4,
              }}>
                Happening now
              </div>
              <div style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 22, color: 'var(--ink)' }}>
                Trades in the wild
              </div>
            </div>
            <Link href="/browse" style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--red)',
              padding: '5px 12px', border: '1px solid var(--rbd)',
              borderRadius: 99, background: 'var(--rbg)', textDecoration: 'none',
            }}>
              See all →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {LIVE_TRADES.map((trade, i) => (
              <Link key={i} href="/browse" style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '14px',
                  background: 'var(--surf)', border: '1px solid var(--brd)',
                  borderRadius: 'var(--rl)',
                  position: 'relative', overflow: 'hidden',
                }}
                className="hover-lift"
                >
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                    background: trade.color, opacity: 0.75,
                  }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, marginTop: 4 }}>
                    <span style={{ fontSize: 22 }}>{trade.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 12, fontWeight: 500, color: 'var(--ink)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {trade.item}
                      </div>
                      <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: 'var(--faint)' }}>
                        for {trade.for}
                      </div>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--brd)', paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: 'var(--muted)' }}>
                      {trade.city}
                    </span>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: 'var(--faint)' }}>
                      {trade.time}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Marketplace switcher ── */}
      <section style={{ padding: '24px 20px 32px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16, textAlign: 'center',
          }}>
            One ecosystem, two ways to trade
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Link href="/browse" style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '20px', borderRadius: 'var(--rl)',
                border: '1px solid var(--rbd)', background: 'var(--rbg)', height: '100%',
              }}
              className="hover-lift"
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>◻</div>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--red)', letterSpacing: '0.08em', marginBottom: 6 }}>BARTR</div>
                <div style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 18, color: 'var(--ink)', marginBottom: 8 }}>Physical swaps</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
                  Clothes, cameras, books, instruments. Trade like-for-like.
                </div>
                <div style={{ marginTop: 14, fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--red)' }}>
                  Browse items →
                </div>
              </div>
            </Link>
            <Link href="/b/browse" style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '20px', borderRadius: 'var(--rl)',
                border: '1px solid var(--gbd)', background: 'var(--gbg)', height: '100%',
              }}
              className="hover-lift"
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>◎</div>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--grn)', letterSpacing: '0.08em', marginBottom: 6 }}>BARTR-B</div>
                <div style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 18, color: 'var(--ink)', marginBottom: 8 }}>Skills & services</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
                  Design, dev, writing. Earn Credits, spend them across the network.
                </div>
                <div style={{ marginTop: 14, fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--grn)' }}>
                  Browse skills →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: '0 20px 56px', maxWidth: 560, margin: '0 auto' }}>
        <div style={{
          fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 28, textAlign: 'center',
        }}>
          How it works
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {HOW_IT_WORKS.map(step => (
            <div key={step.step} style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--red)',
                background: 'var(--rbg)', border: '1px solid var(--rbd)',
                width: 36, height: 36, borderRadius: 99,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontWeight: 500,
              }}>
                {step.step}
              </div>
              <div>
                <div style={{ fontWeight: 500, color: 'var(--ink)', marginBottom: 5, fontSize: 15 }}>{step.title}</div>
                <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{
        padding: '48px 24px 64px', textAlign: 'center',
        background: 'var(--bg2)', borderTop: '1px solid var(--brd)',
      }}>
        <h2 style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 32, color: 'var(--ink)', marginBottom: 10 }}>
          Ready to trade?
        </h2>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 28 }}>
          List your first item in under 2 minutes. No account needed to browse.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/signup" style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '14px 32px', borderRadius: 99,
            background: 'var(--red)', color: 'white',
            fontFamily: 'var(--font-dm-sans)', fontSize: 15, fontWeight: 500,
            border: '1px solid var(--rbn)', textDecoration: 'none',
          }}>
            Get started — it&apos;s free
          </Link>
          <Link href="/browse" style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '14px 24px', borderRadius: 99,
            background: 'var(--surf)', color: 'var(--ink2)',
            fontFamily: 'var(--font-dm-sans)', fontSize: 15, fontWeight: 500,
            border: '1px solid var(--brd2)', textDecoration: 'none',
          }}>
            Browse first
          </Link>
        </div>
        <p style={{ marginTop: 24, fontSize: 13, color: 'var(--muted)' }}>
          Freelancer?{' '}
          <Link href="/b" style={{ color: 'var(--grn)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Try Bartr-B — the skills marketplace →
          </Link>
        </p>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--brd)', padding: '28px 20px 40px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 18, color: 'var(--ink)' }}>Bartr</span>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)', letterSpacing: '0.04em' }}>
              Trade what you have for what you love.
            </span>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', borderTop: '1px solid var(--brd)', paddingTop: 16 }}>
            {[
              { label: 'Browse', href: '/browse' },
              { label: 'How it works', href: '/how-it-works' },
              { label: 'About', href: '/about' },
              { label: 'Trust & ledger', href: '/trust' },
              { label: 'Bartr-B', href: '/b' },
              { label: 'Terms', href: '/legal/terms' },
              { label: 'Privacy', href: '/legal/privacy' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--faint)',
                textDecoration: 'none', letterSpacing: '0.04em',
              }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      <LandingGate />
    </div>
  )
}
