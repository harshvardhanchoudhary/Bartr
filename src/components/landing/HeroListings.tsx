'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface HeroListing {
  id: string
  emoji: string
  title: string
  category: string
  condition: string
  value: number
  user: string
  wants: string[]
}

export function HeroListings({ listings }: { listings: HeroListing[] }) {
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
      {listings.map((listing, i) => (
        <motion.div
          key={listing.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroCard listing={listing} />
        </motion.div>
      ))}
    </div>
  )
}

function HeroCard({ listing }: { listing: HeroListing }) {
  return (
    <Link href={`/listings/${listing.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <motion.div
        whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(26,24,20,0.11)' }}
        transition={{ duration: 0.15 }}
        style={{
          background: 'var(--surf)', border: '1px solid var(--brd)',
          borderRadius: 'var(--rl)', overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(26,24,20,0.06)',
          cursor: 'pointer',
        }}
      >
        {/* Emoji image area */}
        <div style={{
          height: 100, background: 'var(--bg2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 40, borderBottom: '1px solid var(--brd)',
          position: 'relative',
        }}>
          {listing.emoji}
          <span style={{
            position: 'absolute', bottom: 6, left: 6,
            fontFamily: 'var(--font-dm-mono)', fontSize: 8,
            padding: '2px 6px', borderRadius: 99,
            background: 'rgba(253,252,250,0.92)', border: '1px solid var(--brd)', color: 'var(--ink2)',
          }}>
            {listing.condition}
          </span>
        </div>

        <div style={{ padding: '10px 10px 8px' }}>
          <div style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 8,
            textTransform: 'uppercase', letterSpacing: '0.08em',
            color: 'var(--faint)', marginBottom: 3,
          }}>
            {listing.category}
          </div>
          <div style={{
            fontSize: 12, fontWeight: 500, color: 'var(--ink)',
            lineHeight: 1.3, marginBottom: 5,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {listing.title}
          </div>
          <div style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 12,
            fontWeight: 500, color: 'var(--red)', marginBottom: 5,
          }}>
            ~£{listing.value}
          </div>
          {listing.wants.length > 0 && (
            <div style={{
              fontSize: 9, color: 'var(--muted)',
              background: 'var(--bg)', borderRadius: 'var(--r)',
              padding: '3px 6px',
            }}>
              <span style={{ color: 'var(--faint)', fontFamily: 'var(--font-dm-mono)' }}>wants </span>
              {listing.wants[0]}{listing.wants.length > 1 ? ` +${listing.wants.length - 1}` : ''}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  )
}
