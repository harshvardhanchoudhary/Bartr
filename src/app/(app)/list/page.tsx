'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/layout/TopBar'
import toast from 'react-hot-toast'

const CATEGORIES = ['Fashion', 'Electronics', 'Books', 'Art', 'Collectibles', 'Home', 'Sports', 'Music', 'Other']
const CONDITIONS = [
  { value: 'new', label: 'New — unused, original packaging' },
  { value: 'like_new', label: 'Like new — barely used, no wear' },
  { value: 'good', label: 'Good — used but well maintained' },
  { value: 'fair', label: 'Fair — visible signs of use' },
  { value: 'poor', label: 'Poor — heavy wear, still functional' },
]

const inputStyle = {
  width: '100%', padding: '11px 14px',
  border: '1px solid var(--brd)', borderRadius: 'var(--r)',
  background: 'var(--surf)', color: 'var(--ink)',
  fontSize: 14, outline: 'none',
  fontFamily: 'var(--font-dm-sans)',
} as const

const labelStyle = {
  display: 'block', fontFamily: 'var(--font-dm-mono)',
  fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' as const,
  color: 'var(--muted)', marginBottom: 6,
}

export default function ListPage() {
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    title: '', description: '', category: '',
    condition: 'good', valueLow: '', valueHigh: '',
    wants: '', location: '',
  })
  const [saving, setSaving] = useState(false)

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.category) {
      toast.error('Title and category are required')
      return
    }
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?next=/list'); return }

      const { data, error } = await supabase.from('listings').insert({
        user_id: user.id,
        title: form.title,
        description: form.description || null,
        category: form.category,
        condition: form.condition,
        value_estimate_low: form.valueLow ? parseInt(form.valueLow) : null,
        value_estimate_high: form.valueHigh ? parseInt(form.valueHigh) : null,
        wants: form.wants || null,
        location: form.location || null,
        images: [],
        status: 'active',
      }).select().single()

      if (error) throw error
      toast.success('Listed!')
      router.push(`/listings/${data.id}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create listing')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <TopBar title="List an item" back />

      <main style={{ maxWidth: 560, margin: '0 auto', padding: '24px 16px 60px' }}>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24, lineHeight: 1.6 }}>
          Tell people what you have and what you want in return. The clearer, the more offers you&apos;ll get.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Title */}
          <div>
            <label style={labelStyle}>What are you listing? *</label>
            <input
              type="text"
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. Sony WH-1000XM4 headphones"
              required
              maxLength={120}
              style={inputStyle}
            />
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category *</label>
            <select value={form.category} onChange={set('category')} required style={{
              ...inputStyle,
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2378746E' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
              paddingRight: 36, appearance: 'none',
            }}>
              <option value="">Select a category…</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label style={labelStyle}>Condition</label>
            <select value={form.condition} onChange={set('condition')} style={{
              ...inputStyle,
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2378746E' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
              paddingRight: 36, appearance: 'none',
            }}>
              {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          {/* Value estimate */}
          <div>
            <label style={labelStyle}>Estimated value (£)</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="number" value={form.valueLow} onChange={set('valueLow')}
                placeholder="Min" min="0" style={{ ...inputStyle, flex: 1 }}
              />
              <span style={{ color: 'var(--faint)' }}>—</span>
              <input
                type="number" value={form.valueHigh} onChange={set('valueHigh')}
                placeholder="Max" min="0" style={{ ...inputStyle, flex: 1 }}
              />
            </div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)', marginTop: 6 }}>
              Auto-fill from eBay recent sales — coming soon
            </p>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              placeholder="Condition details, what's included, any defects…"
              rows={4}
              maxLength={2000}
              style={{ ...inputStyle, resize: 'none', minHeight: 100 }}
            />
          </div>

          {/* Wants — the key social proof field */}
          <div>
            <label style={labelStyle}>What will you accept in return?</label>
            <input
              type="text"
              value={form.wants}
              onChange={set('wants')}
              placeholder="e.g. Camera gear, vinyl, fiction books, open to offers"
              maxLength={300}
              style={inputStyle}
            />
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)', marginTop: 6 }}>
              This shows on your listing as &quot;What gets accepted&quot; — be specific to get better offers
            </p>
          </div>

          {/* Location */}
          <div>
            <label style={labelStyle}>Location</label>
            <input
              type="text"
              value={form.location}
              onChange={set('location')}
              placeholder="e.g. London, Manchester"
              style={inputStyle}
            />
          </div>

          {/* Submit */}
          <div style={{ paddingTop: 8 }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                width: '100%', padding: '14px',
                borderRadius: 99,
                background: saving ? 'var(--brd2)' : 'var(--red)',
                border: `1px solid ${saving ? 'var(--brd2)' : '#A8251F'}`,
                color: 'white', fontSize: 16, fontWeight: 500,
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Listing…' : 'List item →'}
            </button>
          </div>
        </form>
      </main>
    </>
  )
}
