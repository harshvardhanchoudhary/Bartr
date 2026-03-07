import Link from 'next/link'

export default function TermsPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
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
          color: 'var(--ink)', textDecoration: 'none',
        }}>
          Bartr
        </Link>
      </nav>

      <main style={{ maxWidth: 640, margin: '0 auto', padding: '52px 24px 80px' }}>
        <div style={{
          fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16,
        }}>
          Legal
        </div>
        <h1 style={{
          fontFamily: 'var(--font-instrument-serif)', fontSize: 36,
          color: 'var(--ink)', marginBottom: 8, letterSpacing: '-0.01em',
        }}>
          Terms of Service
        </h1>
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--faint)', marginBottom: 40 }}>
          Last updated: 1 March 2026
        </p>

        {[
          {
            title: '1. What Bartr is',
            body: 'Bartr is a peer-to-peer platform that enables users to trade physical goods and services directly with each other. Bartr is a marketplace only — we are not a party to any trade, do not hold goods on your behalf, and do not process payments between users on the consumer platform.',
          },
          {
            title: '2. Eligibility',
            body: 'You must be 18 or older to use Bartr. By creating an account, you confirm you are legally permitted to enter into agreements in your jurisdiction.',
          },
          {
            title: '3. Listings and offers',
            body: "You are responsible for the accuracy of your listings. Items must be yours to trade. Counterfeit goods, stolen items, weapons, hazardous materials and other prohibited items are not permitted. We reserve the right to remove any listing that violates these terms.",
          },
          {
            title: '4. Trades',
            body: 'Trades are agreed directly between users. Bartr logs confirmed trades on the public ledger as a permanent record, but we are not responsible for the outcome of any trade. We strongly recommend meeting in public places for in-person trades and checking items before completing a swap.',
          },
          {
            title: '5. The public ledger',
            body: "Trade records on the public ledger are permanent and cannot be removed. By confirming a trade, you consent to that trade being publicly logged with your username, the items traded and the date. This is a core feature of the platform, not optional.",
          },
          {
            title: '6. Bartr-B',
            body: "Bartr-B facilitates the trading of professional skills and services. Where Credits are used and Stripe escrow is involved, additional terms apply. Milestone payments held in escrow are subject to Stripe's terms of service.",
          },
          {
            title: '7. Prohibited conduct',
            body: 'You may not use Bartr to defraud other users, misrepresent items, harass or threaten other users, scrape or automate the platform, or engage in any activity that harms other users or the platform.',
          },
          {
            title: '8. Liability',
            body: "Bartr is provided 'as is'. We are not liable for any loss arising from trades, disputes between users, or platform unavailability. Our liability is limited to the maximum extent permitted by applicable law.",
          },
          {
            title: '9. Changes to these terms',
            body: 'We may update these terms. Continued use of Bartr after changes constitutes acceptance. We will notify users of material changes via email.',
          },
          {
            title: '10. Contact',
            body: 'Questions about these terms? Email us at legal@bartr.co.',
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>
              {section.title}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75 }}>
              {section.body}
            </p>
          </div>
        ))}

        <div style={{ borderTop: '1px solid var(--brd)', paddingTop: 24 }}>
          <Link href="/legal/privacy" style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--muted)',
            textDecoration: 'underline', textUnderlineOffset: 3,
          }}>
            Privacy Policy →
          </Link>
        </div>
      </main>
    </div>
  )
}
