'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Avatar } from '@/components/ui/Avatar'
import type { ServiceListing } from '@/types/bartr-b'

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

export function BHeroServices({ services }: { services: ServiceListing[] }) {
  return (
    <div style={{
      overflowY: 'auto',
      padding: '20px 16px 20px 20px',
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
          transition={{ duration: 0.4, delay: 0.05 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
          <BHeroCard service={s} />
        </motion.div>
      ))}
    </div>
  )
}

function BHeroCard({ service }: { service: ServiceListing }) {
  const emoji = CATEGORY_EMOJI[service.category] ?? '◎'
  return (
    <Link href={`/b/listings/${service.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <motion.div
        whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(5,150,105,0.14)' }}
        transition={{ duration: 0.15 }}
        style={{
          background: 'var(--surf)', border: '1px solid var(--brd)',
          borderRadius: 'var(--rl)', overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(26,24,20,0.06)',
          cursor: 'pointer',
        }}
      >
        <div style={{
          height: 80,
          background: 'linear-gradient(135deg, var(--gbg) 0%, #e6f5ec 100%)',
          borderBottom: '1px solid var(--gbd)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 12px',
        }}>
          <span style={{ fontSize: 30 }}>{emoji}</span>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 14, fontWeight: 500, color: 'var(--grn)' }}>
              {service.credit_rate}c
            </div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, color: 'var(--muted)', letterSpacing: '0.04em' }}>
              {service.credit_unit}
            </div>
          </div>
        </div>
        <div style={{ padding: '8px 10px 10px' }}>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--grn)', marginBottom: 3 }}>
            {service.category}
          </div>
          <div style={{
            fontSize: 11, fontWeight: 500, color: 'var(--ink)',
            lineHeight: 1.3, marginBottom: 6,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {service.title}
          </div>
          {service.profile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Avatar src={service.profile.avatar_url} alt={service.profile.handle} size="sm" />
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>{service.profile.handle}</span>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  )
}
