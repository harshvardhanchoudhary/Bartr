'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface TopBarProps {
  title?: string
  right?: React.ReactNode
  back?: boolean
  className?: string
}

export function TopBar({ title, right, className }: TopBarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 border-b border-stroke',
        'bg-bg/80 backdrop-blur-xl',
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 max-w-2xl mx-auto">
        {/* Brand */}
        <Link href="/browse" className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center border border-stroke-2 relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
            }}
          >
            <span
              className="font-display text-sm leading-none absolute"
              style={{
                background: 'radial-gradient(circle at 40% 40%, rgba(200,53,42,0.9), transparent 65%)',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span className="text-white/70 font-mono text-[9px] font-bold tracking-widest">///</span>
            </span>
          </div>
          <span className="font-display text-xl tracking-[0.15em] text-white">
            {title ?? 'BARTR'}
          </span>
        </Link>

        {/* Right slot */}
        {right && <div className="flex items-center gap-2">{right}</div>}
      </div>
    </header>
  )
}
