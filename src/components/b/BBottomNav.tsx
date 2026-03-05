'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/b/browse',   label: 'Browse',    icon: '⊞' },
  { href: '/b/briefs',   label: 'Briefs',    icon: '◻' },
  { href: '/b/messages', label: 'Messages',  icon: '◎' },
  { href: '/b/profile',  label: 'Portfolio', icon: '◑' },
]

export function BBottomNav() {
  const pathname = usePathname()

  return (
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
      aria-label="Bartr-B navigation"
    >
      {navItems.map(({ href, label, icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 3,
              textDecoration: 'none', position: 'relative',
              color: active ? 'var(--grn)' : 'var(--faint)',
              transition: 'color 0.15s',
            }}
            aria-current={active ? 'page' : undefined}
          >
            {active && (
              <div style={{
                position: 'absolute', top: 0, left: '50%',
                transform: 'translateX(-50%)',
                width: 24, height: 2,
                background: 'var(--grn)', borderRadius: 99,
              }} />
            )}
            <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
