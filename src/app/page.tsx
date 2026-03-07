import Link from 'next/link'
import { LandingGate } from '@/components/landing/LandingGate'

// Sample listings for social proof — mirrors what's in the database
const SAMPLE_LISTINGS = [
  { id: '1', emoji: '👕', title: "Vintage Levi's 501 Jacket", category: 'Fashion', condition: 'Good', value: 75, user: 'jordanmc', wants: ['Photography books', 'Film camera', 'Vinyl'] },
  { id: '2', emoji: '📷', title: 'Fujifilm X-T20 + 18-55mm', category: 'Electronics', condition: 'Great', value: 420, user: 'tessafilm', wants: ['Laptop', 'iPad', 'Camera gear'] },
  { id: '3', emoji: '🎸', title: 'Fender Telecaster (Squier)', category: 'Music', condition: 'Good', value: 220, user: 'mikeb', wants: ['Synth', 'Effects pedals', 'Studio monitors'] },
  { id: '4', emoji: '📚', title: 'Philosophy Books ×12', category: 'Books', condition: 'Good', value: 60, user: 'samirk', wants: ['Fiction', 'Art books', 'Journals'] },
  { id: '5', emoji: '🧥', title: 'Arc\'teryx Beta AR Jacket', category: 'Fashion', condition: 'Great', value: 340, user: 'pablor', wants: ['Snowboard gear', 'Hiking boots', 'Camping'] },
  { id: '6', emoji: '🖥️', title: 'iPad Pro 11" (2021)', category: 'Electronics', condition: 'Great', value: 580, user: 'lilyc', wants: ['MacBook', 'Camera', 'Audio gear'] },
  { id: '7', emoji: '🎵', title: 'Technics SL-1200MK2', category: 'Music', condition: 'Good', value: 480, user: 'djsol', wants: ['Vinyl collection', 'Speakers', 'Amp'] },
  { id: '8', emoji: '👟', title: 'Nike Air Max 1 OG (UK9)', category: 'Fashion', condition: 'Good', value: 140, user: 'kwamea', wants: ['Jordan 1s', 'New Balance', 'Other sneakers'] },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'List what you have', desc: 'Add photos, set an estimated value, say what you want in return.' },
  { step: '02', title: 'Make or receive an offer', desc: 'Browse listings, pick items from your stash, see the value balance before you send.' },
  { step: '03', title: 'Meet and swap', desc: 'Agree on a time and place. The trade is logged on the public ledger — that\'s the trust layer.' },
]

const TICKER_ITEMS = [
  '147 trades completed this week',
  '2,300+ items listed',
  'No cash. No fees.',
  '23 cities active',
  'Top trade: Camera ↔ Synthesiser',
  'Community trust score: 4.9★',
]

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Top bar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 52,
        background: 'rgba(246,244,241,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--brd)',
      }}>
        <span style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 22, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
          Bartr
        </span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/how-it-works" style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--muted)',
            padding: '5px 10px', textDecoration: 'none',
            display: 'none',
          }}
          className="sm-show"
          >
            How it works
          </Link>
          <Link href="/b" style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--grn)',
            padding: '5px 10px', border: '1px solid var(--gbd)',
            borderRadius: 99, background: 'var(--gbg)', textDecoration: 'none',
          }}>
            Bartr-B
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

      {/* Hero */}
      <section style={{ padding: '52px 24px 40px', textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
        <div style={{
          display: 'inline-block', fontFamily: 'var(--font-dm-mono)', fontSize: 10,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--red)',
          background: 'var(--rbg)', border: '1px solid var(--rbd)',
          padding: '4px 10px', borderRadius: 99, marginBottom: 20,
        }}>
          No cash required
        </div>

        <h1 style={{
          fontFamily: 'var(--font-instrument-serif)', fontSize: 'clamp(40px,10vw,64px)',
          lineHeight: 1.05, color: 'var(--ink)', marginBottom: 16,
          letterSpacing: '-0.02em',
        }}>
          Trade what you have<br />for what you love
        </h1>

        <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 32 }}>
          Swap your stuff directly with people nearby.
          No money changes hands — just honest trades.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
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

        <p style={{ marginTop: 16, fontSize: 12, color: 'var(--faint)' }}>
          No account needed to browse
        </p>
      </section>

      {/* Live ticker */}
      <div style={{
        borderTop: '1px solid var(--brd)', borderBottom: '1px solid var(--brd)',
        overflow: 'hidden', background: 'var(--bg2)', padding: '9px 0',
      }}>
        <div style={{
          display: 'flex', gap: 48,
          animation: 'ticker 32s linear infinite',
          width: 'max-content',
          fontFamily: 'var(--font-dm-mono)', fontSize: 11,
          color: 'var(--muted)', letterSpacing: '0.04em',
        }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} style={{ whiteSpace: 'nowrap' }}>
              {item} <span style={{ color: 'var(--brd2)', margin: '0 8px' }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* Live listings */}
      <section style={{ padding: '36px 0 40px' }}>
        <div style={{ padding: '0 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h2 style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 22, color: 'var(--ink)' }}>
            Live listings
          </h2>
          <Link href="/browse" style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--muted)',
            textDecoration: 'none', letterSpacing: '0.04em',
          }}>
            See all →
          </Link>
        </div>

        <div style={{
          display: 'flex', gap: 12, overflowX: 'auto',
          padding: '0 20px 8px', scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
        }}>
          {SAMPLE_LISTINGS.map(listing => (
            <LandingListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* Explore both worlds */}
      <section style={{
        margin: '0 20px 28px',
        padding: '20px',
        background: 'var(--surf)',
        border: '1px solid var(--brd)',
        borderRadius: 'var(--rl)',
      }}>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
          Explore both marketplaces
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Link href="/browse" style={{ textDecoration: 'none', padding: '12px', borderRadius: 10, border: '1px solid var(--rbd)', background: 'var(--rbg)', color: 'var(--ink)' }}>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--red)', marginBottom: 4 }}>BARTR</div>
            <div style={{ fontSize: 13 }}>Physical item swaps</div>
          </Link>
          <Link href="/b/browse" style={{ textDecoration: 'none', padding: '12px', borderRadius: 10, border: '1px solid var(--gbd)', background: 'var(--gbg)', color: 'var(--ink)' }}>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--grn)', marginBottom: 4 }}>BARTR-B</div>
            <div style={{ fontSize: 13 }}>Skills, briefs, and Credits</div>
          </Link>
        </div>
      </section>

      {/* What gets accepted — social proof */}
      <section style={{
        margin: '0 20px 40px',
        padding: '24px',
        background: 'var(--surf)',
        border: '1px solid var(--brd)',
        borderRadius: 'var(--rl)',
      }}>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
          Community patterns
        </div>
        <h3 style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 18, color: 'var(--ink)', marginBottom: 8 }}>
          What gets accepted
        </h3>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16 }}>
          The community tends to accept trades within 20% value of their listing.
          Here&apos;s what&apos;s moving right now:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['Cameras ↔ Lenses', 'Jackets ↔ Jackets', 'Books ↔ Books', 'Instruments ↔ Gear', 'Tech ↔ Tech', 'Sneakers ↔ Sneakers'].map(pattern => (
            <span key={pattern} style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 11,
              padding: '5px 10px', borderRadius: 99,
              background: 'var(--bg2)', border: '1px solid var(--brd)',
              color: 'var(--ink2)',
            }}>
              {pattern}
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '0 20px 48px', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 24, textAlign: 'center' }}>
          How it works
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {HOW_IT_WORKS.map(step => (
            <div key={step.step} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--red)',
                background: 'var(--rbg)', border: '1px solid var(--rbd)',
                width: 32, height: 32, borderRadius: 99,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {step.step}
              </div>
              <div>
                <div style={{ fontWeight: 500, color: 'var(--ink)', marginBottom: 4 }}>{step.title}</div>
                <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section style={{
        borderTop: '1px solid var(--brd)',
        padding: '28px 20px',
        display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap',
      }}>
        {[
          { label: 'No cash', desc: 'Items only' },
          { label: 'No escrow', desc: 'Public ledger' },
          { label: 'No fees', desc: 'Free forever' },
          { label: '5★ trades', desc: 'Community rated' },
        ].map(item => (
          <div key={item.label} style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 14 }}>{item.label}</div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)', letterSpacing: '0.06em', marginTop: 2 }}>{item.desc}</div>
          </div>
        ))}
      </section>

      {/* Final CTA */}
      <section style={{
        padding: '40px 24px 60px', textAlign: 'center',
        background: 'var(--bg2)', borderTop: '1px solid var(--brd)',
      }}>
        <h2 style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 28, color: 'var(--ink)', marginBottom: 8 }}>
          Ready to trade?
        </h2>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
          Join the community. List your first item in under 2 minutes.
        </p>
        <Link href="/signup" style={{
          display: 'inline-flex', alignItems: 'center',
          padding: '14px 32px', borderRadius: 99,
          background: 'var(--red)', color: 'white',
          fontFamily: 'var(--font-dm-sans)', fontSize: 15, fontWeight: 500,
          border: '1px solid #A8251F', textDecoration: 'none',
        }}>
          Get started — it&apos;s free
        </Link>

        <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--brd)' }}>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>
            Freelancer? Skills to offer?
          </p>
          <Link href="/b" style={{
            fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: 'var(--grn)',
            textDecoration: 'underline', textUnderlineOffset: 3,
          }}>
            Explore Bartr-B — the skills marketplace →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--brd)',
        padding: '28px 20px 40px',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{
            display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20,
          }}>
            <span style={{
              fontFamily: 'var(--font-instrument-serif)', fontSize: 18, color: 'var(--ink)',
            }}>
              Bartr
            </span>
            <span style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)',
              letterSpacing: '0.04em',
            }}>
              Trade what you have for what you love.
            </span>
          </div>
          <div style={{
            display: 'flex', gap: 20, flexWrap: 'wrap',
            borderTop: '1px solid var(--brd)', paddingTop: 16,
          }}>
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

      {/* Sign-up gate (client component — slides up when user tries to make offer without auth) */}
      <LandingGate />
    </div>
  )
}

function LandingListingCard({ listing }: { listing: typeof SAMPLE_LISTINGS[0] }) {
  return (
    <Link href={`/listings/${listing.id}`} style={{ textDecoration: 'none', scrollSnapAlign: 'start' }}>
      <div style={{
        width: 180, flexShrink: 0,
        background: 'var(--surf)', border: '1px solid var(--brd)',
        borderRadius: 'var(--rl)', overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(26,24,20,0.06)',
      }}>
        {/* Photo area */}
        <div style={{
          height: 140, background: 'var(--bg2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 52, borderBottom: '1px solid var(--brd)',
        }}>
          {listing.emoji}
        </div>

        <div style={{ padding: '12px 12px 10px' }}>
          <div style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 9,
            textTransform: 'uppercase', letterSpacing: '0.08em',
            color: 'var(--faint)', marginBottom: 4,
          }}>
            {listing.category}
          </div>
          <div style={{
            fontSize: 13, fontWeight: 500, color: 'var(--ink)',
            lineHeight: 1.3, marginBottom: 8,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {listing.title}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 13,
              fontWeight: 500, color: 'var(--ink)',
            }}>
              ~£{listing.value}
            </span>
            <span style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 9,
              padding: '3px 7px', borderRadius: 99,
              background: 'var(--bg2)', border: '1px solid var(--brd)',
              color: 'var(--muted)',
            }}>
              {listing.condition}
            </span>
          </div>

          {listing.wants.length > 0 && (
            <div style={{
              fontSize: 10, color: 'var(--muted)',
              background: 'var(--bg)', borderRadius: 'var(--r)',
              padding: '5px 7px',
            }}>
              <span style={{ color: 'var(--faint)', fontFamily: 'var(--font-dm-mono)' }}>wants </span>
              {listing.wants[0]}{listing.wants.length > 1 ? ` +${listing.wants.length - 1}` : ''}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
