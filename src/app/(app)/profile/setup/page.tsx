'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/layout/TopBar'
import toast from 'react-hot-toast'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  border: '1px solid var(--brd)', borderRadius: 'var(--r)',
  background: 'var(--surf)', color: 'var(--ink)',
  fontSize: 14, outline: 'none', fontFamily: 'var(--font-dm-sans)',
  boxSizing: 'border-box',
}

export default function ProfileSetupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({ handle: '', display_name: '', bio: '', location: '' })
  const [saving, setSaving] = useState(false)
  const [checking, setChecking] = useState(false)
  const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      setUserId(user.id)
      // Pre-fill display name from auth metadata if available
      const name = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? ''
      setForm(prev => ({ ...prev, display_name: name }))
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function checkHandle(handle: string) {
    if (handle.length < 3) { setHandleAvailable(null); return }
    setChecking(true)
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('handle', handle)
      .maybeSingle()
    setHandleAvailable(!data)
    setChecking(false)
  }

  function onHandleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 32)
    setForm(prev => ({ ...prev, handle: val }))
    setHandleAvailable(null)
    clearTimeout((window as { _ht?: ReturnType<typeof setTimeout> })._ht)
    ;(window as { _ht?: ReturnType<typeof setTimeout> })._ht = setTimeout(() => checkHandle(val), 500)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.handle || form.handle.length < 3) { toast.error('Handle must be at least 3 characters'); return }
    if (handleAvailable === false) { toast.error('That handle is taken'); return }
    if (!userId) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          handle: form.handle,
          display_name: form.display_name || null,
          bio: form.bio || null,
          location: form.location || null,
        })

      if (error) throw error
      toast.success('Profile created!')
      router.push(`/profile/${form.handle}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <TopBar title="Set up your profile" />
      <main style={{ maxWidth: 480, margin: '0 auto', padding: '24px 16px 80px', width: '100%' }}>
        <div style={{
          background: 'var(--surf)', border: '1px solid var(--brd)',
          borderRadius: 'var(--rl)', padding: 20, marginBottom: 20,
        }}>
          <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
            One-time setup
          </p>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
            Choose your handle and personalise your profile. You can update everything later.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Handle */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--ink2)', marginBottom: 6 }}>
              Handle *
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                fontFamily: 'var(--font-dm-mono)', fontSize: 14, color: 'var(--faint)',
                pointerEvents: 'none',
              }}>@</span>
              <input
                type="text"
                value={form.handle}
                onChange={onHandleChange}
                placeholder="yourhandle"
                required
                minLength={3}
                style={{ ...inputStyle, paddingLeft: 28 }}
              />
              {form.handle.length >= 3 && (
                <span style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  fontFamily: 'var(--font-dm-mono)', fontSize: 11,
                  color: checking ? 'var(--faint)' : handleAvailable ? '#16a34a' : 'var(--red)',
                }}>
                  {checking ? '…' : handleAvailable === true ? '✓ available' : handleAvailable === false ? '✗ taken' : ''}
                </span>
              )}
            </div>
            <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)', marginTop: 4 }}>
              Letters, numbers, underscores only. Min 3 chars.
            </p>
          </div>

          {/* Display name */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--ink2)', marginBottom: 6 }}>
              Display name
            </label>
            <input
              type="text"
              value={form.display_name}
              onChange={e => setForm(prev => ({ ...prev, display_name: e.target.value }))}
              placeholder="Your name"
              maxLength={60}
              style={inputStyle}
            />
          </div>

          {/* Bio */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--ink2)', marginBottom: 6 }}>
              Bio
            </label>
            <textarea
              value={form.bio}
              onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell traders a bit about yourself…"
              rows={3}
              maxLength={300}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Location */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--ink2)', marginBottom: 6 }}>
              Location
            </label>
            <input
              type="text"
              value={form.location}
              onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
              placeholder="City or region"
              maxLength={80}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={saving || handleAvailable === false || form.handle.length < 3}
            style={{
              padding: '13px', borderRadius: 99, border: '1px solid var(--rbn)',
              background: saving || handleAvailable === false ? 'rgba(197,48,48,0.45)' : 'var(--red)',
              color: 'white', fontSize: 15, fontWeight: 500, cursor: 'pointer',
              fontFamily: 'var(--font-dm-sans)',
            }}
          >
            {saving ? 'Creating…' : 'Create profile →'}
          </button>
        </form>
      </main>
    </>
  )
}
