'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BTopBar } from '@/components/b/BTopBar'
import toast from 'react-hot-toast'

const CATEGORIES = [
  'Design', 'Development', 'Writing', 'Marketing',
  'Video', 'Music', 'Photography', 'Consulting', 'Legal', 'Finance', 'Education', 'Other',
]

export default function NewBriefPage() {
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    skillsNeeded: '',
    budgetCredits: '',
    deadline: '',
  })
  const [saving, setSaving] = useState(false)

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.category || !form.description) {
      toast.error('Title, category and description are required')
      return
    }
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?next=/b/briefs/new'); return }

      const skills = form.skillsNeeded
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)

      const { data, error } = await supabase
        .from('briefs')
        .insert({
          user_id: user.id,
          title: form.title,
          description: form.description,
          category: form.category,
          skills_needed: skills,
          budget_credits: form.budgetCredits ? parseInt(form.budgetCredits) : null,
          deadline: form.deadline || null,
          status: 'open',
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Brief posted!')
      router.push(`/b/briefs/${data.id}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to post brief'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <BTopBar title="Post a brief" />

      <main className="max-w-2xl mx-auto px-4 py-4 pb-10 w-full">
        <p className="text-sm text-muted mb-6">
          Describe what you need. Scope is locked when you match with a freelancer — no surprises.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">What do you need? *</label>
            <input
              type="text"
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. Logo and brand identity for my startup"
              className="input"
              required
              maxLength={120}
            />
          </div>

          <div>
            <label className="label">Category *</label>
            <select value={form.category} onChange={set('category')} className="select" required>
              <option value="">Select…</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Description *</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              placeholder="Describe your project, deliverables, any requirements, what success looks like…"
              className="textarea"
              rows={6}
              required
              maxLength={3000}
            />
          </div>

          <div>
            <label className="label">Skills needed (comma separated)</label>
            <input
              type="text"
              value={form.skillsNeeded}
              onChange={set('skillsNeeded')}
              placeholder="e.g. Figma, brand strategy, illustration"
              className="input"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="label">Budget (Credits)</label>
              <input
                type="number"
                value={form.budgetCredits}
                onChange={set('budgetCredits')}
                placeholder="e.g. 200"
                className="input"
                min="1"
              />
            </div>
            <div className="flex-1">
              <label className="label">Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={set('deadline')}
                className="input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-full text-base font-medium border"
            style={{
              background: saving ? 'rgba(45,106,79,0.40)' : 'rgba(45,106,79,0.80)',
              borderColor: 'rgba(45,106,79,0.55)',
              color: 'white',
            }}
          >
            {saving ? 'Posting…' : 'Post brief'}
          </button>
        </form>
      </main>
    </>
  )
}
