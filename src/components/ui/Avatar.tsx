import Image from 'next/image'
import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  alt?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'avatar-sm w-7 h-7',
  md: 'avatar-md w-10 h-10',
  lg: 'avatar-lg w-14 h-14',
}

export function Avatar({ src, alt = '', size = 'md', className }: AvatarProps) {
  return (
    <div className={cn(sizeMap[size], className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={size === 'lg' ? 56 : size === 'sm' ? 28 : 40}
          height={size === 'lg' ? 56 : size === 'sm' ? 28 : 40}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-surface-2 flex items-center justify-center">
          <span className="text-muted-2 text-xs font-mono">
            {alt.charAt(0).toUpperCase() || '?'}
          </span>
        </div>
      )}
    </div>
  )
}
