'use client'

import Link from 'next/link'

interface OfferGateBarProps {
  listingId: string
}

export function OfferGateBar({ listingId }: OfferGateBarProps) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
      padding: '12px 16px 28px',
      background: 'rgba(246,244,241,0.97)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--brd)',
    }}>
      <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', gap: 10 }}>
        <Link
          href={`/messages?listing=${listingId}`}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '13px', borderRadius: 99,
            border: '1px solid var(--brd2)', background: 'var(--surf)',
            color: 'var(--ink2)', fontSize: 14, fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          Message
        </Link>
        <Link
          href={`/offer/${listingId}`}
          style={{
            flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '13px', borderRadius: 99,
            background: 'var(--red)', border: '1px solid #A8251F',
            color: 'white', fontSize: 15, fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          Start offer →
        </Link>
      </div>
    </div>
  )
}
