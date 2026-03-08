import type { ReactNode } from 'react'
import { LandingGate } from '@/components/landing/LandingGate'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {children}
      <LandingGate />
    </div>
  )
}
