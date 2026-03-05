import { tierLabel } from '@/lib/utils'
import type { UserTier } from '@/types'

const tierStyles: Record<UserTier, { bg: string; border: string; color: string }> = {
  bronze: { bg: 'var(--rbg)', border: 'var(--rbd)', color: '#A0522D' },
  silver: { bg: 'var(--bg2)', border: 'var(--brd2)', color: 'var(--muted)' },
  gold:   { bg: 'var(--gldbg)', border: 'var(--gldbd)', color: 'var(--gld)' },
}

interface TierBadgeProps {
  tier: UserTier
  className?: string
}

export function TierBadge({ tier }: TierBadgeProps) {
  const s = tierStyles[tier]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 99,
      fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em',
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
    }}>
      {tierLabel(tier)}
    </span>
  )
}
