'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// This component listens for a custom event fired when an unauthenticated user
// tries to make an offer from the landing page. It slides up from the bottom.
export function LandingGate() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(true)
    window.addEventListener('bartr:offer-gate', handler)
    return () => window.removeEventListener('bartr:offer-gate', handler)
  }, [])

  if (!visible) return null

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
            Make your offer
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 24 }}>
            Create a free account to send offers, list your own items, and start trading.
            Takes under 2 minutes.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/signup" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '14px 24px', borderRadius: 99,
              background: 'var(--red)', color: 'white',
              fontFamily: 'var(--font-dm-sans)', fontSize: 15, fontWeight: 500,
              border: '1px solid #A8251F', textDecoration: 'none',
            }}>
              Create free account →
            </Link>
            <Link href="/login" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '13px 24px', borderRadius: 99,
              background: 'var(--surf)', color: 'var(--ink2)',
              fontFamily: 'var(--font-dm-sans)', fontSize: 15, fontWeight: 400,
              border: '1px solid var(--brd2)', textDecoration: 'none',
            }}>
              Sign in
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
