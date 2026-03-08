'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface OfferGateBarProps {
  listingId: string
  isDemo?: boolean
}

export function OfferGateBar({ listingId, isDemo }: OfferGateBarProps) {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user))
  }, [])

  function fireGate(e: React.MouseEvent) {
    if (!authed || isDemo) {
      e.preventDefault()
      // Include the offer URL as `next` so after sign-up the user lands on the offer page
      window.dispatchEvent(new CustomEvent('bartr:offer-gate', {
        detail: { next: `/offer/${listingId}` },
      }))
    }
  }

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
          onClick={fireGate}
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
          onClick={fireGate}
          style={{
            flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '13px', borderRadius: 99,
            background: 'var(--red)', border: '1px solid #A8251F',
            color: 'white', fontSize: 15, fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          Make offer →
        </Link>
      </div>
    </div>
  )
}
