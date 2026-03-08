'use client'

// Simulated live activity — in production this would pull from a real-time feed
const ACTIVITY_ITEMS = [
  { type: 'trade', text: '@tessafilm traded Fujifilm X-T20 for iPad Pro' },
  { type: 'list', text: '@mikeb listed a Fender Telecaster · ~£220' },
  { type: 'trade', text: '@pablor traded Arc\'teryx jacket for snowboard gear' },
  { type: 'list', text: '@djsol listed Technics SL-1200MK2 · ~£480' },
  { type: 'trade', text: '@jordanmc completed a trade in Manchester' },
  { type: 'stat', text: '147 trades completed this week' },
  { type: 'list', text: '@kwamea listed Nike Air Max 1 OG · ~£140' },
  { type: 'stat', text: '2,300+ items listed · No cash, no fees' },
  { type: 'trade', text: '@lilyc traded iPad for camera gear in London' },
  { type: 'stat', text: 'Community trust score: 4.9★ · 23 cities active' },
]

const DOT: Record<string, string> = {
  trade: 'var(--red)',
  list: 'var(--muted)',
  stat: 'var(--grn)',
}

export function ActivityTicker() {
  const items = [...ACTIVITY_ITEMS, ...ACTIVITY_ITEMS]

  return (
    <div style={{
      borderTop: '1px solid var(--brd)', borderBottom: '1px solid var(--brd)',
      overflow: 'hidden', background: 'var(--bg2)', padding: '8px 0',
    }}>
      <div style={{
        display: 'flex', gap: 0,
        animation: 'ticker 42s linear infinite',
        width: 'max-content',
      }}>
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '0 28px',
              fontFamily: 'var(--font-dm-mono)', fontSize: 11,
              color: 'var(--ink2)', letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
              borderRight: '1px solid var(--brd)',
            }}
          >
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: DOT[item.type] ?? 'var(--muted)',
              flexShrink: 0, display: 'inline-block',
            }} />
            {item.text}
          </span>
        ))}
      </div>
    </div>
  )
}
