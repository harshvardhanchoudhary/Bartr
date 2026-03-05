'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface BTopBarProps {
  title?: string
  right?: React.ReactNode
  className?: string
}

export function BTopBar({ title, right, className }: BTopBarProps) {
  return (
    <header
      className={cn('sticky top-0 z-30 border-b', className)}
      style={{
        background: 'rgba(10,13,11,0.85)',
        backdropFilter: 'blur(16px)',
        borderColor: 'rgba(45,106,79,0.20)',
      }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 max-w-2xl mx-auto">
        <Link href="/b/browse" className="flex items-center gap-2.5 flex-shrink-0">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center border relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(45,106,79,0.30), rgba(45,106,79,0.08))',
              borderColor: 'rgba(45,106,79,0.45)',
            }}
          >
            <span className="font-mono text-[9px] font-bold tracking-widest" style={{ color: '#52B788' }}>
              B
            </span>
          </div>
          <span className="font-display text-xl tracking-[0.15em]" style={{ color: '#52B788' }}>
            {title ?? 'BARTR-B'}
          </span>
        </Link>

        {right && <div className="flex items-center gap-2">{right}</div>}
      </div>
    </header>
  )
}
