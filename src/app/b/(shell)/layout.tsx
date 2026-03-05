import { BBottomNav } from '@/components/b/BBottomNav'
import { BTopBar } from '@/components/b/BTopBar'

export default function BartrBShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen pb-20" style={{ background: '#0a0d0b' }}>
      {children}
      <BBottomNav />
    </div>
  )
}
