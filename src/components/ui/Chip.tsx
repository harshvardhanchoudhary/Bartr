import { cn } from '@/lib/utils'

interface ChipProps {
  children: React.ReactNode
  variant?: 'default' | 'red' | 'green' | 'amber' | 'blue'
  className?: string
}

export function Chip({ children, variant = 'default', className }: ChipProps) {
  return (
    <span
      className={cn(
        'chip',
        variant === 'red' && 'chip-red',
        variant === 'green' && 'chip-green',
        variant === 'amber' && 'chip-amber',
        variant === 'blue' && 'chip-blue',
        className
      )}
    >
      {children}
    </span>
  )
}
