import Image from 'next/image'

interface AvatarProps {
  src?: string | null
  alt?: string
  size?: 'sm' | 'md' | 'lg'
  initials?: string
}

const sizeMap = {
  sm: 28,
  md: 40,
  lg: 56,
}

export function Avatar({ src, alt = '', size = 'md', initials }: AvatarProps) {
  const px = sizeMap[size]
  const initial = (initials ?? alt.charAt(0).toUpperCase()) || '?'

  return (
    <div style={{
      width: px, height: px, borderRadius: '50%',
      border: '1px solid var(--brd)',
      background: 'var(--bg2)',
      flexShrink: 0, overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={px}
          height={px}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      ) : (
        <span style={{
          fontFamily: 'var(--font-dm-mono)', fontSize: px * 0.36,
          color: 'var(--muted)', userSelect: 'none',
        }}>
          {initial}
        </span>
      )}
    </div>
  )
}
