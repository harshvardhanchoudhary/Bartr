'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'

interface CreditWalletCardProps {
  balance: number
  lifetimeEarned: number
  handle: string
  tier?: string | null
}

export function CreditWalletCard({ balance, lifetimeEarned, handle, tier }: CreditWalletCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-80, 80], [10, -10])
  const rotateY = useTransform(x, [-80, 80], [-10, 10])
  const glareX = useTransform(x, [-80, 80], [0, 100])
  const glareY = useTransform(y, [-80, 80], [0, 100])

  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 25 })
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 25 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set(e.clientX - cx)
    y.set(e.clientY - cy)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 800, marginBottom: 20 }}
    >
      <motion.div
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: 'preserve-3d',
          borderRadius: 20,
          overflow: 'hidden',
          position: 'relative',
          height: 180,
          background: 'linear-gradient(135deg, #065f46 0%, #059669 45%, #34d399 100%)',
          boxShadow: '0 20px 60px rgba(5,150,105,0.35), 0 4px 20px rgba(5,150,105,0.2)',
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        {/* Glare overlay */}
        <motion.div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(ellipse at ${glareX.get()}% ${glareY.get()}%, rgba(255,255,255,0.18) 0%, transparent 60%)`,
            zIndex: 2,
          }}
        />

        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          zIndex: 1,
        }} />

        {/* Decorative circles */}
        <div style={{
          position: 'absolute', right: -30, top: -30,
          width: 160, height: 160,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          zIndex: 1,
        }} />
        <div style={{
          position: 'absolute', right: 20, top: 20,
          width: 80, height: 80,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          zIndex: 1,
        }} />

        {/* Card content */}
        <div style={{
          position: 'relative', zIndex: 3,
          padding: '22px 24px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.6)', marginBottom: 3,
              }}>
                Bartr-B Credits
              </div>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 36,
                fontWeight: 700, color: '#fff',
                lineHeight: 1,
                textShadow: '0 2px 12px rgba(0,0,0,0.2)',
              }}>
                {balance.toLocaleString()}
                <span style={{ fontSize: 18, fontWeight: 400, marginLeft: 4, opacity: 0.8 }}>c</span>
              </div>
            </div>
            {tier && (
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                padding: '3px 10px', borderRadius: 99,
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: 'rgba(255,255,255,0.85)',
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                {tier}
              </div>
            )}
          </div>

          {/* Bottom row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em',
                textTransform: 'uppercase', marginBottom: 2,
              }}>
                Lifetime earned
              </div>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 14,
                color: 'rgba(255,255,255,0.85)', fontWeight: 500,
              }}>
                {lifetimeEarned.toLocaleString()}c
              </div>
            </div>
            <div style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 12,
              color: 'rgba(255,255,255,0.65)',
              letterSpacing: '0.08em',
            }}>
              @{handle}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
