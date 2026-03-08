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

// Bento layout for 6 items:
// [ a  wide ] [ b ]   row 1
// [ c ] [ d ] [ b ]   row 2  (b is tall)
// [ e  wide ] [ f ]   row 3
const BENTO_AREAS = ['a', 'b', 'c', 'd', 'e', 'f']
const AREA_STYLES: Record<string, React.CSSProperties> = {
  a: { gridArea: 'a' },
  b: { gridArea: 'b' },
  c: { gridArea: 'c' },
  d: { gridArea: 'd' },
  e: { gridArea: 'e' },
  f: { gridArea: 'f' },
}
const WIDE_AREAS  = new Set(['a', 'e'])
const TALL_AREAS  = new Set(['b'])

export function HeroListings({ listings }: { listings: HeroListing[] }) {
  const items = listings.slice(0, 6)

  return (
    <div style={{
      padding: '16px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gridTemplateRows: 'auto auto auto',
      gridTemplateAreas: `
        "a a b"
        "c d b"
        "e e f"
      `,
      gap: 10,
      overflow: 'hidden',
    }}>
      {items.map((listing, i) => {
        const area = BENTO_AREAS[i] ?? 'f'
        const isWide = WIDE_AREAS.has(area)
        const isTall = TALL_AREAS.has(area)
        return (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.04 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            style={AREA_STYLES[area]}
          >
            <HeroCard listing={listing} isWide={isWide} isTall={isTall} />
          </motion.div>
        )
      })}
    </div>
  )
}

function HeroCard({ listing, isWide, isTall }: { listing: HeroListing; isWide: boolean; isTall: boolean }) {
  return (
    <Link href={`/listings/${listing.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <motion.div
        whileHover={{ scale: 1.02, boxShadow: '0 12px 32px rgba(26,24,20,0.14)' }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        style={{
          height: '100%',
          background: 'rgba(253,252,250,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.6)',
          borderRadius: isWide ? 14 : 'var(--rl)',
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(26,24,20,0.07), 0 1px 0 rgba(255,255,255,0.8) inset',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Emoji area */}
        <div style={{
          flexShrink: 0,
          height: isTall ? 130 : isWide ? 88 : 80,
          background: 'linear-gradient(135deg, var(--bg2) 0%, var(--bg) 100%)',
          display: 'flex', alignItems: 'center',
          justifyContent: isWide ? 'flex-start' : 'center',
          fontSize: isWide ? 48 : isTall ? 44 : 32,
          borderBottom: '1px solid rgba(224,220,213,0.5)',
          padding: isWide ? '0 20px' : 0,
          position: 'relative',
          gap: isWide ? 16 : 0,
        }}>
          <span>{listing.emoji}</span>
          {isWide && (
            <div>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 8,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                color: 'var(--faint)', marginBottom: 3,
              }}>
                {listing.category}
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.2 }}>
                {listing.title}
              </div>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 13, color: 'var(--red)', marginTop: 4, fontWeight: 500 }}>
                ~£{listing.value}
              </div>
            </div>
          )}
          <span style={{
            position: 'absolute', bottom: 6, left: isWide ? 'auto' : 6, right: isWide ? 6 : 'auto',
            fontFamily: 'var(--font-dm-mono)', fontSize: 8,
            padding: '2px 6px', borderRadius: 99,
            background: 'rgba(253,252,250,0.92)', border: '1px solid var(--brd)', color: 'var(--muted)',
          }}>
            {listing.condition}
          </span>
        </div>

        {/* Body — hidden on wide (shown inline above) */}
        {!isWide && (
          <div style={{ padding: '8px 10px 10px', flex: 1 }}>
            <div style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 8,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              color: 'var(--faint)', marginBottom: 2,
            }}>
              {listing.category}
            </div>
            <div style={{
              fontSize: 11, fontWeight: 500, color: 'var(--ink)',
              lineHeight: 1.3, marginBottom: 4,
              display: '-webkit-box', WebkitLineClamp: isTall ? 3 : 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {listing.title}
            </div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, fontWeight: 500, color: 'var(--red)' }}>
              ~£{listing.value}
            </div>
            {isTall && listing.wants.length > 0 && (
              <div style={{
                marginTop: 6, fontSize: 9, color: 'var(--muted)',
                background: 'var(--bg)', borderRadius: 'var(--r)', padding: '3px 6px',
              }}>
                <span style={{ color: 'var(--faint)', fontFamily: 'var(--font-dm-mono)' }}>wants </span>
                {listing.wants[0]}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </Link>
  )
}
