'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Props {
  title: string
  images: string[]
}

export function ListingMediaCarousel({ title, images }: Props) {
  const [index, setIndex] = useState(0)
  const safeImages = images.length > 0 ? images : []

  if (safeImages.length === 0) {
    return (
      <div style={{ position: 'relative', aspectRatio: '4/3', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--faint)', fontSize: 40 }}>
        ◻
      </div>
    )
  }

  const current = safeImages[index]

  return (
    <div style={{ position: 'relative', aspectRatio: '4/3', background: 'var(--bg2)', overflow: 'hidden' }}>
      <Image src={current} alt={title} fill style={{ objectFit: 'cover' }} />

      {safeImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setIndex((v) => (v - 1 + safeImages.length) % safeImages.length)}
            style={{ position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)', width: 30, height: 30, borderRadius: 99, border: '1px solid rgba(255,255,255,0.45)', background: 'rgba(20,20,20,0.35)', color: 'white', cursor: 'pointer' }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setIndex((v) => (v + 1) % safeImages.length)}
            style={{ position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)', width: 30, height: 30, borderRadius: 99, border: '1px solid rgba(255,255,255,0.45)', background: 'rgba(20,20,20,0.35)', color: 'white', cursor: 'pointer' }}
            aria-label="Next image"
          >
            ›
          </button>

          <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
            {safeImages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                style={{ width: i === index ? 16 : 7, height: 7, borderRadius: 99, border: 'none', background: i === index ? 'white' : 'rgba(255,255,255,0.55)', cursor: 'pointer' }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
