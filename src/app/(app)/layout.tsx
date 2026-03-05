import { BottomNav } from '@/components/layout/BottomNav'

/**
 * Shell for the main app screens:
 * social, browse, messages, profile
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen pb-20">
      {children}
      <BottomNav />
    </div>
  )
}
