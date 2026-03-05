import { cn, getValueGapState, valueGapClasses, valueGapLabel } from '@/lib/utils'
import type { ValueGapState } from '@/types'

interface ValueGapBadgeProps {
  offeredMid: number
  targetMid: number
  className?: string
}

export function ValueGapBadge({ offeredMid, targetMid, className }: ValueGapBadgeProps) {
  const state: ValueGapState = getValueGapState(offeredMid, targetMid)
  const { badge, icon } = valueGapClasses(state)
  const diff = offeredMid - targetMid
  const label = valueGapLabel(state, diff)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border',
        badge,
        className
      )}
      title={label}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  )
}
