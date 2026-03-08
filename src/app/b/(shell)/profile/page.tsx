import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BTopBar } from '@/components/b/BTopBar'

export default async function BProfileRoute() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('handle')
      .eq('id', user.id)
      .single()

    if (profile?.handle) redirect(`/b/profile/${profile.handle}`)
    redirect('/profile/setup')
  }

  return (
    <>
      <BTopBar title="Portfolio" />
      <main style={{ maxWidth: 680, margin: '0 auto', padding: '20px 16px 90px' }}>
        <div style={{
          background: 'var(--surf)',
          border: '1px solid var(--brd)',
          borderRadius: 'var(--rl)',
          padding: 16,
        }}>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--grn)', marginBottom: 8 }}>
            Bartr-B network
          </div>
          <h1 style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 26, marginBottom: 8 }}>Discover portfolios before signup</h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>
            Browse service profiles, open briefs and pricing context first.
            Sign in only when you are ready to offer a service or apply.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link href="/b/browse" className="btn">Browse services</Link>
            <Link href="/b/briefs" className="btn">Browse briefs</Link>
            <Link href="/login?next=/b/profile" className="btn btn-green">Sign in to view your portfolio</Link>
          </div>
        </div>
      </main>
    </>
  )
}
