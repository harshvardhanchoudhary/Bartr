import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BTopBar } from '@/components/b/BTopBar'
import { Avatar } from '@/components/ui/Avatar'
import { TierBadge } from '@/components/ui/TierBadge'
import { formatRelativeTime } from '@/lib/utils'
import type { ServiceListing } from '@/types/bartr-b'

interface Props {
  params: { id: string }
}

async function getListing(id: string): Promise<ServiceListing | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('service_listings')
    .select(`
      *,
      profile:profiles(
        id, handle, display_name, avatar_url, bio, tier,
        verified_id, trade_count, follower_count
      )
    `)
    .eq('id', id)
    .single()
  return (data ?? null) as ServiceListing | null
}

export default async function BListingPage({ params }: Props) {
  const listing = await getListing(params.id)
  if (!listing) notFound()

  return (
    <>
      <BTopBar title={listing.category} />

      <main className="max-w-2xl mx-auto px-4 py-4 pb-32 space-y-4">
        {/* Header */}
        <div
          className="rounded-md border p-4"
          style={{ background: 'rgba(45,106,79,0.06)', borderColor: 'rgba(45,106,79,0.20)' }}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <span
                className="font-mono text-[10px] uppercase tracking-widest mb-1 block"
                style={{ color: '#52B788' }}
              >
                {listing.category}
              </span>
              <h1 className="text-xl font-semibold leading-snug">{listing.title}</h1>
            </div>
            <div
              className="font-mono text-lg font-medium flex-shrink-0"
              style={{ color: '#52B788' }}
            >
              {listing.credit_rate}c
              <div className="text-xs text-muted-2 font-normal">{listing.credit_unit}</div>
            </div>
          </div>

          {/* Skills */}
          {listing.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {listing.skills.map(skill => (
                <span
                  key={skill}
                  className="text-xs font-mono px-2 py-1 rounded-full border"
                  style={{
                    background: 'rgba(45,106,79,0.12)',
                    borderColor: 'rgba(45,106,79,0.30)',
                    color: '#52B788',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="card p-4">
          <div className="label mb-2">About this service</div>
          <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">
            {listing.description}
          </p>
          {listing.delivery_time_days && (
            <p className="text-xs text-muted-2 mt-3 font-mono">
              Typical delivery: {listing.delivery_time_days} day{listing.delivery_time_days !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Portfolio */}
        {listing.portfolio_urls?.length > 0 && (
          <div className="card p-4">
            <div className="label mb-3">Portfolio</div>
            <div className="space-y-2">
              {listing.portfolio_urls.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted hover:text-text transition-colors"
                >
                  <span className="font-mono text-[10px] text-muted-2">{i + 1}</span>
                  <span className="truncate">{url}</span>
                  <span className="text-muted-2 flex-shrink-0">↗</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Provider */}
        {listing.profile && (
          <div className="card p-4">
            <div className="label mb-3">Provider</div>
            <Link
              href={`/b/profile/${listing.profile.handle}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Avatar
                src={listing.profile.avatar_url}
                alt={listing.profile.display_name ?? listing.profile.handle}
                size="lg"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-sm">
                    {listing.profile.display_name ?? listing.profile.handle}
                  </span>
                  <TierBadge tier={listing.profile.tier} />
                </div>
                <div className="text-xs text-muted font-mono">{listing.profile.handle}</div>
                <div className="flex gap-3 mt-1.5">
                  <span className="text-xs text-muted">{listing.profile.trade_count} jobs</span>
                  {listing.profile.verified_id && (
                    <span className="text-xs" style={{ color: '#52B788' }}>✓ ID verified</span>
                  )}
                </div>
              </div>
              <span className="text-muted-2">→</span>
            </Link>
          </div>
        )}

        <div className="text-xs text-muted-2 font-mono">
          Listed {formatRelativeTime(listing.created_at)}
        </div>
      </main>

      {/* CTA */}
      <div
        className="fixed bottom-20 left-0 right-0 px-4 pb-4"
        style={{ background: 'linear-gradient(to top, var(--bg) 60%, transparent)' }}
      >
        <div className="max-w-2xl mx-auto flex gap-3">
          <Link
            href={`/b/briefs/new?provider=${listing.user_id}&listing=${listing.id}`}
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-medium border"
            style={{
              background: 'linear-gradient(180deg, rgba(45,106,79,0.92), rgba(45,106,79,0.70))',
              borderColor: 'rgba(45,106,79,0.55)',
              color: 'white',
            }}
          >
            Post a brief for this skill
          </Link>
        </div>
      </div>
    </>
  )
}
