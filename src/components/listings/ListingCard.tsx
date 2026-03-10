'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Avatar } from '@/components/ui/Avatar'
import { formatValueRange, conditionLabel, formatRelativeTime } from '@/lib/utils'
import type { Listing } from '@/types'

interface ListingCardProps {
  listing: Listing
  matchScore?: number
  index?: number
}

const CONDITION_COLOR: Record<string, string> = {
  new:      '#16a34a',
  like_new: '#16a34a',
  good:     '#d97706',
  fair:     '#dc2626',
  poor:     '#9ca3af',
}

export function ListingCard({ listing, matchScore, index = 0 }: ListingCardProps) {
  const value = formatValueRange(listing.value_estimate_low, listing.value_estimate_high)
  const image = listing.images?.[0]
  const wantsArr = listing.wants
    ? listing.wants.split(',').map(w => w.trim()).filter(Boolean)
    : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: index * 0.045, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/listings/${listing.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <motion.div
          whileHover={{ y: -4, boxShadow: '0 12px 36px rgba(26,24,20,0.14)' }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{
            background: 'var(--surf)',
            border: '1px solid var(--brd)',
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(26,24,20,0.07)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Image */}
          <div style={{
            position: 'relative',
            aspectRatio: '4/3',
            background: 'linear-gradient(135deg, var(--bg2) 0%, var(--brd) 100%)',
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            {image ? (
              <Image
                src={image}
                alt={listing.title}
                fill
                style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--bg2), var(--brd))',
              }}>
                <span style={{ fontSize: 36, opacity: 0.3 }}>◻</span>
              </div>
            )}

            {/* Value badge — top left */}
            {value && (
              <div style={{
                position: 'absolute', top: 8, left: 8,
                fontFamily: 'var(--font-dm-mono)', fontSize: 12, fontWeight: 600,
                padding: '3px 9px', borderRadius: 99,
                background: 'rgba(26,24,20,0.75)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
                letterSpacing: '0.02em',
              }}>
                {value}
              </div>
            )}

            {/* Match score — top right */}
            {matchScore !== undefined && (
              <div style={{
                position: 'absolute', top: 8, right: 8,
                fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                padding: '3px 8px', borderRadius: 99,
                background: 'var(--rbg)', border: '1px solid var(--rbd)', color: 'var(--red)',
              }}>
                {matchScore}% match
              </div>
            )}

            {/* Condition dot — bottom left */}
            <div style={{
              position: 'absolute', bottom: 8, left: 8,
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '3px 8px', borderRadius: 99,
              background: 'rgba(253,252,250,0.90)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(26,24,20,0.10)',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                background: CONDITION_COLOR[listing.condition] ?? 'var(--faint)',
              }} />
              <span style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                color: 'var(--ink2)', letterSpacing: '0.04em',
              }}>
                {conditionLabel(listing.condition)}
              </span>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '11px 12px 12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            {/* Category + location */}
            <div style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 9,
              textTransform: 'uppercase', letterSpacing: '0.09em',
              color: 'var(--faint)', marginBottom: 5,
            }}>
              {listing.category}{listing.location ? ` · ${listing.location}` : ''}
            </div>

            {/* Title */}
            <h3 style={{
              fontFamily: 'var(--font-instrument-serif)',
              fontSize: 15, fontWeight: 400, color: 'var(--ink)',
              lineHeight: 1.25, marginBottom: 8, flex: 1,
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {listing.title}
            </h3>

            {/* Wants chips */}
            {wantsArr.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 9 }}>
                <span style={{
                  fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                  color: 'var(--faint)', paddingTop: 3,
                }}>wants</span>
                {wantsArr.slice(0, 2).map(w => (
                  <span key={w} style={{
                    fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                    padding: '2px 7px', borderRadius: 99,
                    background: 'var(--gbg)', border: '1px solid var(--gbd)',
                    color: 'var(--grn)',
                    maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {w}
                  </span>
                ))}
                {wantsArr.length > 2 && (
                  <span style={{
                    fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                    color: 'var(--faint)',
                  }}>
                    +{wantsArr.length - 2}
                  </span>
                )}
              </div>
            )}

            {/* Footer */}
            {listing.profile && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: 8, borderTop: '1px solid var(--brd)',
                marginTop: 'auto',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Avatar
                    src={listing.profile.avatar_url}
                    alt={listing.profile.display_name ?? listing.profile.handle}
                    size="sm"
                  />
                  <span style={{
                    fontSize: 10, color: 'var(--muted)',
                    fontFamily: 'var(--font-dm-mono)',
                    maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {listing.profile.handle}
                  </span>
                </div>
                <span style={{
                  fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                  color: 'var(--faint)',
                }}>
                  {formatRelativeTime(listing.created_at)}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
