import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'

export default async function MyProfileRoute() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('handle')
      .eq('id', user.id)
      .single()

    if (profile?.handle) redirect(`/profile/${profile.handle}`)
    redirect('/profile/setup')
  }

  return (
    <>
      <TopBar title="Profile" />
      <main style={{ maxWidth: 680, margin: '0 auto', padding: '20px 16px 90px' }}>
        <div style={{
          background: 'var(--surf)',
          border: '1px solid var(--brd)',
          borderRadius: 'var(--rl)',
          padding: 16,
        }}>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
            Public-first browsing
          </div>
          <h1 style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 26, marginBottom: 8 }}>Explore profiles freely</h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>
            You can browse listings, profiles, social taste and trade history without signing up.
            Sign in only when you want to commit actions like sending offers or posting.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link href="/social" className="btn">Browse social</Link>
            <Link href="/browse" className="btn">Browse listings</Link>
            <Link href="/login?next=/profile" className="btn btn-primary">Sign in to view your profile</Link>
          </div>
        </div>
      </main>
    </>
  )
}
