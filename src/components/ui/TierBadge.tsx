import { cn, tierLabel } from '@/lib/utils'
import type { UserTier } from '@/types'

const tierStyles: Record<UserTier, string> = {
  bronze: 'text-amber-DEFAULT border-amber-DEFAULT/40 bg-amber-muted',
  silver: 'text-muted border-stroke-2 bg-white/5',
  gold: 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10',
}

interface TierBadgeProps {
  tier: UserTier
  className?: string
}

export function TierBadge({ tier, className }: TierBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono border',
        tierStyles[tier],
        className
      )}
    >
      {tierLabel(tier)}
    </span>
  )
}
