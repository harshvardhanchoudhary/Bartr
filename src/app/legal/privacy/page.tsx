import Link from 'next/link'

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--faint)', marginBottom: 40 }}>
          Last updated: 1 March 2026
        </p>

        {[
          {
            title: 'What we collect',
            body: 'We collect the information you provide when creating an account (email address, display name) and the content you post (listings, messages, trade confirmations). If you use Google sign-in, we receive your name and profile photo from Google.',
          },
          {
            title: 'How we use it',
            body: 'We use your information to operate the platform: matching offers, sending notifications, powering the public ledger and (on Bartr-B) processing milestone payments via Stripe. We do not sell your data to third parties.',
          },
          {
            title: 'The public ledger',
            body: 'Confirmed trade records are public and permanent by design. Your username, the items you traded and the date are visible to anyone. This is a core feature of the platform. If you do not want your trades publicly logged, do not confirm them.',
          },
          {
            title: 'Cookies',
            body: 'We use cookies for authentication (to keep you signed in) and basic analytics to understand how the platform is used. We do not use advertising cookies or share cookie data with advertisers.',
          },
          {
            title: 'Third parties',
            body: 'We use Supabase for database and authentication infrastructure, Vercel for hosting, and Stripe for payment processing on Bartr-B. Each provider has its own privacy policy. We do not use advertising networks.',
          },
          {
            title: 'Your rights',
            body: 'You can delete your account at any time from your profile settings. Note that public ledger entries remain even after account deletion — this is intentional and disclosed in our Terms. You can request a copy of your data at privacy@bartr.co.',
          },
          {
            title: 'Data retention',
            body: "We retain account data for as long as your account is active. After deletion, we may retain anonymised analytics data. Trade ledger entries are permanent as described above.",
          },
          {
            title: 'Contact',
            body: 'Privacy questions or requests: privacy@bartr.co.',
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
          <Link href="/legal/terms" style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--muted)',
            textDecoration: 'underline', textUnderlineOffset: 3,
          }}>
            Terms of Service →
          </Link>
        </div>
      </main>
    </div>
  )
}
