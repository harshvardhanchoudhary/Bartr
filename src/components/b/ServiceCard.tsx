'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Avatar } from '@/components/ui/Avatar'
import type { ServiceListing } from '@/types/bartr-b'

interface ServiceCardProps {
  listing: ServiceListing
  index?: number
}

const CATEGORY_EMOJI: Record<string, string> = {
  Design: '🎨',
  Development: '💻',
  Writing: '✍️',
  Marketing: '📣',
  Video: '🎬',
  Music: '🎧',
  Photography: '📷',
  Consulting: '💡',
  Other: '◎',
}

export function ServiceCard({ listing, index = 0 }: ServiceCardProps) {
  const emoji = CATEGORY_EMOJI[listing.category] ?? '◎'

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/b/listings/${listing.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <motion.div
          whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(5,150,105,0.14)' }}
          transition={{ duration: 0.15 }}
          style={{
            background: 'var(--surf)', border: '1px solid var(--brd)',
            borderRadius: 'var(--rl)', overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(26,24,20,0.06)',
            cursor: 'pointer',
          }}
        >
          {/* Visual area */}
          <div style={{
            height: 90,
            background: 'linear-gradient(135deg, var(--gbg) 0%, #e8f5ed 100%)',
            borderBottom: '1px solid var(--gbd)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 14px',
          }}>
            <span style={{ fontSize: 36 }}>{emoji}</span>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 16, fontWeight: 500,
                color: 'var(--grn)',
              }}>
                {listing.credit_rate}c
              </div>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                color: 'var(--muted)', letterSpacing: '0.04em',
              }}>
                {listing.credit_unit}
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '10px 12px 12px' }}>
            <div style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 9,
              textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--grn)',
              marginBottom: 5,
            }}>
              {listing.category}
            </div>

            <h3 style={{
              fontSize: 13, fontWeight: 500, color: 'var(--ink)',
              lineHeight: 1.3, marginBottom: 8,
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {listing.title}
            </h3>

            {/* Skills tags */}
            {listing.skills?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                {listing.skills.slice(0, 3).map((skill: string) => (
                  <span key={skill} style={{
                    fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                    padding: '2px 7px', borderRadius: 99,
                    background: 'var(--gbg)', border: '1px solid var(--gbd)', color: 'var(--grn)',
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Who + delivery */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              paddingTop: 8, borderTop: '1px solid var(--brd)',
            }}>
              {listing.profile ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Avatar
                    src={listing.profile.avatar_url}
                    alt={listing.profile.display_name ?? listing.profile.handle}
                    size="sm"
                  />
                  <span style={{ fontSize: 11, color: 'var(--muted)', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {listing.profile.handle}
                  </span>
                </div>
              ) : <span />}
              {listing.delivery_time_days && (
                <span style={{
                  fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                  color: 'var(--faint)', letterSpacing: '0.04em',
                }}>
                  {listing.delivery_time_days}d
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
