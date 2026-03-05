'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/layout/TopBar'
import toast from 'react-hot-toast'

const CATEGORIES = [
  'Fashion', 'Electronics', 'Books', 'Art',
  'Collectibles', 'Home', 'Sports', 'Music', 'Other',
]

const CONDITIONS = [
  { value: 'new', label: 'New — unused, in original packaging' },
  { value: 'like_new', label: 'Like new — barely used, no signs of wear' },
  { value: 'good', label: 'Good — used but well maintained' },
  { value: 'fair', label: 'Fair — visible signs of use' },
  { value: 'poor', label: 'Poor — heavy wear, functional' },
]

export default function ListPage() {
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    condition: 'good',
    valueLow: '',
    valueHigh: '',
    wants: '',
    location: '',
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

      toast.success('Listing created!')
      router.push(`/listings/${data.id}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create listing'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <TopBar title="List item" />

      <main className="max-w-2xl mx-auto px-4 py-4 pb-10 w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="label">What are you listing? *</label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. Sony WH-1000XM4 headphones"
              className="input"
              required
              maxLength={120}
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="label">Category *</label>
            <select
              id="category"
              value={form.category}
              onChange={set('category')}
              className="select"
              required
            >
              <option value="">Select a category…</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label htmlFor="condition" className="label">Condition</label>
            <select
              id="condition"
              value={form.condition}
              onChange={set('condition')}
              className="select"
            >
              {CONDITIONS.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Value estimate */}
          <div>
            <div className="label">Estimated value (£)</div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={form.valueLow}
                onChange={set('valueLow')}
                placeholder="Low"
                className="input flex-1"
                min="0"
              />
              <span className="text-muted-2">–</span>
              <input
                type="number"
                value={form.valueHigh}
                onChange={set('valueHigh')}
                placeholder="High"
                className="input flex-1"
                min="0"
              />
            </div>
            <p className="text-xs text-muted-2 mt-1.5">
              BARTR Estimates will auto-fill this based on recent eBay sales (coming soon).
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="label">Description</label>
            <textarea
              id="description"
              value={form.description}
              onChange={set('description')}
              placeholder="Condition details, what's included, any defects…"
              className="textarea"
              rows={4}
              maxLength={2000}
            />
          </div>

          {/* Wants */}
          <div>
            <label htmlFor="wants" className="label">What do you want in return?</label>
            <input
              id="wants"
              type="text"
              value={form.wants}
              onChange={set('wants')}
              placeholder="e.g. Books, camera gear, vinyl records, open to offers"
              className="input"
              maxLength={300}
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="label">Location</label>
            <input
              id="location"
              type="text"
              value={form.location}
              onChange={set('location')}
              placeholder="e.g. London, Manchester"
              className="input"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary w-full btn-lg text-base"
            >
              {saving ? 'Listing…' : 'List item'}
            </button>
          </div>
        </form>
      </main>
    </>
  )
}
