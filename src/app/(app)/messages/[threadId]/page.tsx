'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/layout/TopBar'
import { Avatar } from '@/components/ui/Avatar'
import { Chip } from '@/components/ui/Chip'
import { ValueGapBadge } from '@/components/ui/ValueGapBadge'
import { formatRelativeTime, formatValueRange } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Message, Thread, Offer } from '@/types'

interface Props {
  params: { threadId: string }
}

export default function ThreadPage({ params }: Props) {
  const supabase = createClient()
  const bottomRef = useRef<HTMLDivElement>(null)

  const [userId, setUserId] = useState<string | null>(null)
  const [thread, setThread] = useState<Thread | null>(null)
  const [offer, setOffer] = useState<Offer | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setAuthChecked(true)
        return
      }
      setUserId(user.id)
      setAuthChecked(true)

      const [{ data: threadData }, { data: msgData }, { data: offerData }] = await Promise.all([
        supabase
          .from('threads')
          .select(`
            *,
            listing:listings(*, profile:profiles(id, handle, display_name, avatar_url, tier))
          `)
          .eq('id', params.threadId)
          .single(),
        supabase
          .from('messages')
          .select('*, from_profile:profiles(id, handle, display_name, avatar_url)')
          .eq('thread_id', params.threadId)
          .order('created_at', { ascending: true }),
        supabase
          .from('offers')
          .select(`
            *,
            from_profile:profiles!from_user_id(id, handle, display_name, avatar_url, tier)
          `)
          .eq('thread_id', params.threadId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ])

      setThread(threadData as Thread)
      setMessages((msgData ?? []) as Message[])
      setOffer(offerData as Offer | null)
    }
    load()
  }, [params.threadId])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`thread:${params.threadId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `thread_id=eq.${params.threadId}` },
        (payload) => setMessages(prev => [...prev, payload.new as Message])
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [params.threadId])

  async function sendMessage() {
    if (!draft.trim() || !userId) return
    setSending(true)
    const { error } = await supabase.from('messages').insert({
      thread_id: params.threadId,
      from_user_id: userId,
      content: draft.trim(),
    })
    if (error) toast.error('Failed to send')
    else setDraft('')
    setSending(false)
  }

  async function respondOffer(action: 'accepted' | 'declined') {
    if (!offer) return
    const { error } = await supabase
      .from('offers')
      .update({ status: action })
      .eq('id', offer.id)

    if (error) { toast.error('Failed'); return }
    setOffer({ ...offer, status: action })
    toast.success(action === 'accepted' ? 'Offer accepted!' : 'Offer declined')

    // System message
    await supabase.from('messages').insert({
      thread_id: params.threadId,
      from_user_id: userId!,
      content: action === 'accepted'
        ? 'Offer accepted. Let\'s coordinate meetup or shipping.'
        : 'Offer declined.',
    })
  }

  async function completeOffer() {
    if (!offer) return
    const { error } = await supabase
      .from('offers')
      .update({ status: 'completed' })
      .eq('id', offer.id)

    if (error) { toast.error('Failed'); return }
    setOffer({ ...offer, status: 'completed' })
    toast.success('Trade completed! 🎉')
  }

  const listing = thread?.listing as { id: string; title: string; value_estimate_low: number | null; value_estimate_high: number | null } | undefined

  if (authChecked && !userId) {
    return (
      <div className="min-h-screen bg-bg">
        <TopBar title="Trade thread" back="/messages" />
        <main className="max-w-2xl mx-auto px-4 py-6">
          <div className="card p-4">
            <div className="text-xs font-mono uppercase tracking-wider text-muted-2 mb-2">Commit-time signup</div>
            <h1 className="font-semibold text-base mb-2">Sign in to open this private thread</h1>
            <p className="text-sm text-muted mb-3">
              Profiles and listings are public. Direct conversations are private to trade participants.
            </p>
            <div className="flex gap-2">
              <Link href="/browse" className="btn">Browse listings</Link>
              <Link href={`/login?next=/messages/${params.threadId}`} className="btn btn-primary">Sign in</Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title={listing?.title ?? 'Thread'} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-36 max-w-2xl mx-auto w-full space-y-3">
        {messages.map(msg => {
          const isMe = msg.from_user_id === userId
          return (
            <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
              {!isMe && (
                <div className="mt-1">
                  <Avatar
                    src={(msg.from_profile as { avatar_url?: string } | undefined)?.avatar_url}
                    alt=""
                    size="sm"
                  />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-lg px-3.5 py-2.5 text-sm ${
                  isMe
                    ? 'bg-red-muted border border-red-border ml-auto'
                    : 'bg-surface-2 border border-stroke'
                }`}
              >
                <p>{msg.content}</p>
                <div className="text-muted-2 text-[10px] font-mono mt-1">
                  {formatRelativeTime(msg.created_at)}
                </div>
              </div>
            </div>
          )
        })}

        {/* Offer card */}
        {offer && (
          <div className="card p-4 border-stroke-2">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-sm">Offer</div>
              <Chip
                variant={
                  offer.status === 'accepted' || offer.status === 'completed' ? 'green' :
                  offer.status === 'declined' ? 'red' : 'default'
                }
              >
                {offer.status}
              </Chip>
            </div>

            {/* Offered items */}
            <div className="mb-3">
              <div className="label mb-1.5">Offering</div>
              <div className="flex flex-wrap gap-2">
                {(offer.offered_items ?? []).map((item, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-medium">{item.title}</span>
                    <span className="text-muted ml-1">
                      ({formatValueRange(item.value_low, item.value_high)})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {offer.topup_amount && (
              <div className="mb-3 text-sm text-muted">
                + {offer.topup_amount} {offer.topup_currency} top-up intent (off-platform)
              </div>
            )}

            {/* Value gap */}
            {listing && (
              <div className="mb-3">
                <ValueGapBadge
                  offeredMid={
                    (offer.offered_items ?? []).reduce((s, i) => {
                      const lo = i.value_low ?? 0
                      const hi = i.value_high ?? lo
                      return s + (lo + hi) / 2
                    }, 0) + (offer.topup_amount ?? 0)
                  }
                  targetMid={
                    ((listing.value_estimate_low ?? 0) + (listing.value_estimate_high ?? listing.value_estimate_low ?? 0)) / 2
                  }
                />
              </div>
            )}

            {/* Actions */}
            {offer.status === 'pending' && offer.to_user_id === userId && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => respondOffer('accepted')}
                  className="btn btn-primary flex-1 text-sm"
                >
                  Accept
                </button>
                <button
                  onClick={() => respondOffer('declined')}
                  className="btn btn-ghost flex-1 text-sm"
                >
                  Decline
                </button>
              </div>
            )}

            {offer.status === 'accepted' && (
              <button
                onClick={completeOffer}
                className="btn btn-green w-full mt-3 text-sm"
              >
                Mark trade complete
              </button>
            )}

            {listing && (
              <Link
                href={`/listings/${(thread?.listing as { id: string })?.id}`}
                className="btn btn-ghost w-full mt-2 text-sm"
              >
                View listing →
              </Link>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Message input */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg/95 backdrop-blur-xl border-t border-stroke px-4 py-3 pb-safe">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="Message…"
            className="input flex-1 text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={sending || !draft.trim()}
            className="btn btn-primary px-4"
          >
            Send
          </button>
          {listing && (
            <Link href={`/offer/${(thread?.listing as { id: string })?.id}`} className="btn text-sm px-3">
              Offer
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
