import Link from 'next/link'

const LEDGER_ENTRIES = [
  { from: 'tessafilm', to: 'lilyc', gave: 'Fujifilm X-T20 Kit', received: 'MacBook Air M2', date: '4 Mar 2026', city: 'London' },
  { from: 'pablor', to: 'kwamea', gave: "Arc'teryx Beta AR Jacket (L)", received: "Nike Air Max 1 OG UK9 + Nike Dunk Low", date: '2 Mar 2026', city: 'London' },
  { from: 'djsol', to: 'mikeb', gave: 'Pioneer DJM-450 Mixer', received: 'Fender Squier Tele + Korg Minilogue', date: '28 Feb 2026', city: 'Glasgow' },
  { from: 'samirk', to: 'jordanmc', gave: 'Philosophy Library ×12', received: "Donna Tartt + Zadie Smith + Sally Rooney collection", date: '25 Feb 2026', city: 'Oxford' },
  { from: 'lilyc', to: 'pablor', gave: 'iPad Pro 11" (2021) + Apple Pencil', received: 'Sony WH-1000XM5 + Keychron K2', date: '22 Feb 2026', city: 'Edinburgh' },
]

export default function TrustPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 52,
        background: 'rgba(246,244,241,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--brd)',
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-instrument-serif)', fontSize: 22,
          color: 'var(--ink)', textDecoration: 'none', letterSpacing: '-0.01em',
        }}>
          Bartr
        </Link>
        <Link href="/browse" style={{
          fontFamily: 'var(--font-dm-sans)', fontSize: 13, color: 'var(--ink2)',
          padding: '5px 14px', border: '1px solid var(--brd2)',
          borderRadius: 99, background: 'var(--surf)', textDecoration: 'none',
        }}>
          Browse listings
        </Link>
      </nav>

      <main style={{ maxWidth: 640, margin: '0 auto', padding: '52px 24px 80px' }}>

        <div style={{
          fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16,
        }}>
          Trust & transparency
        </div>

        <h1 style={{
          fontFamily: 'var(--font-instrument-serif)', fontSize: 'clamp(32px,8vw,52px)',
          lineHeight: 1.1, color: 'var(--ink)', marginBottom: 16, letterSpacing: '-0.02em',
        }}>
          The public ledger<br />is the trust layer.
        </h1>

        <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 48 }}>
          No escrow. No deposits. No dispute resolution team. Just a permanent,
          public record of every trade that has ever happened on Bartr.
          That&apos;s all the trust you need.
        </p>

        {/* Live ledger */}
        <section style={{ marginBottom: 48 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            <h2 style={{
              fontFamily: 'var(--font-instrument-serif)', fontSize: 22, color: 'var(--ink)',
            }}>
              Recent trades
            </h2>
            <span style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--grn)',
              background: 'var(--gbg)', border: '1px solid var(--gbd)',
              padding: '3px 10px', borderRadius: 99,
            }}>
              ● Live
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {LEDGER_ENTRIES.map((entry, i) => (
              <div key={i} style={{
                padding: '16px',
                background: 'var(--surf)', border: '1px solid var(--brd)',
                borderRadius: 'var(--rl)',
              }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                      <span style={{
                        fontFamily: 'var(--font-dm-mono)', fontSize: 12,
                        color: 'var(--ink)', fontWeight: 500,
                      }}>
                        @{entry.from}
                      </span>
                      <span style={{ color: 'var(--faint)', fontSize: 12 }}>↔</span>
                      <span style={{
                        fontFamily: 'var(--font-dm-mono)', fontSize: 12,
                        color: 'var(--ink)', fontWeight: 500,
                      }}>
                        @{entry.to}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--ink2)' }}>{entry.gave}</span>
                      <span style={{ color: 'var(--faint)', margin: '0 6px' }}>for</span>
                      <span style={{ color: 'var(--ink2)' }}>{entry.received}</span>
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'flex', gap: 12,
                  borderTop: '1px solid var(--brd)', paddingTop: 8,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)',
                  }}>
                    {entry.date}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)',
                  }}>
                    {entry.city}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--grn)',
                    marginLeft: 'auto',
                  }}>
                    ✓ Confirmed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why this works */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            fontFamily: 'var(--font-instrument-serif)', fontSize: 24,
            color: 'var(--ink)', marginBottom: 16,
          }}>
            Why a ledger, not a rating
          </h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 16 }}>
            Star ratings and review systems are gameable. Sellers buy fake reviews.
            Unhappy buyers get pressured into silence. The numbers mean nothing.
          </p>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 16 }}>
            A public ledger is different. Every entry is a statement of fact:
            these two people, these items, this date. It can&apos;t be deleted,
            edited or gamed. A trader with 50 ledger entries has verifiably
            completed 50 real trades. That&apos;s trust you can read.
          </p>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.75 }}>
            Bad actors accumulate a ledger of disputes and failed trades —
            visible to everyone considering trading with them.
            The community polices itself.
          </p>
        </section>

        {/* Verification tiers */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            fontFamily: 'var(--font-instrument-serif)', fontSize: 24,
            color: 'var(--ink)', marginBottom: 20,
          }}>
            Verification levels
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              {
                badge: 'ID verified', bg: 'var(--blubg)', brd: 'var(--blubd)', color: 'var(--blu)',
                desc: 'Government ID matched against account. Harder to fake, higher accountability.',
              },
              {
                badge: 'Phone verified', bg: 'var(--gbg)', brd: 'var(--gbd)', color: 'var(--grn)',
                desc: 'Real phone number attached to the account. Reduces throwaway accounts.',
              },
              {
                badge: 'Photo verified', bg: 'var(--gbg)', brd: 'var(--gbd)', color: 'var(--grn)',
                desc: 'Face matches ID photo. The gold standard for in-person trades.',
              },
            ].map(v => (
              <div key={v.badge} style={{
                display: 'flex', gap: 14, alignItems: 'flex-start',
                padding: '14px 16px',
                background: 'var(--surf)', border: '1px solid var(--brd)',
                borderRadius: 'var(--rl)',
              }}>
                <span style={{
                  fontFamily: 'var(--font-dm-mono)', fontSize: 10,
                  padding: '3px 10px', borderRadius: 99, flexShrink: 0,
                  background: v.bg, border: `1px solid ${v.brd}`, color: v.color,
                }}>
                  {v.badge}
                </span>
                <span style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65 }}>
                  {v.desc}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* No escrow explanation */}
        <section style={{
          padding: '24px',
          background: 'var(--rbg)', border: '1px solid var(--rbd)',
          borderRadius: 'var(--rl)', marginBottom: 48,
        }}>
          <h2 style={{
            fontFamily: 'var(--font-instrument-serif)', fontSize: 20,
            color: 'var(--ink)', marginBottom: 10,
          }}>
            Why no escrow on consumer Bartr?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 0 }}>
            Escrow requires money — and Bartr trades don&apos;t use money. Holding items in
            escrow would mean a third party physically possessing your goods, which is logistically
            absurd for a jacket swap. Instead, we front-load trust: verified profiles,
            public ledgers, community reputation. Most trades happen face-to-face anyway.
            The ledger is accountability after the fact if anything goes wrong.
          </p>
        </section>

        {/* Bartr-B note */}
        <div style={{
          padding: '16px', borderRadius: 'var(--rl)',
          background: 'var(--gbg)', border: '1px solid var(--gbd)',
          fontSize: 13, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 48,
        }}>
          <span style={{ fontWeight: 500, color: 'var(--grn)' }}>Bartr-B</span>
          {' '}is different. When skills and services are traded for real money (Credits),
          milestone escrow via Stripe protects both parties. The bigger the engagement,
          the more important the safety net.
          <Link href="/b" style={{ color: 'var(--grn)', textDecoration: 'underline', marginLeft: 4 }}>
            Learn about Bartr-B →
          </Link>
        </div>

        {/* CTA */}
        <section style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-instrument-serif)', fontSize: 28,
            color: 'var(--ink)', marginBottom: 8,
          }}>
            Start your ledger
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
            Every trade you complete is a permanent entry. Build a reputation that means something.
          </p>
          <Link href="/signup" style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '14px 32px', borderRadius: 99,
            background: 'var(--red)', color: 'white',
            fontFamily: 'var(--font-dm-sans)', fontSize: 15, fontWeight: 500,
            border: '1px solid #A8251F', textDecoration: 'none',
          }}>
            Create free account →
          </Link>
        </section>
      </main>

      <footer style={{
        borderTop: '1px solid var(--brd)', padding: '24px 20px',
        display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center',
      }}>
        {[
          { label: 'About', href: '/about' },
          { label: 'How it works', href: '/how-it-works' },
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
      </footer>
    </div>
  )
}
