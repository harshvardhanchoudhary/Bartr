import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BTopBar } from '@/components/b/BTopBar'
import { Avatar } from '@/components/ui/Avatar'
import { TierBadge } from '@/components/ui/TierBadge'
import { ServiceCard } from '@/components/b/ServiceCard'
import { formatRelativeTime } from '@/lib/utils'
import type { ServiceListing, CreditTransaction } from '@/types/bartr-b'
import type { Profile } from '@/types'

interface Props {
  params: { handle: string }
}

export default async function BProfilePage({ params }: Props) {
  const supabase = await createClient()
  const handle = decodeURIComponent(params.handle)

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('handle', handle.startsWith('@') ? handle : `@${handle}`)
    .single()

  if (!profile) notFound()

  const [{ data: services }, { data: creditHistory }, { data: creditBalance }] = await Promise.all([
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

  return (
    <>
      <BTopBar />

      <main className="max-w-2xl mx-auto px-4 py-4 pb-20 w-full">
        {/* Profile header */}
        <div
          className="rounded-md border p-5 mb-4"
          style={{ background: 'rgba(45,106,79,0.06)', borderColor: 'rgba(45,106,79,0.20)' }}
        >
          <div className="flex items-start gap-4">
            <Avatar
              src={(profile as Profile).avatar_url}
              alt={(profile as Profile).display_name ?? (profile as Profile).handle}
              size="lg"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h1 className="font-semibold text-lg">
                  {(profile as Profile).display_name ?? (profile as Profile).handle}
                </h1>
                <TierBadge tier={(profile as Profile).tier} />
              </div>
              <div className="text-muted text-sm font-mono mb-2">{(profile as Profile).handle}</div>

              {(profile as Profile).bio && (
                <p className="text-sm text-muted leading-relaxed mb-3">{(profile as Profile).bio}</p>
              )}

              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-base font-semibold">{(profile as Profile).trade_count}</div>
                  <div className="text-xs text-muted-2 font-mono">jobs done</div>
                </div>
                {creditBalance && (
                  <>
                    <div className="text-center">
                      <div className="text-base font-semibold" style={{ color: '#52B788' }}>
                        {(creditBalance as { balance: number }).balance}c
                      </div>
                      <div className="text-xs text-muted-2 font-mono">credits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base font-semibold">
                        {(creditBalance as { lifetime_earned: number }).lifetime_earned}c
                      </div>
                      <div className="text-xs text-muted-2 font-mono">earned</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {(profile as Profile).verified_id && (
            <div
              className="inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full text-xs font-mono border"
              style={{
                background: 'rgba(45,106,79,0.12)',
                borderColor: 'rgba(45,106,79,0.30)',
                color: '#52B788',
              }}
            >
              ✓ ID verified
            </div>
          )}
        </div>

        {/* Services */}
        {services && services.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-mono text-muted mb-3 uppercase tracking-wide">
              {services.length} service{services.length !== 1 ? 's' : ''}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {(services as ServiceListing[]).map(s => (
                <ServiceCard key={s.id} listing={s} />
              ))}
            </div>
          </section>
        )}

        {/* Credit activity */}
        {creditHistory && creditHistory.length > 0 && (
          <section>
            <h2 className="text-sm font-mono text-muted mb-3 uppercase tracking-wide flex items-center gap-2">
              Credit activity
            </h2>
            <div className="space-y-2">
              {(creditHistory as CreditTransaction[]).map(tx => (
                <div
                  key={tx.id}
                  className="rounded border p-3 flex items-center justify-between"
                  style={{
                    background: 'rgba(45,106,79,0.04)',
                    borderColor: 'rgba(45,106,79,0.12)',
                  }}
                >
                  <div>
                    <div className="text-xs font-mono text-muted-2 mb-0.5 uppercase">{tx.type}</div>
                    {tx.note && <div className="text-xs text-muted">{tx.note}</div>}
                    <div className="text-xs text-muted-2 font-mono mt-1">
                      {formatRelativeTime(tx.created_at)}
                    </div>
                  </div>
                  <div
                    className="font-mono text-sm font-medium"
                    style={{ color: tx.amount > 0 ? '#52B788' : 'rgba(255,255,255,0.62)' }}
                  >
                    {tx.amount > 0 ? '+' : ''}{tx.amount}c
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {(!services || services.length === 0) && (!creditHistory || creditHistory.length === 0) && (
          <div className="text-center py-12 text-muted">
            <div className="text-4xl mb-4" style={{ color: 'rgba(45,106,79,0.4)' }}>◎</div>
            <p className="text-sm">No services or activity yet.</p>
          </div>
        )}
      </main>
    </>
  )
}
