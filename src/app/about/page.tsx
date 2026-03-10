import Link from 'next/link'

export default function AboutPage() {
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

        {/* Label */}
        <div style={{
          fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16,
        }}>
          About
        </div>

        <h1 style={{
          fontFamily: 'var(--font-instrument-serif)', fontSize: 'clamp(32px,8vw,52px)',
          lineHeight: 1.1, color: 'var(--ink)', marginBottom: 24, letterSpacing: '-0.02em',
        }}>
          Trade what you have<br />for what you love.
        </h1>

        <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 40 }}>
          Bartr is a peer-to-peer marketplace where nothing is bought or sold.
          Items are traded directly between people — no money, no middleman, no fees. Ever.
        </p>

        <div style={{ borderTop: '1px solid var(--brd)', margin: '0 0 40px' }} />

        {/* The idea */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            fontFamily: 'var(--font-instrument-serif)', fontSize: 24,
            color: 'var(--ink)', marginBottom: 16,
          }}>
            Where the idea came from
          </h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 16 }}>
            We kept noticing the same thing: everyone has stuff they no longer use, and stuff they
            really want — but getting from one state to the other always seemed to require cash.
            List on eBay, wait for a buyer, pay fees, ship the item, wait again, buy what you
            actually wanted. It felt backwards.
          </p>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.75 }}>
            The oldest economy in the world is barter. You have something I want, I have something
            you want — let&apos;s just swap. Bartr is that, but for the 21st century: searchable,
            value-matched, with a community trust layer so you know who you&apos;re trading with.
          </p>
        </section>

        {/* How trust works */}
        <section style={{
          padding: '28px',
          background: 'var(--surf)', border: '1px solid var(--brd)',
          borderRadius: 'var(--rl)', marginBottom: 48,
        }}>
          <div style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12,
          }}>
            The trust layer
          </div>
          <h2 style={{
            fontFamily: 'var(--font-instrument-serif)', fontSize: 22,
            color: 'var(--ink)', marginBottom: 12,
          }}>
            No escrow. Just a public ledger.
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 0 }}>
            Every completed trade is logged on a public ledger — permanently, immutably, with both
            parties named. This is the trust mechanism. Not a rating you can game. Not a star
            system someone can pay to boost. A permanent record of who traded what, with who, when.
            Traders with long ledgers are verifiably trustworthy.
          </p>
        </section>

        {/* Values */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{
            fontFamily: 'var(--font-instrument-serif)', fontSize: 24,
            color: 'var(--ink)', marginBottom: 24,
          }}>
            What we believe
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              {
                title: 'The best trades are fair, not cheap',
                body: 'We show you the value gap on every offer. Not to lecture you — to help you get a good deal and give one.',
              },
              {
                title: 'Things should be used, not stored',
                body: "The most sustainable thing you can do with an item you don't use is put it in the hands of someone who will. No shipping required when you meet locally.",
              },
              {
                title: 'Community creates trust, not algorithms',
                body: 'Your trade history, your verified status, your public ledger — these are earned over time through real exchanges. That\'s worth more than any algorithm.',
              },
              {
                title: 'Skills deserve the same marketplace',
                body: 'Bartr-B extends the same philosophy to freelancers: trade skills, time and expertise. A graphic designer and a copywriter shouldn\'t need invoices to help each other.',
              },
            ].map(item => (
              <div key={item.title} style={{
                display: 'flex', gap: 16, alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--red)', marginTop: 8, flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--ink)', marginBottom: 4, fontSize: 15 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>
                    {item.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bartr-B callout */}
        <section style={{
          padding: '28px',
          background: 'var(--gbg)', border: '1px solid var(--gbd)',
          borderRadius: 'var(--rl)', marginBottom: 48,
        }}>
          <div style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--grn)', marginBottom: 12,
          }}>
            Bartr-B
          </div>
          <h2 style={{
            fontFamily: 'var(--font-instrument-serif)', fontSize: 22,
            color: 'var(--ink)', marginBottom: 12,
          }}>
            For freelancers and agencies
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 20 }}>
            Bartr-B is the skills and services layer. Post a brief, offer your expertise,
            trade time for time. A Credits economy means value is tracked without invoices.
            Milestones are held in escrow via Stripe — so both sides are protected on larger engagements.
          </p>
          <Link href="/b" style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '10px 20px', borderRadius: 99,
            background: 'var(--grn)', color: 'white',
            fontFamily: 'var(--font-dm-sans)', fontSize: 13, fontWeight: 500,
            border: '1px solid #135A37', textDecoration: 'none',
          }}>
            Explore Bartr-B →
          </Link>
        </section>

        {/* CTA */}
        <section style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-instrument-serif)', fontSize: 28,
            color: 'var(--ink)', marginBottom: 8,
          }}>
            Ready to trade something?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
            Browse what&apos;s live right now — no account needed.
          </p>
          <Link href="/browse" style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '14px 32px', borderRadius: 99,
            background: 'var(--red)', color: 'white',
            fontFamily: 'var(--font-dm-sans)', fontSize: 15, fontWeight: 500,
            border: '1px solid var(--rbn)', textDecoration: 'none',
          }}>
            Browse listings →
          </Link>
        </section>
      </main>

      <footer style={{
        borderTop: '1px solid var(--brd)', padding: '24px 20px',
        display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center',
      }}>
        {[
          { label: 'How it works', href: '/how-it-works' },
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
