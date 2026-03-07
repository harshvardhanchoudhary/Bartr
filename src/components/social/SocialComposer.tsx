'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Avatar } from '@/components/ui/Avatar'
import toast from 'react-hot-toast'
import type { Profile } from '@/types'

const POST_TYPES = [
  { value: 'trade_win', label: 'Trade win' },
  { value: 'looking_for', label: 'Looking for' },
  { value: 'accepted_pattern', label: 'What I accept' },
]

interface Props {
  onPost?: () => void
}

export function SocialComposer({ onPost }: Props) {
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState('')
  const [type, setType] = useState('trade_win')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('id, handle, display_name, avatar_url, tier')
        .eq('id', user.id)
        .single()
      if (data) setProfile(data as Profile)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handlePost(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim() || !profile) return
    setPosting(true)
    try {
      const { error } = await supabase
        .from('social_posts')
        .insert({
          user_id: profile.id,
          type,
          content: content.trim(),
          like_count: 0,
          comment_count: 0,
        })
      if (error) throw error
      toast.success('Posted!')
      setContent('')
      setOpen(false)
      onPost?.()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to post')
    } finally {
      setPosting(false)
    }
  }

  // Not logged in — show link to sign up
  if (profile === null) {
    return (
      <a
        href="/login?next=/social"
        className="card p-4 flex items-center gap-3 hover:border-stroke-2 transition-colors"
      >
        <div className="avatar-md bg-surface-2 border border-stroke rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-muted-2">+</span>
        </div>
        <span className="text-muted text-sm">Share a trade win, pattern, or offer…</span>
      </a>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="card p-4 flex items-center gap-3 hover:border-stroke-2 transition-colors w-full text-left"
      >
        <Avatar
          src={profile.avatar_url}
          alt={profile.display_name ?? profile.handle}
          size="md"
        />
        <span className="text-muted text-sm">Share a trade win, pattern, or offer…</span>
      </button>
    )
  }

  return (
    <form onSubmit={handlePost} className="card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Avatar
          src={profile.avatar_url}
          alt={profile.display_name ?? profile.handle}
          size="md"
        />
        <div className="flex gap-1.5">
          {POST_TYPES.map(pt => (
            <button
              key={pt.value}
              type="button"
              onClick={() => setType(pt.value)}
              className="text-xs px-2.5 py-1 rounded-full border font-mono transition-colors"
              style={
                type === pt.value
                  ? { background: 'var(--rbg)', color: 'var(--red)', borderColor: 'var(--rbd)' }
                  : { color: 'var(--muted)', borderColor: 'var(--brd)' }
              }
            >
              {pt.label}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder={
          type === 'trade_win' ? 'What did you trade? How did it go?'
          : type === 'looking_for' ? 'What are you hunting for right now?'
          : 'What kinds of items do you typically accept?'
        }
        className="w-full resize-none text-sm leading-relaxed"
        style={{
          border: 'none', outline: 'none', background: 'transparent',
          color: 'var(--ink)', fontFamily: 'var(--font-dm-sans)',
          minHeight: 80,
        }}
        rows={3}
        maxLength={1000}
        autoFocus
        required
      />

      <div className="flex items-center justify-between pt-1 border-t border-stroke">
        <span className="text-xs text-muted-2 font-mono">{content.length}/1000</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setOpen(false); setContent('') }}
            className="btn btn-ghost text-xs px-3 py-1.5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={posting || !content.trim()}
            className="btn btn-primary text-xs px-4 py-1.5"
            style={posting || !content.trim() ? { opacity: 0.5 } : {}}
          >
            {posting ? 'Posting…' : 'Post'}
          </button>
        </div>
      </div>
    </form>
  )
}
