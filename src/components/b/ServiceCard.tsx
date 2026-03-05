import Link from 'next/link'
import { Avatar } from '@/components/ui/Avatar'
import { TierBadge } from '@/components/ui/TierBadge'
import type { ServiceListing } from '@/types/bartr-b'

interface ServiceCardProps {
  listing: ServiceListing
}

export function ServiceCard({ listing }: ServiceCardProps) {
  return (
    <Link
      href={`/b/listings/${listing.id}`}
      className="block rounded-md border overflow-hidden transition-colors"
      style={{
        background: 'rgba(45,106,79,0.06)',
        borderColor: 'rgba(45,106,79,0.18)',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(45,106,79,0.40)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(45,106,79,0.18)')}
    >
      {/* Category header */}
      <div
        className="px-3 py-2 border-b"
        style={{
          background: 'rgba(45,106,79,0.10)',
          borderColor: 'rgba(45,106,79,0.15)',
        }}
      >
        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: '#52B788' }}>
          {listing.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-3">
        <h3 className="text-sm font-semibold line-clamp-2 leading-snug mb-2">
          {listing.title}
        </h3>

        {/* Skills */}
        {listing.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {listing.skills.slice(0, 3).map(skill => (
              <span
                key={skill}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                style={{
                  background: 'rgba(45,106,79,0.15)',
                  color: '#52B788',
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Rate */}
        <div
          className="font-mono text-sm font-medium mb-2.5"
          style={{ color: '#52B788' }}
        >
          {listing.credit_rate}c {listing.credit_unit}
        </div>

        {/* Who */}
        {listing.profile && (
          <div
            className="flex items-center gap-2 pt-2 border-t"
            style={{ borderColor: 'rgba(45,106,79,0.15)' }}
          >
            <Avatar
              src={listing.profile.avatar_url}
              alt={listing.profile.display_name ?? listing.profile.handle}
              size="sm"
            />
            <span className="text-xs text-muted truncate flex-1">
              {listing.profile.handle}
            </span>
            <TierBadge tier={listing.profile.tier} className="flex-shrink-0" />
          </div>
        )}
      </div>
    </Link>
  )
}
