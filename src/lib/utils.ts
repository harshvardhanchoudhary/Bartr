import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ValueGapState } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formats a value range as a string, e.g. "£50–£100" */
export function formatValueRange(low: number | null, high: number | null, currency = 'GBP'): string {
  const symbol = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$'
  if (!low && !high) return 'Value unknown'
  if (!high || low === high) return `${symbol}${low}`
  return `${symbol}${low}–${symbol}${high}`
}

/** Determines the 5-state value gap between what's offered and what's wanted */
export function getValueGapState(
  offeredMid: number,
  targetMid: number
): ValueGapState {
  if (targetMid === 0) return 'fair'
  const ratio = offeredMid / targetMid
  const diff = ratio - 1

  if (Math.abs(diff) <= 0.15) return 'fair'
  if (diff < -0.40) return 'big_under'
  if (diff > 0.40) return 'big_over'
  if (diff < 0) return 'under'
  return 'over'
}

/** Returns Tailwind colour classes for each value gap state */
export function valueGapClasses(state: ValueGapState) {
  switch (state) {
    case 'fair':
      return { badge: 'bg-green-muted border-green-border text-green-light', icon: '✓' }
    case 'under':
      return { badge: 'bg-amber-muted border-amber-DEFAULT/40 text-amber-DEFAULT', icon: '↓' }
    case 'big_under':
      return { badge: 'bg-red-muted border-red-border text-red-light', icon: '↓↓' }
    case 'over':
      return { badge: 'bg-blue-muted border-blue-DEFAULT/40 text-blue-DEFAULT', icon: '↑' }
    case 'big_over':
      return { badge: 'bg-red-muted border-red-border text-red-light', icon: '↑↑' }
  }
}

/** Returns a human-readable label for value gap state */
export function valueGapLabel(state: ValueGapState, diff: number): string {
  switch (state) {
    case 'fair': return 'Fair trade'
    case 'under': return `Your offer is worth £${Math.abs(Math.round(diff))} less`
    case 'big_under': return `Big gap — your offer is significantly undervalued`
    case 'over': return `Your offer is worth £${Math.round(diff)} more — request something extra`
    case 'big_over': return `You're offering significantly more than the target value`
  }
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = (Date.now() - d.getTime()) / 1000

  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function conditionLabel(condition: string): string {
  const map: Record<string, string> = {
    new: 'New',
    like_new: 'Like new',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
  }
  return map[condition] ?? condition
}

export function tierLabel(tier: string): string {
  const map: Record<string, string> = {
    bronze: 'Bronze',
    silver: 'Silver',
    gold: 'Gold',
  }
  return map[tier] ?? tier
}
