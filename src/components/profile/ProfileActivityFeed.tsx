'use client'

import { motion } from 'framer-motion'

export interface ActivityItem {
  id: string
  type: 'listed' | 'traded' | 'received_offer' | 'sent_offer' | 'joined' | 'review'
  text: string
  subtext?: string
  time: string
  emoji: string
}

const TYPE_DOT: Record<string, string> = {
  listed:         '#1D5FA8',
  traded:         '#059669',
  received_offer: '#9A6C18',
  sent_offer:     '#9A6C18',
  review:         '#059669',
  joined:         '#C4312A',
}

const TYPE_BG: Record<string, string> = {
  listed:         'rgba(29,95,168,0.10)',
  traded:         'rgba(5,150,105,0.10)',
  received_offer: 'rgba(154,108,24,0.10)',
  sent_offer:     'rgba(154,108,24,0.10)',
  review:         'rgba(5,150,105,0.10)',
  joined:         'rgba(196,49,42,0.10)',
}

export function ProfileActivityFeed({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) return null

  return (
    <div>
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.12 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            padding: '11px 0',
            borderBottom: i < items.length - 1 ? '1px solid var(--brd)' : 'none',
          }}
        >
          {/* Emoji icon + connector line */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 36 }}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.15 }}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: TYPE_BG[item.type] ?? 'var(--bg2)',
                border: `1.5px solid ${TYPE_DOT[item.type] ?? 'var(--brd)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, flexShrink: 0,
              }}
            >
              {item.emoji}
            </motion.div>
            {i < items.length - 1 && (
              <div style={{
                width: 1.5,
                background: `linear-gradient(to bottom, ${TYPE_DOT[item.type] ?? 'var(--brd)'} 0%, var(--brd) 100%)`,
                flex: 1, minHeight: 10, marginTop: 4, opacity: 0.4,
              }} />
            )}
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0, paddingTop: 7 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: TYPE_DOT[item.type] ?? 'var(--faint)',
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.3 }}>
                {item.text}
              </span>
            </div>
            {item.subtext && (
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 11,
                color: 'var(--muted)', paddingLeft: 12,
              }}>
                {item.subtext}
              </div>
            )}
          </div>

          {/* Time */}
          <div style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 10,
            color: 'var(--faint)', flexShrink: 0, paddingTop: 8,
            whiteSpace: 'nowrap',
          }}>
            {item.time}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
