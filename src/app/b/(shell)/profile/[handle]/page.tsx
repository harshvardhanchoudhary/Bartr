import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BTopBar } from '@/components/b/BTopBar'
import { Avatar } from '@/components/ui/Avatar'
import { TierBadge } from '@/components/ui/TierBadge'
import { ServiceCard } from '@/components/b/ServiceCard'
import { formatRelativeTime } from '@/lib/utils'
import { DEMO_SERVICES } from '@/lib/demo-data'
import { CreditWalletCard } from '@/components/b/CreditWalletCard'
import type { ServiceListing, CreditTransaction } from '@/types/bartr-b'
import type { Profile } from '@/types'

interface Props {
  params: { handle: string }
}

// Build demo provider profiles from DEMO_SERVICES
const DEMO_PROVIDERS: Record<string, { profile: Profile; services: ServiceListing[] }> = {}
for (const svc of DEMO_SERVICES) {
  if (svc.profile) {
    const h = svc.profile.handle
    if (!DEMO_PROVIDERS[h]) {
      DEMO_PROVIDERS[h] = { profile: svc.profile as unknown as Profile, services: [] }
    }
    DEMO_PROVIDERS[h].services.push(svc)
  }
}

export default async function BProfilePage({ params }: Props) {
  const handle = decodeURIComponent(params.handle).replace(/^@/, '')

  // Check demo providers first
  const demoEntry = DEMO_PROVIDERS[handle]

  let profile: Profile | null = null
  let services: ServiceListing[] = []
  let creditHistory: CreditTransaction[] = []
  let creditBalance: { balance: number; lifetime_earned: number } | null = null
  let isDemo = false

  if (demoEntry) {
    profile = demoEntry.profile
    services = demoEntry.services
    isDemo = true
    // Show a sample credit balance on demo profiles so the wallet card is visible
    creditBalance = { balance: 340, lifetime_earned: 820 }
  } else {
    const supabase = await createClient()
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('handle', handle)
      .single()

    if (!profileData) notFound()
    profile = profileData as Profile

    const [{ data: svcData }, { data: txData }, { data: balData }] = await Promise.all([
      supabase
        .from('service_listings')
        .select('*, profile:profiles(id, handle, display_name, avatar_url, tier, trade_count)')
        .eq('user_id', profile.id)
        .eq('is_available', true)
        .order('created_at', { ascending: false }),
      supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('credit_balances')
        .select('*')
        .eq('user_id', profile.id)
        .single(),
    ])
    services = (svcData ?? []) as ServiceListing[]
    creditHistory = (txData ?? []) as CreditTransaction[]
    creditBalance = balData as { balance: number; lifetime_earned: number } | null
  }

  if (!profile) notFound()

  return (
    <>
      <BTopBar back />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '16px 16px 80px', width: '100%' }}>

        {/* Demo banner */}
        {isDemo && (
          <div style={{
            padding: '10px 16px', marginBottom: 16,
            background: 'var(--gbg)', border: '1px solid var(--gbd)',
            borderRadius: 'var(--rl)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--grn)' }}>
              Sample profile — sign up to connect with real providers
            </span>
            <Link href="/signup" style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--grn)',
              padding: '3px 10px', border: '1px solid var(--gbd)',
              borderRadius: 99, background: 'var(--gbg)', textDecoration: 'none',
            }}>
              Join free →
            </Link>
          </div>
        )}

        {/* Profile header */}
        <div style={{
          borderRadius: 'var(--rl)', border: '1px solid var(--gbd)',
          background: 'var(--gbg)', padding: '20px', marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <Avatar
              src={profile.avatar_url}
              alt={profile.display_name ?? profile.handle}
              size="lg"
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 2 }}>
                <h1 style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 22, color: 'var(--ink)' }}>
                  {profile.display_name ?? profile.handle}
                </h1>
                <TierBadge tier={profile.tier} />
              </div>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>
                {profile.handle}
              </div>

              {profile.bio && (
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>
                  {profile.bio}
                </p>
              )}

              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>{profile.trade_count}</div>
                  <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--muted)' }}>jobs done</div>
                </div>
                {creditBalance && (
                  <>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--grn)' }}>{creditBalance.balance}c</div>
                      <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--muted)' }}>credits</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>{creditBalance.lifetime_earned}c</div>
                      <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--muted)' }}>earned</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {profile.verified_id && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12,
              padding: '4px 12px', borderRadius: 99,
              fontFamily: 'var(--font-dm-mono)', fontSize: 11,
              background: 'rgba(26,122,74,0.10)', border: '1px solid var(--gbd)', color: 'var(--grn)',
            }}>
              ✓ ID verified
            </div>
          )}
        </div>

        {/* Credit wallet card — shown on demo and real users */}
        {creditBalance && (
          <CreditWalletCard
            balance={creditBalance.balance}
            lifetimeEarned={creditBalance.lifetime_earned}
            handle={profile.handle}
            tier={profile.tier}
          />
        )}

        {/* Services */}
        {services.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
              {services.length} service{services.length !== 1 ? 's' : ''}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {services.map(s => (
                <ServiceCard key={s.id} listing={s} />
              ))}
            </div>
          </section>
        )}

        {/* Credit activity (real users only) */}
        {!isDemo && creditHistory.length > 0 && (
          <section>
            <h2 style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
              Credit activity
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {creditHistory.map(tx => (
                <div key={tx.id} style={{
                  borderRadius: 'var(--r)', border: '1px solid var(--gbd)',
                  padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'rgba(26,122,74,0.04)',
                }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 2 }}>{tx.type}</div>
                    {tx.note && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{tx.note}</div>}
                    <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)', marginTop: 4 }}>
                      {formatRelativeTime(tx.created_at)}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 14, fontWeight: 500, color: tx.amount > 0 ? 'var(--grn)' : 'var(--muted)' }}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount}c
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {services.length === 0 && creditHistory.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 16, color: 'var(--grn)', opacity: 0.4 }}>◎</div>
            <p style={{ fontSize: 14 }}>No services or activity yet.</p>
          </div>
        )}
      </main>
    </>
  )
}
