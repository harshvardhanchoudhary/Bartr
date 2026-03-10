'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Avatar } from '@/components/ui/Avatar'
import type { ServiceListing } from '@/types/bartr-b'

interface ServiceCardProps {
  listing: ServiceListing
  index?: number
}

const CATEGORY_STYLE: Record<string, { gradient: string; glow: string; emoji: string }> = {
  Design:      { gradient: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)', glow: 'rgba(124,58,237,0.25)',  emoji: '🎨' },
  Development: { gradient: 'linear-gradient(135deg, #1D4ED8 0%, #0891B2 100%)', glow: 'rgba(29,78,216,0.25)',   emoji: '💻' },
  Writing:     { gradient: 'linear-gradient(135deg, #B45309 0%, #F59E0B 100%)', glow: 'rgba(180,83,9,0.25)',    emoji: '✍️' },
  Marketing:   { gradient: 'linear-gradient(135deg, #B91C1C 0%, #F97316 100%)', glow: 'rgba(185,28,28,0.25)',   emoji: '📣' },
  Video:       { gradient: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%)', glow: 'rgba(76,29,149,0.25)',   emoji: '🎬' },
  Music:       { gradient: 'linear-gradient(135deg, #1E40AF 0%, #4C1D95 100%)', glow: 'rgba(30,64,175,0.25)',   emoji: '🎧' },
  Photography: { gradient: 'linear-gradient(135deg, #1F2937 0%, #4B5563 100%)', glow: 'rgba(31,41,55,0.25)',    emoji: '📷' },
  Consulting:  { gradient: 'linear-gradient(135deg, #065F46 0%, #0891B2 100%)', glow: 'rgba(6,95,70,0.25)',     emoji: '💡' },
  Legal:       { gradient: 'linear-gradient(135deg, #1E3A5F 0%, #1D4ED8 100%)', glow: 'rgba(30,58,95,0.25)',    emoji: '⚖️' },
  Finance:     { gradient: 'linear-gradient(135deg, #065F46 0%, #16A34A 100%)', glow: 'rgba(6,95,70,0.25)',     emoji: '💹' },
  Education:   { gradient: 'linear-gradient(135deg, #92400E 0%, #D97706 100%)', glow: 'rgba(146,64,14,0.25)',   emoji: '🎓' },
  Other:       { gradient: 'linear-gradient(135deg, #065F46 0%, #059669 100%)', glow: 'rgba(5,150,105,0.25)',   emoji: '◎'  },
}

export function ServiceCard({ listing, index = 0 }: ServiceCardProps) {
  const style = CATEGORY_STYLE[listing.category] ?? CATEGORY_STYLE.Other

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/b/listings/${listing.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <motion.div
          whileHover={{ y: -4, boxShadow: `0 16px 40px ${style.glow}` }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{
            borderRadius: 14,
            overflow: 'hidden',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            cursor: 'pointer',
            background: 'var(--surf)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Gradient header */}
          <div style={{
            height: 100,
            background: style.gradient,
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }} />
            <div style={{
              position: 'absolute', right: -18, top: -18,
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(255,255,255,0.10)',
            }} />
            <div style={{
              position: 'absolute', top: 10, left: 12,
              fontFamily: 'var(--font-dm-mono)', fontSize: 8,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)',
            }}>
              {listing.category}
            </div>
            <div style={{
              position: 'absolute', bottom: 10, left: 12,
              fontSize: 26, lineHeight: 1,
            }}>
              {style.emoji}
            </div>
            <div style={{ position: 'absolute', bottom: 8, right: 10, textAlign: 'right' }}>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 22,
                fontWeight: 700, color: '#fff',
                lineHeight: 1, textShadow: '0 1px 8px rgba(0,0,0,0.2)',
              }}>
                {listing.credit_rate}c
              </div>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 8,
                color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em',
              }}>
                / {listing.credit_unit}
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '10px 12px 12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{
              fontFamily: 'var(--font-instrument-serif)',
              fontSize: 14, fontWeight: 400, color: 'var(--ink)',
              lineHeight: 1.3, marginBottom: 8, flex: 1,
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {listing.title}
            </h3>

            {listing.skills?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 9 }}>
                {listing.skills.slice(0, 3).map((skill: string) => (
                  <span key={skill} style={{
                    fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                    padding: '2px 7px', borderRadius: 99,
                    background: 'var(--bg2)', border: '1px solid var(--brd)',
                    color: 'var(--muted)',
                  }}>
                    {skill}
                  </span>
                ))}
                {(listing.skills?.length ?? 0) > 3 && (
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: 'var(--faint)' }}>
                    +{listing.skills.length - 3}
                  </span>
                )}
              </div>
            )}

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              paddingTop: 8, borderTop: '1px solid var(--brd)', marginTop: 'auto',
            }}>
              {listing.profile ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Avatar
                    src={listing.profile.avatar_url}
                    alt={listing.profile.display_name ?? listing.profile.handle}
                    size="sm"
                  />
                  <span style={{
                    fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-dm-mono)',
                    maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {listing.profile.handle}
                  </span>
                </div>
              ) : <span />}
              {listing.delivery_time_days && (
                <span style={{
                  fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: 'var(--faint)',
                  padding: '2px 6px', borderRadius: 99,
                  background: 'var(--bg2)', border: '1px solid var(--brd)',
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
