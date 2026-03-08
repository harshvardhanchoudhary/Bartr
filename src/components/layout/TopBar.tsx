'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface TopBarProps {
  title?: string
  right?: React.ReactNode
  back?: boolean | string  // true = go back, string = href to go back to
}

export function TopBar({ title, right, back }: TopBarProps) {
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {back && (
          <button
            onClick={() => {
              if (typeof back === 'string') router.push(back)
              else router.back()
            }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '4px 4px 4px 0', color: 'var(--red)', fontSize: 16,
            }}
            aria-label="Back"
          >
            ←
          </button>
        )}

        {/* Bartr wordmark — always visible, always links home */}
        <Link href="/" style={{
          fontFamily: 'var(--font-instrument-serif)',
          fontSize: 22, color: 'var(--ink)', textDecoration: 'none',
          lineHeight: 1,
        }}>
          Bartr
        </Link>

        {/* Page title shown after wordmark with a separator */}
        {title && (
          <>
            <span style={{ color: 'var(--brd2)', fontSize: 14, lineHeight: 1 }}>·</span>
            <span style={{
              fontFamily: 'var(--font-dm-sans)', fontWeight: 500,
              fontSize: 14, color: 'var(--ink2)',
            }}>
              {title}
            </span>
          </>
        )}
      </div>

      {right && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {right}
        </div>
      )}
    </header>
  )
}
