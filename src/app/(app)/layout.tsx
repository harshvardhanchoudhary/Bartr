import type { ReactNode } from 'react'
import { BottomNav } from '@/components/layout/BottomNav'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 64 }}>
      {children}
      <BottomNav />
    </div>
  )
}
