import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean)

interface StatRow {
  label: string
  value: string | number
  sub?: string
  accent?: 'red' | 'green' | 'gold'
}

async function getStats() {
  const supabase = await createClient()

  const [
    { count: profileCount },
    { count: listingCount },
    { count: serviceCount },
    { count: tradeCount },
    { count: briefCount },
    { count: applicationCount },
    { data: recentUsers },
    { data: recentTrades },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('service_listings').select('*', { count: 'exact', head: true }).eq('is_available', true),
    supabase.from('offers').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('briefs').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('brief_applications').select('*', { count: 'exact', head: true }),
    supabase.from('profiles')
      .select('handle, display_name, created_at, tier, trade_count')
      .order('created_at', { ascending: false })
      .limit(8),
    supabase.from('offers')
      .select('id, created_at, status, offered_items, listing:listings(title)')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(8),
  ])

  return {
    profileCount: profileCount ?? 0,
    listingCount: listingCount ?? 0,
    serviceCount: serviceCount ?? 0,
    tradeCount: tradeCount ?? 0,
    briefCount: briefCount ?? 0,
    applicationCount: applicationCount ?? 0,
    recentUsers: recentUsers ?? [],
    recentTrades: recentTrades ?? [],
  }
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Auth gate — must be logged in and in the admin list
  if (!user) redirect('/login?next=/admin')
  if (ADMIN_EMAILS.length > 0 && !ADMIN_EMAILS.includes(user.email ?? '')) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 360 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⛔</div>
          <h1 style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 22, marginBottom: 8 }}>Access denied</h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>
            Admin access is restricted. Your email is not on the allowlist.
          </p>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)' }}>
            Set ADMIN_EMAILS in your Vercel env vars to grant access.
          </p>
          <Link href="/" style={{ display: 'inline-block', marginTop: 20, color: 'var(--red)', fontSize: 13 }}>← Back to Bartr</Link>
        </div>
      </div>
    )
  }

  const stats = await getStats()

  const STAT_CARDS: StatRow[] = [
    { label: 'Members', value: stats.profileCount, sub: 'Total accounts', accent: 'red' },
    { label: 'Active listings', value: stats.listingCount, sub: 'Bartr items', accent: 'red' },
    { label: 'Skills listed', value: stats.serviceCount, sub: 'Bartr-B services', accent: 'green' },
    { label: 'Trades completed', value: stats.tradeCount, sub: 'Logged on ledger', accent: 'gold' },
    { label: 'Open briefs', value: stats.briefCount, sub: 'Bartr-B', accent: 'green' },
    { label: 'Applications', value: stats.applicationCount, sub: 'To briefs', accent: 'green' },
  ]

  const ACCENT = {
    red: { bg: 'var(--rbg)', border: 'var(--rbd)', color: 'var(--red)' },
    green: { bg: 'var(--gbg)', border: 'var(--gbd)', color: 'var(--grn)' },
    gold: { bg: 'var(--gldbg)', border: 'var(--gldbd)', color: 'var(--gld)' },
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 60 }}>
      {/* Header */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 52,
        background: 'rgba(246,244,241,0.94)', backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--brd)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 18, color: 'var(--ink)', textDecoration: 'none' }}>
            Bartr
          </Link>
          <span style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--red)',
            background: 'var(--rbg)', border: '1px solid var(--rbd)',
            borderRadius: 99, padding: '2px 8px', letterSpacing: '0.06em',
          }}>
            ADMIN
          </span>
        </div>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--faint)' }}>
          {user.email}
        </span>
      </nav>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>

        <h1 style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 26, color: 'var(--ink)', marginBottom: 4 }}>
          Platform overview
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 28, fontFamily: 'var(--font-dm-mono)' }}>
          Live data from Supabase · refresh page to update
        </p>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          {STAT_CARDS.map(stat => {
            const a = ACCENT[stat.accent ?? 'red']
            return (
              <div key={stat.label} style={{
                padding: '16px', borderRadius: 'var(--rl)',
                background: a.bg, border: `1px solid ${a.border}`,
              }}>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 28, fontWeight: 500, color: a.color, marginBottom: 4 }}>
                  {stat.value.toLocaleString()}
                </div>
                <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--ink)', marginBottom: 2 }}>{stat.label}</div>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: 'var(--faint)', letterSpacing: '0.06em' }}>{stat.sub}</div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Recent users */}
          <div style={{
            background: 'var(--surf)', border: '1px solid var(--brd)',
            borderRadius: 'var(--rl)', overflow: 'hidden',
          }}>
            <div style={{
              padding: '12px 14px', borderBottom: '1px solid var(--brd)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>
                Recent members
              </span>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)' }}>
                {stats.profileCount} total
              </span>
            </div>
            <div>
              {stats.recentUsers.map((u: { handle: string; display_name: string | null; created_at: string; tier: string; trade_count: number }) => (
                <Link
                  key={u.handle}
                  href={`/profile/${u.handle}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderBottom: '1px solid var(--brd)',
                    textDecoration: 'none',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>
                      {u.display_name ?? `@${u.handle}`}
                    </div>
                    <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)' }}>
                      @{u.handle} · {u.tier}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--muted)' }}>
                      {u.trade_count} trades
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent completed trades */}
          <div style={{
            background: 'var(--surf)', border: '1px solid var(--brd)',
            borderRadius: 'var(--rl)', overflow: 'hidden',
          }}>
            <div style={{
              padding: '12px 14px', borderBottom: '1px solid var(--brd)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>
                Completed trades
              </span>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)' }}>
                {stats.tradeCount} total
              </span>
            </div>
            <div>
              {stats.recentTrades.length === 0 && (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--faint)', fontSize: 13 }}>
                  No completed trades yet
                </div>
              )}
              {stats.recentTrades.map((t: { id: string; created_at: string; listing?: { title: string }[] | null }) => (
                <div key={t.id} style={{
                  padding: '10px 14px', borderBottom: '1px solid var(--brd)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>
                    {(Array.isArray(t.listing) ? (t.listing as Array<{title: string}>)[0]?.title : (t.listing as {title:string}|null)?.title) ?? 'Trade'}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-dm-mono)', fontSize: 10,
                    color: 'var(--grn)', background: 'var(--gbg)',
                    border: '1px solid var(--gbd)', borderRadius: 99, padding: '2px 8px',
                  }}>
                    ✓ done
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div style={{ marginTop: 24, padding: '16px', background: 'var(--surf)', border: '1px solid var(--brd)', borderRadius: 'var(--rl)' }}>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 12 }}>
            Quick links
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { label: 'Supabase dashboard', href: 'https://supabase.com/dashboard' },
              { label: 'Browse (Bartr)', href: '/browse' },
              { label: 'Browse (Bartr-B)', href: '/b/browse' },
              { label: 'Open briefs', href: '/b/briefs' },
              { label: 'Public ledger', href: '/trust' },
            ].map(l => (
              <a key={l.href} href={l.href} style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 11,
                padding: '5px 12px', borderRadius: 99,
                border: '1px solid var(--brd)', background: 'var(--bg2)',
                color: 'var(--ink2)', textDecoration: 'none',
              }}>
                {l.label} →
              </a>
            ))}
          </div>
        </div>

        <p style={{ marginTop: 20, fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)', textAlign: 'center' }}>
          Set <code>ADMIN_EMAILS</code> in Vercel env vars (comma-separated) to control access.
        </p>
      </main>
    </div>
  )
}
