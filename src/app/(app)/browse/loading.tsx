export default function BrowseLoading() {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '16px 16px 80px' }}>
      {/* Search bar skeleton */}
      <div style={{
        height: 44, borderRadius: 'var(--rl)',
        background: 'var(--bg2)', marginBottom: 12,
        animation: 'pulse 1.4s ease-in-out infinite',
      }} />
      {/* Category tabs skeleton */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflow: 'hidden' }}>
        {[80, 60, 100, 70, 90].map((w, i) => (
          <div key={i} style={{
            height: 30, width: w, borderRadius: 99, flexShrink: 0,
            background: 'var(--bg2)', animation: 'pulse 1.4s ease-in-out infinite',
            animationDelay: `${i * 0.08}s`,
          }} />
        ))}
      </div>
      {/* Cards grid skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{
            borderRadius: 'var(--rl)', overflow: 'hidden',
            border: '1px solid var(--brd)',
            animation: 'pulse 1.4s ease-in-out infinite',
            animationDelay: `${i * 0.06}s`,
          }}>
            <div style={{ height: 120, background: 'var(--bg2)' }} />
            <div style={{ padding: '10px 12px 14px', background: 'var(--surf)' }}>
              <div style={{ height: 8, width: '40%', borderRadius: 4, background: 'var(--bg2)', marginBottom: 8 }} />
              <div style={{ height: 12, borderRadius: 4, background: 'var(--bg2)', marginBottom: 6 }} />
              <div style={{ height: 12, width: '70%', borderRadius: 4, background: 'var(--bg2)', marginBottom: 10 }} />
              <div style={{ height: 14, width: '30%', borderRadius: 4, background: 'var(--bg2)' }} />
            </div>
          </div>
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  )
}
