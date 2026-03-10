'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Avatar } from '@/components/ui/Avatar'
import type { ServiceListing } from '@/types/bartr-b'

// Per-category gradients — must match ServiceCard.tsx
const CATEGORY_STYLE: Record<string, { gradient: string; emoji: string }> = {
  Design:      { gradient: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)', emoji: '🎨' },
  Development: { gradient: 'linear-gradient(135deg, #1D4ED8 0%, #0891B2 100%)', emoji: '💻' },
  Writing:     { gradient: 'linear-gradient(135deg, #B45309 0%, #F59E0B 100%)', emoji: '✍️' },
  Marketing:   { gradient: 'linear-gradient(135deg, #B91C1C 0%, #F97316 100%)', emoji: '📣' },
  Video:       { gradient: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%)', emoji: '🎬' },
  Music:       { gradient: 'linear-gradient(135deg, #1E40AF 0%, #4C1D95 100%)', emoji: '🎧' },
  Photography: { gradient: 'linear-gradient(135deg, #1F2937 0%, #4B5563 100%)', emoji: '📷' },
  Consulting:  { gradient: 'linear-gradient(135deg, #065F46 0%, #0891B2 100%)', emoji: '💡' },
  Other:       { gradient: 'linear-gradient(135deg, #065F46 0%, #059669 100%)', emoji: '◎' },
}

export function BHeroServices({ services }: { services: ServiceListing[] }) {
  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      padding: '24px 16px 24px 20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 10,
      alignContent: 'start',
      scrollbarWidth: 'none',
    }}>
      {services.map((s, i) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
          <BHeroCard service={s} />
        </motion.div>
      ))}
    </div>
  )
}

function BHeroCard({ service }: { service: ServiceListing }) {
  const style = CATEGORY_STYLE[service.category] ?? CATEGORY_STYLE.Other

  return (
    <Link href={`/b/listings/${service.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <motion.div
        whileHover={{ y: -3, scale: 1.02 }}
        transition={{ duration: 0.15 }}
        style={{
          // GLASS styling — visible because hero has dark emerald bg behind it
          background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,0.16)',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.12)',
          cursor: 'pointer',
        }}
      >
        {/* Gradient header — per category */}
        <div style={{
          height: 70,
          background: style.gradient,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }} />
          <div style={{ position: 'absolute', bottom: 8, left: 10, fontSize: 22 }}>
            {style.emoji}
          </div>
          <div style={{
            position: 'absolute', bottom: 6, right: 10,
            fontFamily: 'var(--font-dm-mono)', fontSize: 16,
            fontWeight: 700, color: '#fff',
            textShadow: '0 1px 6px rgba(0,0,0,0.25)',
          }}>
            {service.credit_rate}c
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '8px 10px 10px' }}>
          <div style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 7,
            textTransform: 'uppercase', letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.45)', marginBottom: 3,
          }}>
            {service.category}
          </div>
          <div style={{
            fontSize: 11, fontWeight: 500,
            color: 'rgba(255,255,255,0.9)',
            lineHeight: 1.3, marginBottom: 6,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {service.title}
          </div>
          {service.profile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Avatar src={service.profile.avatar_url} alt={service.profile.handle} size="sm" />
              <span style={{
                fontSize: 9, color: 'rgba(255,255,255,0.5)',
                fontFamily: 'var(--font-dm-mono)',
              }}>
                {service.profile.handle}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  )
}
