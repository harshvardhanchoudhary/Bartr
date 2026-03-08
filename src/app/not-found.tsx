import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px', textAlign: 'center',
    }}>
      {/* Wordmark */}
      <Link href="/" style={{
        fontFamily: 'var(--font-instrument-serif)',
        fontSize: 28, color: 'var(--ink)', textDecoration: 'none',
        marginBottom: 32, display: 'block',
      }}>
        Bartr
      </Link>

      {/* Big 404 */}
      <div style={{
        fontFamily: 'var(--font-dm-mono)', fontSize: 80,
        color: 'var(--brd2)', lineHeight: 1, marginBottom: 16,
        letterSpacing: '-0.04em',
      }}>
        404
      </div>

      <h1 style={{
        fontFamily: 'var(--font-instrument-serif)',
        fontSize: 24, color: 'var(--ink)', marginBottom: 8,
      }}>
        This page doesn&apos;t exist
      </h1>

      <p style={{
        fontSize: 14, color: 'var(--muted)', lineHeight: 1.6,
        maxWidth: 320, marginBottom: 32,
      }}>
        The listing, profile, or page you were looking for isn&apos;t here.
        Maybe it was traded away.
      </p>

      {/* Nav options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 280 }}>
        <Link href="/browse" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '13px', borderRadius: 99,
          background: 'var(--red)', border: '1px solid #A8251F',
          color: 'white', fontSize: 15, fontWeight: 500,
          textDecoration: 'none',
        }}>
          Browse listings
        </Link>

        <Link href="/" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '12px', borderRadius: 99,
          border: '1px solid var(--brd2)', background: 'var(--surf)',
          color: 'var(--ink2)', fontSize: 14,
          textDecoration: 'none',
        }}>
          Back to home
        </Link>
      </div>

      {/* Secondary links */}
      <div style={{
        display: 'flex', gap: 20, marginTop: 32,
        fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--faint)',
      }}>
        <Link href="/how-it-works" style={{ color: 'var(--faint)', textDecoration: 'none' }}>
          How it works
        </Link>
        <Link href="/b/browse" style={{ color: 'var(--faint)', textDecoration: 'none' }}>
          Bartr-B
        </Link>
        <Link href="/about" style={{ color: 'var(--faint)', textDecoration: 'none' }}>
          About
        </Link>
      </div>
    </div>
  )
}
