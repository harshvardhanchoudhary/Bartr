'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/browse',   label: 'Market',   icon: '⊞' },
  { href: '/social',   label: 'Social',   icon: '◎' },
  { href: '/messages', label: 'Chat',     icon: '◻' },
  { href: '/profile',  label: 'Me',       icon: '◑' },
]

export function BottomNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setAuthed(!!data.user))
  }, [])

  return (
    <>
      <nav
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
          height: 64,
          background: 'rgba(246,244,241,0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--brd)',
          display: 'flex', alignItems: 'stretch',
        }}
        aria-label="Main navigation"
      >
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 3,
                textDecoration: 'none', position: 'relative',
                color: active ? 'var(--red)' : 'var(--faint)',
                transition: 'color 0.15s',
              }}
              aria-current={active ? 'page' : undefined}
            >
              {active && (
                <div style={{
                  position: 'absolute', top: 0, left: '50%',
                  transform: 'translateX(-50%)',
                  width: 24, height: 2,
                  background: 'var(--red)', borderRadius: 99,
                }} />
              )}
              <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
              <span style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                {label}
              </span>
            </Link>
          )
        })}

        {/* More button */}
        <button
          onClick={() => setMoreOpen(true)}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 3,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--faint)',
          }}
          aria-label="More"
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>⋯</span>
          <span style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 9,
            letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            More
          </span>
        </button>
      </nav>

      {/* More sheet */}
      {moreOpen && (
        <>
          <div
            onClick={() => setMoreOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 48,
              background: 'rgba(26,24,20,0.35)',
              backdropFilter: 'blur(3px)',
              animation: 'fadeIn 0.18s ease',
            }}
          />
          <div style={{
            position: 'fixed', inset: '0 0 0 0', zIndex: 49,
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            pointerEvents: 'none',
          }}>
            <div style={{
              background: 'var(--surf)',
              borderTop: '1px solid var(--brd)',
              borderRadius: '16px 16px 0 0',
              padding: '12px 20px 40px',
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

              {/* List item CTA */}
              <Link
                href="/list"
                onClick={() => setMoreOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 8, padding: '14px',
                  background: 'var(--red)', color: 'white',
                  borderRadius: 99, border: '1px solid #A8251F',
                  fontFamily: 'var(--font-dm-sans)', fontSize: 15, fontWeight: 500,
                  textDecoration: 'none', marginBottom: 8,
                }}
              >
                + List an item
              </Link>

              {/* Bartr-B */}
              <Link
                href="/b"
                onClick={() => setMoreOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--gbg)', border: '1px solid var(--gbd)',
                  borderRadius: 'var(--rl)',
                  textDecoration: 'none', marginBottom: 16,
                }}
              >
                <div>
                  <div style={{
                    fontFamily: 'var(--font-dm-mono)', fontSize: 10,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: 'var(--grn)', marginBottom: 2,
                  }}>
                    Bartr-B
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink2)' }}>
                    Skills &amp; freelance marketplace
                  </div>
                </div>
                <span style={{ color: 'var(--grn)', fontSize: 16 }}>→</span>
              </Link>

              {/* Info links */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: 8, marginBottom: 16,
              }}>
                {[
                  { href: '/how-it-works', label: 'How it works', icon: '◷' },
                  { href: '/trust', label: 'Trust & ledger', icon: '◈' },
                  { href: '/about', label: 'About Bartr', icon: '◎' },
                  { href: '/', label: 'Home', icon: '⌂' },
                ].map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '11px 14px',
                      background: 'var(--bg2)', border: '1px solid var(--brd)',
                      borderRadius: 'var(--rl)', textDecoration: 'none',
                    }}
                  >
                    <span style={{ color: 'var(--muted)', fontSize: 14 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, color: 'var(--ink2)' }}>{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Auth */}
              <div style={{
                borderTop: '1px solid var(--brd)', paddingTop: 16,
                display: 'flex', gap: 8,
              }}>
                {authed ? (
                  <Link
                    href="/profile"
                    onClick={() => setMoreOpen(false)}
                    style={{
                      flex: 1, textAlign: 'center', padding: '11px',
                      border: '1px solid var(--brd2)', borderRadius: 99,
                      fontSize: 14, color: 'var(--ink2)', textDecoration: 'none',
                    }}
                  >
                    My profile
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMoreOpen(false)}
                      style={{
                        flex: 1, textAlign: 'center', padding: '11px',
                        border: '1px solid var(--brd2)', borderRadius: 99,
                        fontSize: 14, color: 'var(--ink2)', textDecoration: 'none',
                      }}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMoreOpen(false)}
                      style={{
                        flex: 1, textAlign: 'center', padding: '11px',
                        background: 'var(--ink)', color: 'white', borderRadius: 99,
                        border: '1px solid var(--ink)', fontSize: 14, textDecoration: 'none',
                      }}
                    >
                      Create account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
