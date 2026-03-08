'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BTopBar } from '@/components/b/BTopBar'
import toast from 'react-hot-toast'
import { suggestServiceCopy } from '@/lib/ai/mvp'

const CATEGORIES = [
  'Design', 'Development', 'Writing', 'Marketing',
  'Video', 'Music', 'Photography', 'Consulting', 'Legal', 'Finance', 'Education', 'Other',
]

const CREDIT_UNITS = [
  'per hour', 'per project', 'per day', 'per 1000 words',
  'per design', 'per video', 'per track', 'per session',
]

export default function BListPage() {
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    skills: '',
    creditRate: '',
    creditUnit: 'per hour',
    deliveryDays: '',
    portfolioUrls: '',
  })
  const [saving, setSaving] = useState(false)

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.category || !form.creditRate) {
      toast.error('Title, category and credit rate are required')
      return
    }

    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?next=/b/list'); return }

      const skills = form.skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)

      const portfolioUrls = form.portfolioUrls
        .split('\n')
        .map(u => u.trim())
        .filter(Boolean)

      if (portfolioUrls.length === 0) {
        toast.error('At least one portfolio URL is required')
        setSaving(false)
        return
      }

      const { data, error } = await supabase
        .from('service_listings')
        .insert({
          user_id: user.id,
          title: form.title,
          description: form.description,
          category: form.category,
          skills,
          credit_rate: parseInt(form.creditRate),
          credit_unit: form.creditUnit,
          delivery_time_days: form.deliveryDays ? parseInt(form.deliveryDays) : null,
          portfolio_urls: portfolioUrls,
          is_available: true,
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Skill listed!')
      router.push(`/b/listings/${data.id}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create listing'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <BTopBar title="Offer a skill" />

      <main className="max-w-2xl mx-auto px-4 py-4 pb-10 w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="label">What do you offer? *</label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. Brand identity design, React development, SEO copywriting"
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

          {/* Skills */}
          <div>
            <label htmlFor="skills" className="label">Skills / tools (comma separated)</label>
            <input
              id="skills"
              type="text"
              value={form.skills}
              onChange={set('skills')}
              placeholder="e.g. Figma, React, TypeScript, Webflow"
              className="input"
            />
          </div>

          {/* Credits */}
          <div>
            <div className="label">Credit rate *</div>
            <div className="flex gap-2">
              <input
                type="number"
                value={form.creditRate}
                onChange={set('creditRate')}
                placeholder="e.g. 50"
                className="input flex-1"
                min="1"
                required
              />
              <select
                value={form.creditUnit}
                onChange={set('creditUnit')}
                className="select w-36"
              >
                {CREDIT_UNITS.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-muted-2 mt-1.5">
              Credits earned here can be spent on any skill in the Bartr-B network.
            </p>
          </div>

          {/* Delivery time */}
          <div>
            <label htmlFor="delivery" className="label">Typical delivery (days)</label>
            <input
              id="delivery"
              type="number"
              value={form.deliveryDays}
              onChange={set('deliveryDays')}
              placeholder="e.g. 5"
              className="input"
              min="1"
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="description" className="label !mb-0">Description</label>
              <button
                type="button"
                onClick={() => {
                  const suggestion = suggestServiceCopy({ title: form.title, description: form.description, category: form.category })
                  setForm(prev => ({ ...prev, title: prev.title || suggestion.altTitle, description: suggestion.strongerDesc }))
                  toast.success('AI assist applied to service copy')
                }}
                className="chip chip-blue"
              >
                AI Assist
              </button>
            </div>
            <textarea
              id="description"
              value={form.description}
              onChange={set('description')}
              placeholder="What you do, who it's for, what's included, what you need from clients…"
              className="textarea"
              rows={5}
              maxLength={3000}
            />
          </div>

          {/* Portfolio — required */}
          <div>
            <label htmlFor="portfolio" className="label">
              Portfolio URLs * <span className="text-muted-2">(one per line)</span>
            </label>
            <textarea
              id="portfolio"
              value={form.portfolioUrls}
              onChange={set('portfolioUrls')}
              placeholder="https://behance.net/yourwork&#10;https://github.com/yourrepo&#10;https://dribbble.com/yourprofile"
              className="textarea"
              rows={4}
            />
            <p className="text-xs text-muted-2 mt-1.5">
              Portfolio is required — it&apos;s your proof of work. No portfolio, no listing.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-full text-base font-medium border transition-colors"
            style={{
              background: saving ? 'rgba(45,106,79,0.40)' : 'rgba(45,106,79,0.80)',
              borderColor: 'rgba(45,106,79,0.55)',
              color: 'white',
            }}
          >
            {saving ? 'Listing…' : 'List skill'}
          </button>
        </form>
      </main>
    </>
  )
}
