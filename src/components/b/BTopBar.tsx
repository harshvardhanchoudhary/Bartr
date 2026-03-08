'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PlatformSwitcher } from '@/components/layout/PlatformSwitcher'

interface BTopBarProps {
  title?: string
  right?: React.ReactNode
  back?: boolean | string
}

const PRIMARY_NAV = [
  { href: '/b/browse', label: 'Browse' },
  { href: '/b/briefs', label: 'Briefs' },
  { href: '/b/profile', label: 'Portfolio' },
  { href: '/browse', label: 'Bartr' },
]

export function BTopBar({ title, right, back }: BTopBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const showPrimaryNav = !title && !back

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        padding: showPrimaryNav ? '10px 12px 8px' : '10px 12px',
        background: scrolled ? 'rgba(246,244,241,0.86)' : 'rgba(246,244,241,0.42)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: scrolled ? '1px solid var(--brd)' : '1px solid rgba(224,220,213,0.35)',
        transition: 'background 180ms ease, border-color 180ms ease',
      }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {back && (
            <button
              onClick={() => {
                if (typeof back === 'string') router.push(back)
                else router.back()
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px 4px 0',
                color: 'var(--grn)',
                fontSize: 16,
              }}
              aria-label="Back"
            >
              ←
            </button>
          )}

          {title ? (
            <span style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 600, fontSize: 16, color: 'var(--ink)' }}>
              {title}
            </span>
          ) : (
            <Link
              href="/b/browse"
              style={{
                fontFamily: 'var(--font-instrument-serif)',
                fontSize: 23,
                color: 'var(--ink)',
                textDecoration: 'none',
                lineHeight: 1,
              }}
            >
              Bartr<span style={{ color: 'var(--grn)' }}>-B</span>
            </Link>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PlatformSwitcher />
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-dm-mono)',
              fontSize: 10,
              letterSpacing: '0.05em',
              color: 'var(--muted)',
              textDecoration: 'none',
              border: '1px solid var(--brd)',
              borderRadius: 99,
              padding: '5px 10px',
              background: 'var(--surf)',
            }}
          >
            Hub
          </Link>
          {right}
        </div>
      </div>

      {showPrimaryNav && (
        <nav
          aria-label="Bartr-B sections"
          style={{
            maxWidth: 980,
            margin: '8px auto 0',
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 2,
          }}
        >
          {PRIMARY_NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                style={{
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  borderRadius: 999,
                  border: active ? '1px solid var(--gbd)' : '1px solid var(--brd)',
                  background: active ? 'var(--gbg)' : 'var(--surf)',
                  color: active ? 'var(--grn)' : 'var(--ink2)',
                  fontFamily: 'var(--font-dm-mono)',
                  fontSize: 11,
                  letterSpacing: '0.04em',
                  padding: '7px 12px',
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      )}
    </header>
  )
}
