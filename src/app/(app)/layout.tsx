import type { ReactNode } from 'react'
import { BottomNav } from '@/components/layout/BottomNav'
import { NetworkMenuFab } from '@/components/layout/NetworkMenuFab'
import { PageTransition } from '@/components/layout/PageTransition'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 64 }}>
      <PageTransition>{children}</PageTransition>
      <NetworkMenuFab />
      <BottomNav />
    </div>
  )
}

