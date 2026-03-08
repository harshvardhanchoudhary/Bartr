'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function PlatformSwitcher() {
  const pathname = usePathname()
  const inB = pathname.startsWith('/b')

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <Link
        href="/browse"
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: 10,
          letterSpacing: '0.04em',
          padding: '4px 9px',
          borderRadius: 99,
          textDecoration: 'none',
          border: `1px solid ${!inB ? '#A8251F' : 'var(--brd)'}`,
          background: !inB ? 'var(--rbg)' : 'var(--surf)',
          color: !inB ? 'var(--red)' : 'var(--muted)',
        }}
      >
        Bartr
      </Link>
      <Link
        href="/b/browse"
        style={{
          fontFamily: 'var(--font-dm-mono)',
          fontSize: 10,
          letterSpacing: '0.04em',
          padding: '4px 9px',
          borderRadius: 99,
          textDecoration: 'none',
          border: `1px solid ${inB ? '#136038' : 'var(--brd)'}`,
          background: inB ? 'var(--gbg)' : 'var(--surf)',
          color: inB ? 'var(--grn)' : 'var(--muted)',
        }}
      >
        Bartr-B
      </Link>
    </div>
  )
}
