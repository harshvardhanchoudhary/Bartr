import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { Avatar } from '@/components/ui/Avatar'
import { TierBadge } from '@/components/ui/TierBadge'
import { Chip } from '@/components/ui/Chip'
import { ListingCard } from '@/components/listings/ListingCard'
import { formatRelativeTime } from '@/lib/utils'
import type { Profile, Listing, LedgerEntry } from '@/types'

interface Props {
  params: { handle: string }
}

export default async function ProfilePage({ params }: Props) {
  const supabase = await createClient()
  const handle = decodeURIComponent(params.handle)

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('handle', handle.startsWith('@') ? handle : `@${handle}`)
    .single()

  if (!profile) notFound()

  const [{ data: listings }, { data: ledger }] = await Promise.all([
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

  const verificationCount = [profile.verified_id, profile.verified_phone, profile.verified_photo].filter(Boolean).length

  return (
    <>
      <TopBar />

      <main className="max-w-2xl mx-auto px-4 py-4 pb-20 w-full">
        {/* Profile header */}
        <div className="card p-5 mb-4">
          <div className="flex items-start gap-4">
            <Avatar
              src={profile.avatar_url}
              alt={profile.display_name ?? profile.handle}
              size="lg"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h1 className="font-semibold text-lg">
                  {profile.display_name ?? profile.handle}
                </h1>
                <TierBadge tier={profile.tier} />
              </div>
              <div className="text-muted text-sm font-mono mb-2">{profile.handle}</div>

              {profile.bio && (
                <p className="text-sm text-muted leading-relaxed mb-3">{profile.bio}</p>
              )}

              {/* Stats */}
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-base font-semibold">{profile.trade_count}</div>
                  <div className="text-xs text-muted-2 font-mono">trades</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-semibold">{profile.follower_count}</div>
                  <div className="text-xs text-muted-2 font-mono">followers</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-semibold">{verificationCount}/3</div>
                  <div className="text-xs text-muted-2 font-mono">verified</div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification badges */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-stroke">
            {profile.verified_id && <Chip variant="green">✓ ID</Chip>}
            {profile.verified_phone && <Chip variant="green">✓ Phone</Chip>}
            {profile.verified_photo && <Chip variant="green">✓ Photo</Chip>}
            {!profile.verified_id && <Chip className="opacity-40">ID</Chip>}
            {!profile.verified_phone && <Chip className="opacity-40">Phone</Chip>}
            {!profile.verified_photo && <Chip className="opacity-40">Photo</Chip>}
          </div>

          {profile.location && (
            <div className="text-xs text-muted-2 mt-2 font-mono">{profile.location}</div>
          )}
        </div>

        {/* Active listings */}
        {listings && listings.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-semibold text-muted mb-3 font-mono uppercase tracking-wide">
              {listings.length} active listing{listings.length !== 1 ? 's' : ''}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {(listings as Listing[]).map(l => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </section>
        )}

        {/* Public ledger */}
        {ledger && ledger.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted mb-3 font-mono uppercase tracking-wide flex items-center gap-2">
              <Chip variant="red">Public ledger</Chip>
              {ledger.length} entries
            </h2>
            <div className="space-y-2">
              {(ledger as LedgerEntry[]).map(entry => (
                <div key={entry.id} className="card p-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <Chip variant="green" className="text-[10px]">trade_completed</Chip>
                    <span className="text-xs text-muted-2 font-mono">
                      {formatRelativeTime(entry.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-muted">{entry.summary}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {(!listings || listings.length === 0) && (!ledger || ledger.length === 0) && (
          <div className="text-center py-12 text-muted">
            <div className="text-4xl mb-4">◻</div>
            <p className="text-sm">No listings or trades yet.</p>
          </div>
        )}
      </main>
    </>
  )
}
