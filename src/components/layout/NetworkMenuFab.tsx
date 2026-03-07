'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NetworkMenuFab() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const items = [
    { href: '/', label: 'Brand hub', sub: 'Overview + both marketplaces' },
    { href: '/browse', label: 'Bartr marketplace', sub: 'Physical item swaps' },
    { href: '/b/browse', label: 'Bartr-B marketplace', sub: 'Skills + briefs + Credits' },
    { href: '/social', label: 'Community feed', sub: 'Trade patterns + social context' },
    { href: '/b/briefs', label: 'Open briefs', sub: 'Demand side of Bartr-B' },
  ]

  return (
    <>
      {open && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 90,
            background: 'rgba(26,24,20,0.25)',
            border: 'none',
          }}
          aria-label="Close network menu"
        />
      )}

      <div style={{ position: 'fixed', right: 14, bottom: 76, zIndex: 95 }}>
        {open && (
          <div style={{
            width: 280,
            marginBottom: 10,
            padding: 10,
            background: 'var(--surf)',
            border: '1px solid var(--brd)',
            borderRadius: 'var(--rl)',
            boxShadow: '0 8px 24px rgba(26,24,20,0.12)',
          }}>
            <div style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--muted)',
              padding: '4px 4px 8px',
            }}>
              Explore Bartr network
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    style={{
                      textDecoration: 'none',
                      border: `1px solid ${active ? 'var(--brd2)' : 'var(--brd)'}`,
                      background: active ? 'var(--bg2)' : 'var(--surf)',
                      borderRadius: 10,
                      padding: '8px 10px',
                      color: 'var(--ink)',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{item.sub}</div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          style={{
            border: '1px solid var(--brd2)',
            background: 'var(--surf)',
            color: 'var(--ink)',
            borderRadius: 999,
            padding: '10px 14px',
            fontFamily: 'var(--font-dm-mono)',
            fontSize: 11,
            letterSpacing: '0.05em',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(26,24,20,0.10)',
          }}
          aria-expanded={open}
          aria-controls="network-menu"
        >
          {open ? 'Close' : 'Explore'}
        </button>
      </div>
    </>
  )
}
