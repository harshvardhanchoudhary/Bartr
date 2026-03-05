'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export function Drawer({ open, onClose, title, subtitle, children, className }: DrawerProps) {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 max-h-[90dvh] overflow-y-auto',
          'bg-surface border-t border-stroke rounded-t-lg shadow-card',
          'animate-slide-up',
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/15" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-stroke">
          <div>
            <h2 className="font-semibold text-base">{title}</h2>
            {subtitle && <p className="text-muted text-sm mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost text-xs px-3 py-1.5 ml-4 flex-shrink-0"
          >
            Close
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 pb-safe">
          {children}
        </div>
      </div>
    </>
  )
}
