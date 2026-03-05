import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { Chip } from '@/components/ui/Chip'
import { Avatar } from '@/components/ui/Avatar'
import { TierBadge } from '@/components/ui/TierBadge'
import { formatValueRange, conditionLabel, formatRelativeTime } from '@/lib/utils'
import type { Listing } from '@/types'

interface Props {
  params: { id: string }
}

async function getListing(id: string): Promise<Listing | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select(`
      *,
      profile:profiles(
        id, handle, display_name, avatar_url, bio, tier,
        verified_id, verified_phone, verified_photo,
        follower_count, trade_count
      )
    `)
    .eq('id', id)
    .single()

  return (data ?? null) as Listing | null
}

export default async function ListingPage({ params }: Props) {
  const listing = await getListing(params.id)
  if (!listing) notFound()

  const value = formatValueRange(listing.value_estimate_low, listing.value_estimate_high)
  const images = listing.images ?? []

  return (
    <>
      <TopBar title={listing.category} />

      <main className="max-w-2xl mx-auto px-4 py-4 pb-24">
        {/* Image gallery */}
        <div className="relative aspect-[4/3] bg-surface rounded-md overflow-hidden mb-4">
          {images[0] ? (
            <Image
              src={images[0]}
              alt={listing.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 672px) 100vw, 672px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-2 text-6xl">◻</span>
            </div>
          )}

          {/* Condition badge */}
          <div className="absolute bottom-3 left-3">
            <Chip>{conditionLabel(listing.condition)}</Chip>
          </div>
        </div>

        {/* Additional images */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2 mb-4">
            {images.slice(1, 5).map((img, i) => (
              <div key={i} className="aspect-square rounded bg-surface-2 overflow-hidden relative">
                <Image src={img} alt="" fill className="object-cover" sizes="80px" />
              </div>
            ))}
          </div>
        )}

        {/* Title + value */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h1 className="text-xl font-semibold leading-snug">{listing.title}</h1>
            <div className="text-red-light font-mono text-lg font-medium flex-shrink-0">{value}</div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Chip>{listing.category}</Chip>
            <Chip>{conditionLabel(listing.condition)}</Chip>
            {listing.location && <Chip>{listing.location}</Chip>}
          </div>
        </div>

        {/* Description */}
        {listing.description && (
          <div className="mb-4">
            <p className="text-muted text-sm leading-relaxed">{listing.description}</p>
          </div>
        )}

        <div className="divider" />

        {/* Wants */}
        {listing.wants && (
          <div className="mb-4">
            <div className="label">Looking for</div>
            <p className="text-sm">{listing.wants}</p>
          </div>
        )}

        {/* Seller */}
        {listing.profile && (
          <div className="card p-4 mb-4">
            <Link
              href={`/profile/${listing.profile.handle}`}
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
                  <span className="text-xs text-muted">{listing.profile.trade_count} trades</span>
                  {listing.profile.verified_id && (
                    <span className="text-xs text-green-light">✓ ID verified</span>
                  )}
                </div>
              </div>
              <span className="text-muted-2">→</span>
            </Link>
          </div>
        )}

        <div className="label mb-1 text-xs text-muted-2">
          Listed {formatRelativeTime(listing.created_at)}
        </div>

        <div className="divider" />

        {/* Trust note */}
        <div className="text-xs text-muted-2 mb-6">
          Trades are recorded on the public ledger. A 10% deposit (returned on completion) keeps both sides accountable.
        </div>

        {/* CTA — sticky at bottom */}
        <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 bg-gradient-to-t from-bg via-bg/90 to-transparent pointer-events-none">
          <div className="max-w-2xl mx-auto flex gap-3 pointer-events-auto">
            <Link
              href={`/messages?listing=${listing.id}`}
              className="btn w-full"
            >
              Message
            </Link>
            <Link
              href={`/offer/${listing.id}`}
              className="btn btn-primary w-full text-base"
            >
              Make offer
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
