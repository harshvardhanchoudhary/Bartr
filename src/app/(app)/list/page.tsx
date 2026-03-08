'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
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
  fontFamily: 'var(--font-dm-sans)', boxSizing: 'border-box' as const,
} as const

const labelStyle = {
  display: 'block', fontFamily: 'var(--font-dm-mono)',
  fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' as const,
  color: 'var(--muted)', marginBottom: 6,
}

function conditionLabel(v: string) {
  return CONDITIONS.find(c => c.value === v)?.label.split(' — ')[0] ?? v
}

export default function ListPage() {
  const supabase = createClient()

  const [form, setForm] = useState({
    title: '', description: '', category: '',
    condition: 'good', valueLow: '', valueHigh: '',
    wants: '', location: '',
  })
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [aiAssisting, setAiAssisting] = useState(false)
  const [preview, setPreview] = useState(false)  // guest preview state
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleAiAssist() {
    if (!form.title && !form.description) {
      toast.error('Add a title or description first')
      return
    }
    setAiAssisting(true)
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, description: form.description, category: form.category, type: 'item' }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setForm(prev => ({
        ...prev,
        title: data.title ?? prev.title,
        description: data.description ?? prev.description,
      }))
      toast.success('Claude improved your listing copy')
    } catch {
      toast.error('AI assist failed — check your API key is set in Vercel')
    } finally {
      setAiAssisting(false)
    }
  }

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 4 - images.length)
    if (files.length === 0) return
    const newPreviews = files.map(f => URL.createObjectURL(f))
    setImages(prev => [...prev, ...files].slice(0, 4))
    setPreviews(prev => [...prev, ...newPreviews].slice(0, 4))
  }

  function removeImage(i: number) {
    URL.revokeObjectURL(previews[i])
    setImages(prev => prev.filter((_, idx) => idx !== i))
    setPreviews(prev => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.category) {
      toast.error('Title and category are required')
      return
    }

    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      // Guest: show preview instead of redirecting to login
      if (!user) {
        setPreview(true)
        setSaving(false)
        return
      }

      // Upload images
      const uploadedUrls: string[] = []
      for (const file of images) {
        const ext = file.name.split('.').pop() ?? 'jpg'
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: upErr } = await supabase.storage
          .from('listing-images')
          .upload(path, file, { contentType: file.type })
        if (upErr) {
          toast.error(`Image upload failed: ${upErr.message}`)
          setSaving(false)
          return
        }
        const { data: { publicUrl } } = supabase.storage
          .from('listing-images')
          .getPublicUrl(path)
        uploadedUrls.push(publicUrl)
      }

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
        images: uploadedUrls,
        status: 'active',
      }).select().single()

      if (error) throw error
      toast.success('Listed!')
      window.location.href = `/listings/${data.id}`
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create listing')
      setSaving(false)
    }
  }

  // ── Guest preview screen ───────────────────────────────────────────────────
  if (preview) {
    return (
      <>
        <TopBar title="Preview" back />
        <main style={{ maxWidth: 560, margin: '0 auto', padding: '24px 16px 80px' }}>

          {/* Preview card */}
          <div style={{
            background: 'var(--surf)', border: '1px solid var(--brd)',
            borderRadius: 'var(--rl)', overflow: 'hidden', marginBottom: 20,
          }}>
            {/* Photo placeholder or preview */}
            {previews.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previews[0]} alt={form.title} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
            ) : (
              <div style={{
                aspectRatio: '4/3', background: 'var(--bg2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 64, color: 'var(--faint)',
              }}>
                ◻
              </div>
            )}

            <div style={{ padding: '20px 16px' }}>
              {/* Condition badge */}
              <div style={{ marginBottom: 10 }}>
                <span style={{
                  fontFamily: 'var(--font-dm-mono)', fontSize: 10,
                  padding: '4px 10px', borderRadius: 99,
                  background: 'var(--bg2)', border: '1px solid var(--brd)', color: 'var(--muted)',
                }}>
                  {conditionLabel(form.condition)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                <h1 style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 22, color: 'var(--ink)', lineHeight: 1.2 }}>
                  {form.title || 'Your listing title'}
                </h1>
                {(form.valueLow || form.valueHigh) && (
                  <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 18, fontWeight: 500, color: 'var(--red)', flexShrink: 0 }}>
                    £{form.valueLow}{form.valueHigh && form.valueHigh !== form.valueLow ? `–${form.valueHigh}` : ''}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {[form.category, form.location].filter(Boolean).map(tag => (
                  <span key={tag} style={{
                    fontFamily: 'var(--font-dm-mono)', fontSize: 10,
                    padding: '4px 10px', borderRadius: 99,
                    background: 'var(--bg2)', border: '1px solid var(--brd)', color: 'var(--muted)',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {form.description && (
                <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 12 }}>
                  {form.description}
                </p>
              )}

              {form.wants && (
                <div>
                  <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--faint)', marginBottom: 6 }}>
                    What they&apos;ll accept
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {form.wants.split(',').map(w => w.trim()).filter(Boolean).map(w => (
                      <span key={w} style={{
                        fontFamily: 'var(--font-dm-mono)', fontSize: 11,
                        padding: '4px 10px', borderRadius: 99,
                        background: 'var(--gbg)', border: '1px solid var(--gbd)', color: 'var(--grn)',
                      }}>
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div style={{
            background: 'var(--gbg)', border: '1px solid var(--gbd)',
            borderRadius: 'var(--rl)', padding: '20px', textAlign: 'center', marginBottom: 16,
          }}>
            <div style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 20, color: 'var(--ink)', marginBottom: 6 }}>
              Looking good!
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16 }}>
              Create a free account to publish this listing and start receiving offers.
            </p>
            <Link href="/signup?next=/list" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '14px', borderRadius: 99, marginBottom: 10,
              background: 'var(--red)', border: '1px solid #A8251F',
              color: 'white', fontSize: 15, fontWeight: 500, textDecoration: 'none',
            }}>
              Create account to publish →
            </Link>
            <button
              onClick={() => setPreview(false)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--muted)',
                textDecoration: 'underline', textUnderlineOffset: 3,
              }}
            >
              ← Edit listing
            </button>
          </div>

          <div style={{
            padding: '12px', borderRadius: 'var(--r)',
            background: 'var(--bg2)', border: '1px solid var(--brd)',
            fontSize: 11, color: 'var(--faint)', lineHeight: 1.6, textAlign: 'center',
          }}>
            Free to list. No fees. Trades logged on the public ledger.
          </div>
        </main>
      </>
    )
  }

  // ── Form ──────────────────────────────────────────────────────────────────
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
              type="text" value={form.title} onChange={set('title')}
              placeholder="e.g. Sony WH-1000XM4 headphones"
              required maxLength={120} style={inputStyle}
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
              <input type="number" value={form.valueLow} onChange={set('valueLow')} placeholder="Min" min="0" style={{ ...inputStyle, flex: 1 }} />
              <span style={{ color: 'var(--faint)' }}>—</span>
              <input type="number" value={form.valueHigh} onChange={set('valueHigh')} placeholder="Max" min="0" style={{ ...inputStyle, flex: 1 }} />
            </div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)', marginTop: 6 }}>
              The value gap logic uses these to suggest fair trades
            </p>
          </div>

          {/* Description */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Description</label>
              <button
                type="button"
                onClick={handleAiAssist}
                disabled={aiAssisting}
                style={{
                  border: '1px solid var(--blubd)', background: 'var(--blubg)', color: 'var(--blu)',
                  borderRadius: 99, padding: '4px 10px', fontFamily: 'var(--font-dm-mono)', fontSize: 10,
                  cursor: aiAssisting ? 'not-allowed' : 'pointer', opacity: aiAssisting ? 0.6 : 1,
                }}
              >
                {aiAssisting ? 'Thinking…' : '✦ Improve with Claude'}
              </button>
            </div>
            <textarea
              value={form.description} onChange={set('description')}
              placeholder="Condition details, what's included, any defects…"
              rows={4} maxLength={2000}
              style={{ ...inputStyle, resize: 'none', minHeight: 100 }}
            />
          </div>

          {/* Photos */}
          <div>
            <label style={labelStyle}>Photos (up to 4)</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {previews.map((src, i) => (
                <div key={i} style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Photo ${i + 1}`} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--brd)' }} />
                  <button type="button" onClick={() => removeImage(i)} style={{
                    position: 'absolute', top: -6, right: -6,
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'var(--ink)', color: 'white',
                    border: 'none', cursor: 'pointer',
                    fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }} aria-label="Remove photo">
                    ×
                  </button>
                </div>
              ))}
              {previews.length < 4 && (
                <button type="button" onClick={() => fileInputRef.current?.click()} style={{
                  width: 80, height: 80, borderRadius: 8,
                  border: '1.5px dashed var(--brd2)', background: 'var(--surf)',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 4, color: 'var(--faint)',
                }}>
                  <span style={{ fontSize: 22 }}>+</span>
                  <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.04em' }}>PHOTO</span>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} />
          </div>

          {/* Wants */}
          <div>
            <label style={labelStyle}>What will you accept in return?</label>
            <input
              type="text" value={form.wants} onChange={set('wants')}
              placeholder="e.g. Camera gear, vinyl, fiction books, open to offers"
              maxLength={300} style={inputStyle}
            />
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)', marginTop: 6 }}>
              Shows on your listing as &quot;What gets accepted&quot; — be specific for better offers
            </p>
          </div>

          {/* Location */}
          <div>
            <label style={labelStyle}>Location</label>
            <input type="text" value={form.location} onChange={set('location')} placeholder="e.g. London, Manchester" style={inputStyle} />
          </div>

          {/* Submit */}
          <div style={{ paddingTop: 8 }}>
            <button type="submit" disabled={saving} style={{
              width: '100%', padding: '14px', borderRadius: 99,
              background: saving ? 'var(--brd2)' : 'var(--red)',
              border: `1px solid ${saving ? 'var(--brd2)' : '#A8251F'}`,
              color: 'white', fontSize: 16, fontWeight: 500,
              cursor: saving ? 'not-allowed' : 'pointer',
            }}>
              {saving ? 'Listing…' : 'List item →'}
            </button>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)', textAlign: 'center', marginTop: 10 }}>
              You&apos;ll see a preview first — no account needed to try it
            </p>
          </div>
        </form>
      </main>
    </>
  )
}
