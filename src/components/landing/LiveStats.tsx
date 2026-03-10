'use client'

import { useEffect, useRef, useState } from 'react'

interface StatItem {
  value: number
  suffix: string
  label: string
  color?: string
}

const STATS: StatItem[] = [
  { value: 2340, suffix: '+', label: 'items listed', color: 'var(--red)' },
  { value: 147, suffix: '', label: 'trades this week', color: 'var(--ink)' },
  { value: 23, suffix: '', label: 'cities active', color: 'var(--grn)' },
  { value: 4.9, suffix: '★', label: 'community trust', color: 'var(--gld)' },
]

function AnimatedNumber({ target, suffix, duration = 1400 }: { target: number; suffix: string; duration?: number }) {
  const [current, setCurrent] = useState(0)
  const rafRef = useRef<number>(0)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    const isDecimal = !Number.isInteger(target)

    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const elapsed = ts - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const val = eased * target
      setCurrent(isDecimal ? Math.round(val * 10) / 10 : Math.floor(val))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setCurrent(target)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  const isDecimal = !Number.isInteger(target)
  return <>{isDecimal ? current.toFixed(1) : current.toLocaleString()}{suffix}</>
}

export function LiveStats() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        display: 'flex', gap: 0,
        justifyContent: 'center',
        flexWrap: 'wrap',
        borderTop: '1px solid var(--brd)',
        borderBottom: '1px solid var(--brd)',
        background: 'var(--surf)',
      }}
    >
      {STATS.map((stat, i) => (
        <div
          key={stat.label}
          style={{
            flex: '1 1 25%', minWidth: 100,
            padding: '20px 16px',
            textAlign: 'center',
            borderRight: i < STATS.length - 1 ? '1px solid var(--brd)' : 'none',
          }}
        >
          <div style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: 22, fontWeight: 700,
            color: stat.color ?? 'var(--ink)',
            lineHeight: 1.1, marginBottom: 4,
            letterSpacing: '-0.02em',
          }}>
            {visible ? <AnimatedNumber target={stat.value} suffix={stat.suffix} /> : `0${stat.suffix}`}
          </div>
          <div style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 10,
            color: 'var(--faint)', letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}
