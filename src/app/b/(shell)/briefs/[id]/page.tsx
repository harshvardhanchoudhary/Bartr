'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { BTopBar } from '@/components/b/BTopBar'
import { Avatar } from '@/components/ui/Avatar'
import { TierBadge } from '@/components/ui/TierBadge'
import { formatRelativeTime } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Brief, Application } from '@/types/bartr-b'
import type { User } from '@supabase/supabase-js'

interface Props {
  params: { id: string }
}

export default function BriefDetailPage({ params }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [brief, setBrief] = useState<Brief | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [myApplication, setMyApplication] = useState<Application | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [showApplyForm, setShowApplyForm] = useState(false)

  const [applyForm, setApplyForm] = useState({
    coverNote: '',
    proposedCredits: '',
    proposedTimelineDays: '',
  })

  useEffect(() => {
    async function load() {
      const [{ data: { user } }, { data: briefData }] = await Promise.all([
        supabase.auth.getUser(),
        supabase
          .from('briefs')
          .select(`*, profile:profiles(id, handle, display_name, avatar_url, tier, trade_count, verified_id)`)
          .eq('id', params.id)
          .single(),
      ])

      setUser(user)

      if (!briefData) { router.push('/b/briefs'); return }
      setBrief(briefData as Brief)

      if (user) {
        // Fetch applications (owner sees all, others see own)
        const appQuery = supabase
          .from('brief_applications')
          .select(`*, profile:profiles(id, handle, display_name, avatar_url, tier, trade_count, verified_id)`)
          .eq('brief_id', params.id)
          .order('created_at', { ascending: false })

        const { data: apps } = briefData.user_id === user.id
          ? await appQuery
          : await appQuery.eq('applicant_id', user.id)

        if (apps) {
          setApplications(apps as Application[])
          const mine = (apps as Application[]).find(a => a.applicant_id === user.id)
          if (mine) setMyApplication(mine)
        }
      }

      setLoading(false)
    }
    load()
  }, [params.id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleApply(e: React.FormEvent) {
    e.preventDefault()
    if (!user) { router.push(`/login?next=/b/briefs/${params.id}`); return }
    if (!applyForm.coverNote || !applyForm.proposedCredits) {
      toast.error('Cover note and proposed credits are required')
      return
    }

    setApplying(true)
    try {
      const { error } = await supabase
        .from('brief_applications')
        .insert({
          brief_id: params.id,
          applicant_id: user.id,
          cover_note: applyForm.coverNote,
          proposed_credits: parseInt(applyForm.proposedCredits),
          proposed_timeline_days: applyForm.proposedTimelineDays
            ? parseInt(applyForm.proposedTimelineDays)
            : null,
          status: 'pending',
        })

      if (error) throw error

      // Increment application count
      await supabase
        .from('briefs')
        .update({ application_count: (brief?.application_count ?? 0) + 1 })
        .eq('id', params.id)

      toast.success('Application sent!')
      setShowApplyForm(false)
      setBrief(prev => prev ? { ...prev, application_count: (prev.application_count ?? 0) + 1 } : prev)

      // Re-fetch own application
      const { data: app } = await supabase
        .from('brief_applications')
        .select('*')
        .eq('brief_id', params.id)
        .eq('applicant_id', user.id)
        .single()
      if (app) setMyApplication(app as Application)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to apply'
      toast.error(msg)
    } finally {
      setApplying(false)
    }
  }

  async function acceptApplication(appId: string, applicantId: string) {
    try {
      await Promise.all([
        supabase
          .from('brief_applications')
          .update({ status: 'accepted' })
          .eq('id', appId),
        supabase
          .from('briefs')
          .update({ status: 'matched', selected_application_id: appId })
          .eq('id', params.id),
        // Decline all others
        supabase
          .from('brief_applications')
          .update({ status: 'declined' })
          .eq('brief_id', params.id)
          .neq('id', appId),
      ])

      toast.success('Application accepted! Brief is now matched.')
      setApplications(prev =>
        prev.map(a => ({
          ...a,
          status: a.id === appId ? 'accepted' : 'declined',
        }))
      )
      setBrief(prev => prev ? { ...prev, status: 'matched', selected_application_id: appId } : prev)
    } catch {
      toast.error('Failed to accept application')
    }
  }

  if (loading) {
    return (
      <>
        <BTopBar title="Brief" back />
        <main className="max-w-2xl mx-auto px-4 py-8 text-center text-muted">Loading…</main>
      </>
    )
  }

  if (!brief) return null

  const isOwner = user?.id === brief.user_id
  const canApply = user && !isOwner && brief.status === 'open' && !myApplication
  const isMatched = brief.status === 'matched'

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    open: { bg: 'rgba(45,106,79,0.12)', text: 'var(--grn)', label: 'Open' },
    matched: { bg: 'rgba(29,95,168,0.12)', text: '#1D5FA8', label: 'Matched' },
    in_progress: { bg: 'rgba(29,95,168,0.12)', text: '#1D5FA8', label: 'In progress' },
    completed: { bg: 'rgba(154,108,24,0.12)', text: '#9A6C18', label: 'Completed' },
    disputed: { bg: 'rgba(196,49,42,0.12)', text: '#C4312A', label: 'Disputed' },
  }
  const statusStyle = statusColors[brief.status] ?? statusColors.open

  return (
    <>
      <BTopBar title="Brief" back />

      <main className="max-w-2xl mx-auto px-4 py-4 pb-36 space-y-4">

        {/* Brief header */}
        <div
          className="rounded-md border p-4"
          style={{ background: 'rgba(45,106,79,0.06)', borderColor: 'rgba(45,106,79,0.20)' }}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  className="font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: '#52B788' }}
                >
                  {brief.category}
                </span>
                <span
                  className="font-mono text-[10px] px-2 py-0.5 rounded-full border"
                  style={{ background: statusStyle.bg, color: statusStyle.text, borderColor: statusStyle.text + '44' }}
                >
                  {statusStyle.label}
                </span>
              </div>
              <h1 className="text-xl font-semibold leading-snug">{brief.title}</h1>
            </div>
            {brief.budget_credits && (
              <div
                className="font-mono text-lg font-medium flex-shrink-0 text-right"
                style={{ color: 'var(--grn)' }}
              >
                {brief.budget_credits}c
                <div className="text-xs font-normal" style={{ color: '#52B788' }}>budget</div>
              </div>
            )}
          </div>

          {brief.skills_needed?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {brief.skills_needed.map(skill => (
                <span
                  key={skill}
                  className="text-xs font-mono px-2 py-1 rounded-full border"
                  style={{
                    background: 'rgba(45,106,79,0.12)',
                    borderColor: 'rgba(45,106,79,0.30)',
                    color: '#52B788',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="card p-4">
          <div className="label mb-2">What they need</div>
          <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">{brief.description}</p>
          {brief.deadline && (
            <p className="text-xs text-muted-2 mt-3 font-mono">
              Deadline: {new Date(brief.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}
          <p className="text-xs text-muted-2 mt-1 font-mono">
            Posted {formatRelativeTime(brief.created_at)}
            {(brief.application_count ?? 0) > 0 && ` · ${brief.application_count} applied`}
          </p>
        </div>

        {/* Posted by */}
        {brief.profile && (
          <div className="card p-4">
            <div className="label mb-3">Posted by</div>
            <Link
              href={`/b/profile/${brief.profile.handle}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Avatar
                src={brief.profile.avatar_url}
                alt={brief.profile.display_name ?? brief.profile.handle}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-sm">
                    {brief.profile.display_name ?? brief.profile.handle}
                  </span>
                  <TierBadge tier={brief.profile.tier} />
                </div>
                <div className="text-xs text-muted font-mono">{brief.profile.handle}</div>
              </div>
              <span className="text-muted-2">→</span>
            </Link>
          </div>
        )}

        {/* My application status (non-owner) */}
        {myApplication && (
          <div
            className="card p-4"
            style={
              myApplication.status === 'accepted'
                ? { background: 'rgba(45,106,79,0.08)', borderColor: 'rgba(45,106,79,0.30)' }
                : myApplication.status === 'declined'
                  ? { background: 'rgba(196,49,42,0.06)', borderColor: 'rgba(196,49,42,0.20)' }
                  : {}
            }
          >
            <div className="label mb-2">Your application</div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-mono font-medium" style={{ color: '#52B788' }}>
                {myApplication.proposed_credits}c proposed
              </span>
              <span
                className="text-xs font-mono px-2 py-0.5 rounded-full border"
                style={
                  myApplication.status === 'accepted'
                    ? { background: 'rgba(45,106,79,0.15)', color: 'var(--grn)', borderColor: 'rgba(45,106,79,0.40)' }
                    : myApplication.status === 'declined'
                      ? { background: 'rgba(196,49,42,0.10)', color: '#C4312A', borderColor: 'rgba(196,49,42,0.30)' }
                      : { background: 'rgba(154,108,24,0.10)', color: '#9A6C18', borderColor: 'rgba(154,108,24,0.30)' }
                }
              >
                {myApplication.status}
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed">{myApplication.cover_note}</p>
            {myApplication.proposed_timeline_days && (
              <p className="text-xs text-muted-2 mt-2 font-mono">
                {myApplication.proposed_timeline_days} day timeline proposed
              </p>
            )}
          </div>
        )}

        {/* Applications list (owner view) */}
        {isOwner && applications.length > 0 && (
          <div className="card p-4">
            <div className="label mb-3">{applications.length} application{applications.length !== 1 ? 's' : ''}</div>
            <div className="space-y-4">
              {applications.map(app => (
                <div
                  key={app.id}
                  className="rounded border p-3"
                  style={{ background: 'rgba(45,106,79,0.04)', borderColor: 'rgba(45,106,79,0.15)' }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    {app.profile && (
                      <Link
                        href={`/b/profile/${app.profile.handle}`}
                        className="flex items-center gap-2 hover:opacity-80"
                      >
                        <Avatar
                          src={app.profile.avatar_url}
                          alt={app.profile.display_name ?? app.profile.handle}
                          size="sm"
                        />
                        <div>
                          <div className="text-sm font-medium">
                            {app.profile.display_name ?? app.profile.handle}
                          </div>
                          <div className="text-xs text-muted-2 font-mono">{app.profile.handle}</div>
                        </div>
                      </Link>
                    )}
                    <div className="text-right flex-shrink-0">
                      <div className="font-mono text-sm font-medium" style={{ color: 'var(--grn)' }}>
                        {app.proposed_credits}c
                      </div>
                      {app.proposed_timeline_days && (
                        <div className="text-xs text-muted-2 font-mono">{app.proposed_timeline_days}d</div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-muted leading-relaxed mb-3">{app.cover_note}</p>

                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded-full border"
                      style={
                        app.status === 'accepted'
                          ? { background: 'rgba(45,106,79,0.15)', color: 'var(--grn)', borderColor: 'rgba(45,106,79,0.40)' }
                          : app.status === 'declined'
                            ? { background: 'rgba(196,49,42,0.10)', color: '#C4312A', borderColor: 'rgba(196,49,42,0.30)' }
                            : { background: 'rgba(154,108,24,0.10)', color: '#9A6C18', borderColor: 'rgba(154,108,24,0.30)' }
                      }
                    >
                      {app.status}
                    </span>

                    {app.status === 'pending' && !isMatched && (
                      <button
                        onClick={() => acceptApplication(app.id, app.applicant_id)}
                        className="text-xs px-3 py-1.5 rounded-full border font-medium transition-colors"
                        style={{
                          background: 'rgba(45,106,79,0.80)',
                          borderColor: 'rgba(45,106,79,0.55)',
                          color: 'white',
                        }}
                      >
                        Accept
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isOwner && applications.length === 0 && brief.status === 'open' && (
          <div className="card p-4 text-center py-8">
            <div className="text-3xl mb-3" style={{ color: 'rgba(45,106,79,0.4)' }}>◎</div>
            <p className="text-sm text-muted">No applications yet. Check back soon.</p>
          </div>
        )}

      </main>

      {/* CTA: Apply (non-owner, open brief) */}
      {(canApply || showApplyForm) && (
        <div
          className="fixed bottom-20 left-0 right-0 px-4 pb-4"
          style={{ background: 'linear-gradient(to top, var(--bg) 60%, transparent)' }}
        >
          <div className="max-w-2xl mx-auto">
            {showApplyForm ? (
              <form onSubmit={handleApply} className="card p-4 space-y-3">
                <div className="label mb-0">Apply to this brief</div>

                <div>
                  <label className="label text-[10px]">Your proposal *</label>
                  <textarea
                    value={applyForm.coverNote}
                    onChange={e => setApplyForm(p => ({ ...p, coverNote: e.target.value }))}
                    placeholder="Why you're a great fit, what you'd deliver, your approach…"
                    className="textarea text-sm"
                    rows={4}
                    required
                    maxLength={2000}
                  />
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="label text-[10px]">Credits you want *</label>
                    <input
                      type="number"
                      value={applyForm.proposedCredits}
                      onChange={e => setApplyForm(p => ({ ...p, proposedCredits: e.target.value }))}
                      placeholder={brief.budget_credits ? `Budget: ${brief.budget_credits}c` : 'e.g. 150'}
                      className="input"
                      min="1"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="label text-[10px]">Days to deliver</label>
                    <input
                      type="number"
                      value={applyForm.proposedTimelineDays}
                      onChange={e => setApplyForm(p => ({ ...p, proposedTimelineDays: e.target.value }))}
                      placeholder="e.g. 7"
                      className="input"
                      min="1"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowApplyForm(false)}
                    className="flex-1 py-2.5 rounded-full text-sm border font-medium"
                    style={{ borderColor: 'var(--brd)', color: 'var(--muted)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="flex-2 px-6 py-2.5 rounded-full text-sm border font-medium"
                    style={{
                      flex: 2,
                      background: applying ? 'rgba(45,106,79,0.40)' : 'rgba(45,106,79,0.80)',
                      borderColor: 'rgba(45,106,79,0.55)',
                      color: 'white',
                    }}
                  >
                    {applying ? 'Sending…' : 'Send application'}
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => {
                  if (!user) { router.push(`/login?next=/b/briefs/${params.id}`); return }
                  setShowApplyForm(true)
                }}
                className="w-full py-3.5 rounded-full text-base font-medium border"
                style={{
                  background: 'rgba(45,106,79,0.80)',
                  borderColor: 'rgba(45,106,79,0.55)',
                  color: 'white',
                }}
              >
                Apply to this brief
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
