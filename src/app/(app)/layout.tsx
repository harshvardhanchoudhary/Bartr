import type { ReactNode } from 'react'
import { BottomNav } from '@/components/layout/BottomNav'
import { LandingGate } from '@/components/landing/LandingGate'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 64 }}>
      {children}
      <BottomNav />
      <LandingGate />
    </div>
  )
}
