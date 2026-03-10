import Link from 'next/link'

const STEPS = [
  {
    number: '01',
    title: 'List what you have',
    subtitle: '2 minutes. No price tag required.',
    body: "Add a title, pick a category, describe the condition and upload up to 4 photos. The most important field: what you'd accept in return. Be specific — 'camera gear, vinyl, fiction books' gets far more offers than 'open to anything'.",
    example: {
      label: 'Example',
      text: '"Fujifilm X-T20 camera kit, good condition, ~£400. Looking for: MacBook, iPad, audio gear or camera lenses."',
    },
    tips: [
      'Set a realistic value range — the platform shows buyers the value gap on every offer',
      'List location so local pickups are easy',
      'Honest condition descriptions build your trust score',
    ],
  },
  {
    number: '02',
    title: 'Browse and make offers',
    subtitle: 'Find what you want. Offer what you have.',
    body: "Browse by category, search by keyword, or explore what's trending. When you find something you want, click 'Make offer' and choose items from your own listings to put forward. You can see the value balance before you send — green means fair, amber means you're offering less.",
    example: {
      label: 'Value gap',
      text: 'You want a £400 camera. You\'re offering a jacket worth £280. The gap indicator shows amber — nudging you to add another item or a small cash top-up.',
    },
    tips: [
      'Your offer is stronger with a clear message — explain why your items are a good swap',
      'You can offer multiple items in a single trade',
      'Cash top-ups are allowed when values don\'t match perfectly',
    ],
  },
  {
    number: '03',
    title: 'Agree and arrange the swap',
    subtitle: 'The conversation is where deals get done.',
    body: "Once you send an offer, a message thread opens automatically. Negotiate, ask questions, agree on the terms. When both sides are happy, arrange a time and place to meet — or agree on shipping if you're comfortable with it.",
    example: {
      label: 'Common meetup spots',
      text: 'Coffee shops, libraries, train stations. Public spaces with footfall. Most Bartr trades happen within 48 hours of accepting an offer.',
    },
    tips: [
      'Always meet in a public place for the first trade with someone',
      'Check the item before handing over yours',
      'Photos at handover are good practice',
    ],
  },
  {
    number: '04',
    title: 'The trade gets logged',
    subtitle: "That's the trust layer.",
    body: "After the swap, both parties confirm the trade on Bartr. It gets written to the public ledger — permanently. Your handle, the items traded, the date. No edits, no deletions. This is how trust accumulates: not through stars, but through a verifiable history of real trades.",
    example: {
      label: 'Public ledger entry',
      text: '@tessafilm traded Fujifilm X-T20 kit ↔ MacBook Air M2 with @lilyc — 4 March 2026',
    },
    tips: [
      'Every confirmed trade increments your trade count on your profile',
      'Disputes are rare — the public ledger incentivises honest dealing',
      'Verified traders (ID, phone, photo) get a badge on their listings',
    ],
  },
]

export default function HowItWorksPage() {
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
          How it works
        </div>

        <h1 style={{
          fontFamily: 'var(--font-instrument-serif)', fontSize: 'clamp(32px,8vw,52px)',
          lineHeight: 1.1, color: 'var(--ink)', marginBottom: 16, letterSpacing: '-0.02em',
        }}>
          Four steps.<br />Zero cash required.
        </h1>

        <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 48 }}>
          Every Bartr trade follows the same simple flow. Here&apos;s exactly how it works —
          with real examples.
        </p>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {STEPS.map((step, i) => (
            <div key={step.number} style={{
              display: 'flex', gap: 20,
              paddingBottom: i < STEPS.length - 1 ? 48 : 0,
              position: 'relative',
            }}>
              {/* Step line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 99, flexShrink: 0,
                  background: 'var(--rbg)', border: '1px solid var(--rbd)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: 'var(--red)',
                }}>
                  {step.number}
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{
                    width: 1, flex: 1, minHeight: 24,
                    background: 'var(--brd)', margin: '8px 0',
                  }} />
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingTop: 8 }}>
                <div style={{
                  fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6,
                }}>
                  {step.subtitle}
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-instrument-serif)', fontSize: 22,
                  color: 'var(--ink)', marginBottom: 12,
                }}>
                  {step.title}
                </h2>
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 16 }}>
                  {step.body}
                </p>

                {/* Example callout */}
                <div style={{
                  padding: '14px 16px', borderRadius: 'var(--rl)',
                  background: 'var(--surf)', border: '1px solid var(--brd)',
                  marginBottom: 16,
                }}>
                  <div style={{
                    fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 6,
                  }}>
                    {step.example.label}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.65, fontStyle: 'italic' }}>
                    {step.example.text}
                  </p>
                </div>

                {/* Tips */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {step.tips.map(tip => (
                    <div key={tip} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--grn)', fontSize: 12, flexShrink: 0, marginTop: 2 }}>✓</span>
                      <span style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--brd)', margin: '48px 0' }} />

        {/* FAQ */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            fontFamily: 'var(--font-instrument-serif)', fontSize: 24,
            color: 'var(--ink)', marginBottom: 24,
          }}>
            Common questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              {
                q: 'Does Bartr take a cut?',
                a: 'No. Zero fees, zero commission. We never handle money on consumer Bartr. Your trade is between you and the other person.',
              },
              {
                q: 'What if the item isn\'t as described?',
                a: "That's why we recommend checking everything before handing over your items. The public ledger creates accountability — dishonest traders accumulate a permanent record of disputes.",
              },
              {
                q: 'Can I include a cash top-up?',
                a: "Yes. If values don't match perfectly, you can offer a small cash amount alongside your items. The value gap indicator will show when this makes sense.",
              },
              {
                q: 'What about shipping?',
                a: "Bartr is designed for local trading — meet in person, check the item, hand it over. Shipping is possible but we recommend it only with trusted traders (long ledger, verified status).",
              },
              {
                q: 'Is there a mobile app?',
                a: "Bartr is a progressive web app — add it to your home screen from any browser for a native-feeling experience. A dedicated iOS/Android app is on the roadmap.",
              },
            ].map(faq => (
              <div key={faq.q} style={{
                padding: '18px 20px',
                background: 'var(--surf)', border: '1px solid var(--brd)',
                borderRadius: 'var(--rl)',
              }}>
                <div style={{ fontWeight: 500, color: 'var(--ink)', marginBottom: 8, fontSize: 14 }}>
                  {faq.q}
                </div>
                <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-instrument-serif)', fontSize: 28,
            color: 'var(--ink)', marginBottom: 8,
          }}>
            See what&apos;s available now
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
            Browse active listings — no account needed to look around.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/browse" style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '13px 28px', borderRadius: 99,
              background: 'var(--red)', color: 'white',
              fontFamily: 'var(--font-dm-sans)', fontSize: 15, fontWeight: 500,
              border: '1px solid var(--rbn)', textDecoration: 'none',
            }}>
              Browse listings →
            </Link>
            <Link href="/trust" style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '13px 24px', borderRadius: 99,
              background: 'var(--surf)', color: 'var(--ink2)',
              fontFamily: 'var(--font-dm-sans)', fontSize: 15, fontWeight: 500,
              border: '1px solid var(--brd2)', textDecoration: 'none',
            }}>
              About the ledger
            </Link>
          </div>
        </section>
      </main>

      <footer style={{
        borderTop: '1px solid var(--brd)', padding: '24px 20px',
        display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center',
      }}>
        {[
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
      </footer>
    </div>
  )
}
