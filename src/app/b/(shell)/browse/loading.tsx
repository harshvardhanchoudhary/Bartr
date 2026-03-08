export default function BBrowseLoading() {
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '16px 16px 80px' }}>
      <div style={{
        height: 44, borderRadius: 'var(--rl)',
        background: 'var(--gbg)', marginBottom: 12,
        animation: 'pulse 1.4s ease-in-out infinite',
        border: '1px solid var(--gbd)',
      }} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflow: 'hidden' }}>
        {[60, 80, 110, 70, 90, 65].map((w, i) => (
          <div key={i} style={{
            height: 30, width: w, borderRadius: 99, flexShrink: 0,
            background: 'var(--gbg)', border: '1px solid var(--gbd)',
            animation: 'pulse 1.4s ease-in-out infinite',
            animationDelay: `${i * 0.08}s`,
          }} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{
            borderRadius: 'var(--rl)', overflow: 'hidden',
            border: '1px solid var(--gbd)',
            animation: 'pulse 1.4s ease-in-out infinite',
            animationDelay: `${i * 0.07}s`,
          }}>
            <div style={{ height: 90, background: 'var(--gbg)' }} />
            <div style={{ padding: '10px 12px 14px', background: 'var(--surf)' }}>
              <div style={{ height: 8, width: '35%', borderRadius: 4, background: 'var(--gbg)', marginBottom: 8 }} />
              <div style={{ height: 12, borderRadius: 4, background: 'var(--bg2)', marginBottom: 6 }} />
              <div style={{ height: 12, width: '75%', borderRadius: 4, background: 'var(--bg2)', marginBottom: 10 }} />
              <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                {[50, 60, 40].map((w, j) => (
                  <div key={j} style={{ height: 20, width: w, borderRadius: 99, background: 'var(--gbg)' }} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  )
}
