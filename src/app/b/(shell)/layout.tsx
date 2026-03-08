import { BBottomNav } from '@/components/b/BBottomNav'
import { NetworkMenuFab } from '@/components/layout/NetworkMenuFab'

export default function BartrBShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 64 }}>
      {children}
      <NetworkMenuFab />
      <BBottomNav />
    </div>
  )
}
