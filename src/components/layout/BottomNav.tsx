'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/social', label: 'Social', icon: '◎' },
  { href: '/browse', label: 'Market', icon: '⊞' },
  { href: '/messages', label: 'Messages', icon: '◻' },
  { href: '/profile', label: 'Shop', icon: '◑' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="bottom-nav safe-area-bottom" aria-label="Main navigation">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2">
        {navItems.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[56px]',
                active
                  ? 'text-red-light'
                  : 'text-muted-2 hover:text-muted'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <span className="text-xl leading-none">{icon}</span>
              <span className={cn('text-[10px] font-mono tracking-wide', active && 'text-red-light')}>
                {label}
              </span>
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-red-light rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
