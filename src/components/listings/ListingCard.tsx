'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Avatar } from '@/components/ui/Avatar'
import { formatValueRange, conditionLabel } from '@/lib/utils'
import type { Listing } from '@/types'

interface ListingCardProps {
  listing: Listing
  matchScore?: number
}

export function ListingCard({ listing, matchScore }: ListingCardProps) {
  const value = formatValueRange(listing.value_estimate_low, listing.value_estimate_high)
  const image = listing.images?.[0]

  return (
    <Link href={`/listings/${listing.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background: 'var(--surf)', border: '1px solid var(--brd)',
        borderRadius: 'var(--rl)', overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(26,24,20,0.06)',
      }}>
        {/* Image */}
        <div style={{
          position: 'relative', aspectRatio: '4/3',
          background: 'var(--bg2)', overflow: 'hidden',
        }}>
          {image ? (
            <Image
              src={image}
              alt={listing.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 640px) 50vw, 33vw"
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, color: 'var(--faint)',
            }}>
              ◻
            </div>
          )}

          {matchScore !== undefined && (
            <div style={{ position: 'absolute', top: 8, right: 8 }}>
              <span style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                padding: '3px 7px', borderRadius: 99,
                background: 'var(--rbg)', border: '1px solid var(--rbd)', color: 'var(--red)',
              }}>
                {matchScore}% match
              </span>
            </div>
          )}

          <div style={{ position: 'absolute', bottom: 8, left: 8 }}>
            <span style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 9,
              padding: '3px 7px', borderRadius: 99,
              background: 'rgba(253,252,250,0.92)', border: '1px solid var(--brd)', color: 'var(--ink2)',
            }}>
              {conditionLabel(listing.condition)}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '10px 12px 12px' }}>
          <div style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 9,
            textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--faint)', marginBottom: 4,
          }}>
            {listing.category}{listing.location ? ` · ${listing.location}` : ''}
          </div>

          <h3 style={{
            fontSize: 13, fontWeight: 500, color: 'var(--ink)',
            lineHeight: 1.3, marginBottom: 6,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {listing.title}
          </h3>

          <div style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 13,
            fontWeight: 500, color: 'var(--red)', marginBottom: listing.wants ? 8 : 0,
          }}>
            {value}
          </div>

          {listing.wants && (
            <div style={{
              fontSize: 10, color: 'var(--muted)',
              background: 'var(--bg)', borderRadius: 'var(--r)',
              padding: '4px 6px', marginBottom: 8,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              <span style={{ color: 'var(--faint)', fontFamily: 'var(--font-dm-mono)' }}>wants </span>
              {listing.wants}
            </div>
          )}

          {listing.profile && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              paddingTop: 8, borderTop: '1px solid var(--brd)',
            }}>
              <Avatar
                src={listing.profile.avatar_url}
                alt={listing.profile.display_name ?? listing.profile.handle}
                size="sm"
              />
              <span style={{ fontSize: 11, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {listing.profile.handle}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
