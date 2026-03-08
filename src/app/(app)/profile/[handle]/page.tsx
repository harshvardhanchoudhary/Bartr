import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { Avatar } from '@/components/ui/Avatar'
import { TierBadge } from '@/components/ui/TierBadge'
import { ListingCard } from '@/components/listings/ListingCard'
import { formatRelativeTime } from '@/lib/utils'
import { DEMO_LISTINGS } from '@/lib/demo-data'
import type { Profile, Listing, LedgerEntry } from '@/types'

interface Props {
  params: { handle: string }
}

// Build a lookup of demo profiles from the demo listings
const DEMO_PROFILES = Object.fromEntries(
  DEMO_LISTINGS
    .filter(l => l.profile)
    .map(l => [l.profile!.handle, l.profile!])
)

export default async function ProfilePage({ params }: Props) {
  const supabase = await createClient()
  const handle = decodeURIComponent(params.handle).replace(/^@/, '')

  // Try real DB first
  const { data: dbProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('handle', handle)
    .single()

  // Fall back to demo profile if handle matches one of our demo traders
  const isDemo = !dbProfile && !!DEMO_PROFILES[handle]
  const profile = (dbProfile ?? DEMO_PROFILES[handle] ?? null) as Profile | null

  if (!profile) notFound()

  // For real profiles: fetch their listings + ledger
  const [{ data: dbListings }, { data: ledger }] = isDemo
    ? [{ data: null }, { data: null }]
    : await Promise.all([
        supabase
          .from('listings')
          .select('*, profile:profiles(id, handle, display_name, avatar_url, tier)')
          .eq('user_id', profile.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(12),
        supabase
          .from('ledger_entries')
          .select('*')
          .or(`from_profile_id.eq.${profile.id},to_profile_id.eq.${profile.id}`)
          .order('created_at', { ascending: false })
          .limit(10),
      ])

  // For demo profiles: show their demo listings
  const listings: Listing[] = isDemo
    ? DEMO_LISTINGS.filter(l => l.profile?.handle === handle)
    : (dbListings ?? []) as Listing[]

  const ledgerEntries = (ledger ?? []) as LedgerEntry[]
  const verifications = [profile.verified_id, profile.verified_phone, profile.verified_photo].filter(Boolean)

  const chip = (label: string, active: boolean) => (
    <span key={label} style={{
      fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.06em',
      padding: '4px 10px', borderRadius: 99,
      background: active ? 'var(--gbg)' : 'var(--bg2)',
      border: `1px solid ${active ? 'var(--gbd)' : 'var(--brd)'}`,
      color: active ? 'var(--grn)' : 'var(--faint)',
      opacity: active ? 1 : 0.6,
    }}>
      {active ? '✓ ' : ''}{label}
    </span>
  )

  return (
    <>
      <TopBar back title={`@${handle}`} />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '16px 16px 100px', width: '100%' }}>

        {/* Demo banner */}
        {isDemo && (
          <div style={{
            padding: '10px 14px', marginBottom: 16,
            background: 'var(--gldbg)', border: '1px solid var(--gldbd)',
            borderRadius: 'var(--rl)', fontSize: 12, color: 'var(--gld)',
            fontFamily: 'var(--font-dm-mono)',
          }}>
            Sample trader profile — sign up to see real community members
          </div>
        )}

        {/* Profile card */}
        <div style={{
          background: 'var(--surf)', border: '1px solid var(--brd)',
          borderRadius: 'var(--rl)', padding: '20px', marginBottom: 16,
        }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 16 }}>
            <Avatar
              src={profile.avatar_url}
              alt={profile.display_name ?? profile.handle}
              size="lg"
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
                <h1 style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>
                  {profile.display_name ?? `@${handle}`}
                </h1>
                <TierBadge tier={profile.tier} />
              </div>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 12,
                color: 'var(--muted)', marginBottom: 10,
              }}>
                @{handle}
              </div>

              {profile.bio && (
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 10 }}>
                  {profile.bio}
                </p>
              )}

              {/* Stats row */}
              <div style={{ display: 'flex', gap: 20 }}>
                {[
                  { value: profile.trade_count ?? 0, label: 'trades' },
                  { value: profile.follower_count ?? 0, label: 'followers' },
                  { value: `${verifications.length}/3`, label: 'verified' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>{stat.value}</div>
                    <div style={{
                      fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                      color: 'var(--faint)', letterSpacing: '0.06em', textTransform: 'uppercase',
                    }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Verification + location */}
          <div style={{
            borderTop: '1px solid var(--brd)', paddingTop: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
          }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {chip('ID', !!profile.verified_id)}
              {chip('Phone', !!profile.verified_phone)}
              {chip('Photo', !!profile.verified_photo)}
            </div>
            {profile.location && (
              <span style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 10,
                color: 'var(--faint)', letterSpacing: '0.04em',
              }}>
                {profile.location}
              </span>
            )}
          </div>
        </div>

        {/* Active listings */}
        {listings.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12,
            }}>
              {listings.length} active listing{listings.length !== 1 ? 's' : ''}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {listings.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
          </section>
        )}

        {/* Public ledger */}
        {ledgerEntries.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
            }}>
              <span style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'var(--muted)',
              }}>
                Public ledger
              </span>
              <span style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                padding: '2px 8px', borderRadius: 99,
                background: 'var(--rbg)', border: '1px solid var(--rbd)', color: 'var(--red)',
              }}>
                {ledgerEntries.length} entries
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ledgerEntries.map(entry => (
                <div key={entry.id} style={{
                  padding: '12px 14px',
                  background: 'var(--surf)', border: '1px solid var(--brd)',
                  borderRadius: 'var(--rl)',
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', marginBottom: 6,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                      padding: '2px 8px', borderRadius: 99,
                      background: 'var(--gbg)', border: '1px solid var(--gbd)', color: 'var(--grn)',
                    }}>
                      ✓ Confirmed
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)',
                    }}>
                      {formatRelativeTime(entry.created_at)}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--muted)' }}>{entry.summary}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Demo ledger for demo profiles */}
        {isDemo && (
          <section style={{ marginBottom: 24 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
            }}>
              <span style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'var(--muted)',
              }}>
                Public ledger
              </span>
              <span style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                padding: '2px 8px', borderRadius: 99,
                background: 'var(--rbg)', border: '1px solid var(--rbd)', color: 'var(--red)',
              }}>
                {profile.trade_count ?? 0} entries
              </span>
            </div>
            <div style={{
              padding: '16px',
              background: 'var(--surf)', border: '1px solid var(--brd)',
              borderRadius: 'var(--rl)',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: 13, color: 'var(--faint)', fontFamily: 'var(--font-dm-mono)' }}>
                Sign up to view the full public trade ledger
              </p>
              <Link href="/signup" style={{
                display: 'inline-flex', marginTop: 12,
                padding: '9px 20px', borderRadius: 99,
                background: 'var(--red)', color: 'white',
                fontSize: 13, fontWeight: 500, textDecoration: 'none',
                border: '1px solid #A8251F',
              }}>
                Create free account →
              </Link>
            </div>
          </section>
        )}

        {listings.length === 0 && ledgerEntries.length === 0 && !isDemo && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>◻</div>
            <p style={{ fontSize: 14 }}>No listings or trades yet.</p>
          </div>
        )}
      </main>
    </>
  )
}
