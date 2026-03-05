'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/b/browse', label: 'Browse' },
  { href: '/b/briefs', label: 'Briefs' },
  { href: '/b/messages', label: 'Messages' },
  { href: '/b/profile', label: 'Portfolio' },
]

export function BBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t"
      style={{
        background: 'rgba(10,13,11,0.92)',
        backdropFilter: 'blur(16px)',
        borderColor: 'rgba(45,106,79,0.20)',
      }}
      aria-label="Bartr-B navigation"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2">
        {navItems.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[56px]',
                active ? '' : 'opacity-40 hover:opacity-70'
              )}
              style={active ? { color: '#52B788' } : { color: 'rgba(255,255,255,0.5)' }}
              aria-current={active ? 'page' : undefined}
            >
              <span className="text-[10px] font-mono tracking-wide">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
