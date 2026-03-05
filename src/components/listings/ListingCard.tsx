'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Chip } from '@/components/ui/Chip'
import { Avatar } from '@/components/ui/Avatar'
import { TierBadge } from '@/components/ui/TierBadge'
import { formatValueRange, conditionLabel, formatRelativeTime } from '@/lib/utils'
import type { Listing } from '@/types'

interface ListingCardProps {
  listing: Listing
  matchScore?: number
}

export function ListingCard({ listing, matchScore }: ListingCardProps) {
  const value = formatValueRange(listing.value_estimate_low, listing.value_estimate_high)
  const image = listing.images?.[0]

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="card block overflow-hidden hover:border-stroke-2 transition-colors group"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-surface-2 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted-2 text-4xl">◻</span>
          </div>
        )}

        {/* Match score */}
        {matchScore !== undefined && (
          <div className="absolute top-2 right-2">
            <span className="chip-red text-[10px] px-2 py-0.5">
              {matchScore}% match
            </span>
          </div>
        )}

        {/* Condition */}
        <div className="absolute bottom-2 left-2">
          <Chip className="text-[10px] px-2 py-0.5">
            {conditionLabel(listing.condition)}
          </Chip>
        </div>
      </div>

      {/* Body */}
      <div className="p-3">
        {/* Category + location */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[10px] font-mono text-muted-2 uppercase tracking-wide">
            {listing.category}
          </span>
          {listing.location && (
            <>
              <span className="text-muted-2">·</span>
              <span className="text-[10px] font-mono text-muted-2">{listing.location}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold line-clamp-2 leading-snug mb-2">
          {listing.title}
        </h3>

        {/* Value */}
        <div className="text-red-light font-mono text-sm font-medium mb-2.5">
          {value}
        </div>

        {/* Who */}
        {listing.profile && (
          <div className="flex items-center gap-2 pt-2 border-t border-stroke">
            <Avatar
              src={listing.profile.avatar_url}
              alt={listing.profile.display_name ?? listing.profile.handle}
              size="sm"
            />
            <div className="min-w-0">
              <span className="text-xs text-muted truncate block">
                {listing.profile.handle}
              </span>
            </div>
            <TierBadge tier={listing.profile.tier} className="ml-auto flex-shrink-0" />
          </div>
        )}

        {/* Wants */}
        {listing.wants && (
          <p className="text-xs text-muted-2 mt-2 line-clamp-1">
            Wants: {listing.wants}
          </p>
        )}
      </div>
    </Link>
  )
}
