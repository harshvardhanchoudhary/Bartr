import { BBottomNav } from '@/components/b/BBottomNav'
import { NetworkMenuFab } from '@/components/layout/NetworkMenuFab'
import { PageTransition } from '@/components/layout/PageTransition'

export default function BartrBShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 64 }}>
      <PageTransition>{children}</PageTransition>
      <NetworkMenuFab />
      <BBottomNav />
    </div>
  )
}

