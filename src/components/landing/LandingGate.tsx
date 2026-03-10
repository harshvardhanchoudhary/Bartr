'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Custom event detail carries an optional `next` URL so after sign-up the user
// lands back on the page they were trying to act on (e.g. /offer/[listingId]).
export function LandingGate() {
  const [visible, setVisible] = useState(false)
  const [nextUrl, setNextUrl] = useState('/browse')

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ next?: string }>).detail
      setNextUrl(detail?.next ?? '/browse')
      setVisible(true)
    }
    window.addEventListener('bartr:offer-gate', handler as EventListener)
    return () => window.removeEventListener('bartr:offer-gate', handler as EventListener)
  }, [])

  if (!visible) return null

  const loginUrl = `/login?next=${encodeURIComponent(nextUrl)}`
  const signupUrl = `/login?next=${encodeURIComponent(nextUrl)}`

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setVisible(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(26,24,20,0.35)',
          backdropFilter: 'blur(3px)',
          animation: 'fadeIn 0.18s ease',
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'fixed', inset: '0 0 0 0', zIndex: 50,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        pointerEvents: 'none',
      }}>
        <div style={{
          background: 'var(--surf)',
          borderTop: '1px solid var(--brd)',
          borderRadius: '16px 16px 0 0',
          padding: '20px 24px 40px',
          pointerEvents: 'auto',
          animation: 'slideUp 0.28s cubic-bezier(0.32,0.72,0,1)',
          maxWidth: 540, width: '100%', margin: '0 auto',
          boxShadow: '0 -4px 32px rgba(26,24,20,0.12)',
        }}>
          {/* Handle */}
          <div style={{
            width: 36, height: 4, borderRadius: 99,
            background: 'var(--brd2)', margin: '0 auto 20px',
          }} />

          <h2 style={{
            fontFamily: 'var(--font-instrument-serif)',
            fontSize: 24, color: 'var(--ink)', marginBottom: 8,
          }}>
            Almost there
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 24 }}>
            Create a free account to make offers and list your own items.
            Takes under a minute — just your email, no password needed.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href={signupUrl} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '14px 24px', borderRadius: 99,
              background: 'var(--red)', color: 'white',
              fontFamily: 'var(--font-dm-sans)', fontSize: 15, fontWeight: 500,
              border: '1px solid var(--rbn)', textDecoration: 'none',
            }}>
              Create free account →
            </Link>
            <Link href={loginUrl} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '13px 24px', borderRadius: 99,
              background: 'var(--surf)', color: 'var(--ink2)',
              fontFamily: 'var(--font-dm-sans)', fontSize: 15, fontWeight: 400,
              border: '1px solid var(--brd2)', textDecoration: 'none',
            }}>
              I already have an account
            </Link>
          </div>

          <p style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: 'var(--faint)' }}>
            No credit card. No spam. No fees.
          </p>
        </div>
      </div>
    </>
  )
}
