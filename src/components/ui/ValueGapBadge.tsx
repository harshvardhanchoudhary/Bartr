import { getValueGapState, valueGapLabel } from '@/lib/utils'
import type { ValueGapState } from '@/types'

const stateStyles: Record<ValueGapState, { bg: string; border: string; color: string; icon: string }> = {
  fair:      { bg: 'var(--gbg)',   border: 'var(--gbd)',   color: 'var(--grn)', icon: '✓' },
  short:     { bg: 'var(--rbg)',   border: 'var(--rbd)',   color: 'var(--red)', icon: '↓' },
  way_short: { bg: 'var(--rbg)',   border: 'var(--rbd)',   color: 'var(--red)', icon: '↓↓' },
  over:      { bg: 'var(--blubg)', border: 'var(--blubd)', color: 'var(--blu)', icon: '↑' },
  way_over:  { bg: 'var(--gldbg)', border: 'var(--gldbd)', color: 'var(--gld)', icon: '↑↑' },
}

interface ValueGapBadgeProps {
  offeredMid: number
  targetMid: number
  className?: string
}

export function ValueGapBadge({ offeredMid, targetMid }: ValueGapBadgeProps) {
  const state: ValueGapState = getValueGapState(offeredMid, targetMid)
  const s = stateStyles[state]
  const diff = offeredMid - targetMid
  const label = valueGapLabel(state, diff)

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 10px', borderRadius: 99,
      fontFamily: 'var(--font-dm-mono)', fontSize: 11,
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
    }}>
      <span>{s.icon}</span>
      <span>{label}</span>
    </span>
  )
}
