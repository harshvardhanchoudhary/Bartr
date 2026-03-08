import Link from 'next/link'
import { LandingGate } from '@/components/landing/LandingGate'
import { HeroListings } from '@/components/landing/HeroListings'
import { ActivityTicker } from '@/components/landing/ActivityTicker'

// Sample listings for the hero — IDs match demo-data.ts so detail pages work
const SAMPLE_LISTINGS = [
  { id: 'demo-2', emoji: '👕', title: "Vintage Levi's 501 Jacket", category: 'Fashion', condition: 'Good', value: 75, user: 'jordanmc', wants: ['Photography books', 'Film camera', 'Vinyl'] },
  { id: 'demo-1', emoji: '📷', title: 'Fujifilm X-T20 + 18-55mm', category: 'Electronics', condition: 'Good', value: 420, user: 'tessafilm', wants: ['Laptop', 'iPad', 'Camera gear'] },
  { id: 'demo-3', emoji: '🎸', title: 'Fender Telecaster (Squier)', category: 'Music', condition: 'Good', value: 220, user: 'mikeb', wants: ['Synth', 'Effects pedals', 'Studio monitors'] },
  { id: 'demo-7', emoji: '📚', title: 'Philosophy Books ×12', category: 'Books', condition: 'Good', value: 60, user: 'samirk', wants: ['Fiction', 'Art books', 'Journals'] },
  { id: 'demo-4', emoji: '🧥', title: "Arc'teryx Beta AR Jacket", category: 'Fashion', condition: 'Like new', value: 340, user: 'pablor', wants: ['Snowboard gear', 'Hiking boots', 'Camping'] },
  { id: 'demo-5', emoji: '🖥️', title: 'iPad Pro 11" (2021)', category: 'Electronics', condition: 'Like new', value: 580, user: 'lilyc', wants: ['MacBook', 'Camera', 'Audio gear'] },
  { id: 'demo-6', emoji: '🎵', title: 'Technics SL-1200MK2', category: 'Music', condition: 'Good', value: 480, user: 'djsol', wants: ['Vinyl collection', 'Speakers', 'Amp'] },
  { id: 'demo-8', emoji: '👟', title: 'Nike Air Max 1 OG (UK9)', category: 'Fashion', condition: 'New', value: 140, user: 'kwamea', wants: ['Jordan 1s', 'New Balance', 'Other sneakers'] },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'List what you have', desc: 'Add photos, set an estimated value, say what you want in return.' },
  { step: '02', title: 'Make or receive an offer', desc: 'Browse listings, pick items from your stash, see the value balance before you send.' },
  { step: '03', title: 'Meet and swap', desc: "Agree on a time and place. The trade is logged on the public ledger — that's the trust layer." },
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
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
        gap: 0,
        minHeight: 'calc(100svh - 52px)',
        maxHeight: 700,
      }}
      className="hero-grid"
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
            letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--red)',
            background: 'var(--rbg)', border: '1px solid var(--rbd)',
            padding: '4px 10px', borderRadius: 99, marginBottom: 24,
          }}>
            No cash required
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
              border: '1px solid #A8251F', textDecoration: 'none',
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
            display: 'flex', gap: 20, marginTop: 40,
            paddingTop: 24, borderTop: '1px solid var(--brd)',
            flexWrap: 'wrap',
          }}>
            {[
              { label: 'No cash', desc: 'Items only' },
              { label: 'No fees', desc: 'Free forever' },
              { label: '5★ trades', desc: 'Community rated' },
            ].map(t => (
              <div key={t.label}>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{t.label}</div>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: 'var(--faint)', letterSpacing: '0.06em', marginTop: 1 }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: animated listing grid */}
        <HeroListings listings={SAMPLE_LISTINGS} />
      </section>

      {/* ── Activity ticker ── */}
      <ActivityTicker />

      {/* ── Marketplace switcher ── */}
      <section style={{ padding: '36px 20px 32px' }}>
        <div style={{
          fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16, textAlign: 'center',
        }}>
          One ecosystem, two ways to trade
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 12, maxWidth: 680, margin: '0 auto',
        }}>
          <Link href="/browse" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '20px', borderRadius: 'var(--rl)',
              border: '1px solid var(--rbd)', background: 'var(--rbg)',
              transition: 'box-shadow 0.15s, transform 0.15s',
            }}
            className="hover-lift"
            >
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--red)', letterSpacing: '0.08em', marginBottom: 8 }}>BARTR</div>
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
              border: '1px solid var(--gbd)', background: 'var(--gbg)',
            }}
            className="hover-lift"
            >
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--grn)', letterSpacing: '0.08em', marginBottom: 8 }}>BARTR-B</div>
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
      </section>

      {/* ── What gets accepted ── */}
      <section style={{
        margin: '0 20px 40px',
        padding: '24px',
        background: 'var(--surf)',
        border: '1px solid var(--brd)',
        borderRadius: 'var(--rl)',
        maxWidth: 640, marginLeft: 'auto', marginRight: 'auto',
      }}>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
          Community patterns
        </div>
        <h3 style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 20, color: 'var(--ink)', marginBottom: 8 }}>
          What trades happen most
        </h3>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16 }}>
          The community tends to accept trades within 20% of their listed value.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['Cameras ↔ Lenses', 'Jackets ↔ Jackets', 'Books ↔ Books', 'Instruments ↔ Gear', 'Tech ↔ Tech', 'Sneakers ↔ Sneakers', 'Art ↔ Art'].map(pattern => (
            <span key={pattern} style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 11,
              padding: '5px 12px', borderRadius: 99,
              background: 'var(--bg2)', border: '1px solid var(--brd)',
              color: 'var(--ink2)',
            }}>
              {pattern}
            </span>
          ))}
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
            border: '1px solid #A8251F', textDecoration: 'none',
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
