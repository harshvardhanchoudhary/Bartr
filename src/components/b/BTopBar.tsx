'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface BTopBarProps {
  title?: string
  right?: React.ReactNode
  back?: boolean | string
}

export function BTopBar({ title, right, back }: BTopBarProps) {
  const router = useRouter()

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px', height: 52,
      background: 'rgba(246,244,241,0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--brd)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {back && (
          <button
            onClick={() => {
              if (typeof back === 'string') router.push(back)
              else router.back()
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px 4px 0', color: 'var(--grn)', fontSize: 16 }}
            aria-label="Back"
          >
            ←
          </button>
        )}
        {title ? (
          <span style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 500, fontSize: 16, color: 'var(--ink)' }}>
            {title}
          </span>
        ) : (
          <Link href="/b/browse" style={{
            fontFamily: 'var(--font-instrument-serif)', fontSize: 20,
            color: 'var(--ink)', textDecoration: 'none',
          }}>
            Bartr<span style={{ color: 'var(--grn)' }}>-B</span>
          </Link>
        )}
      </div>

      {right && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{right}</div>
      )}
    </header>
  )
}
