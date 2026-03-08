'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/layout/TopBar'
import { Avatar } from '@/components/ui/Avatar'
import { formatRelativeTime, formatValueRange } from '@/lib/utils'
import { DEMO_THREADS, type DemoThread, type DemoMessage } from '@/lib/demo-data'
import toast from 'react-hot-toast'
import type { Message, Thread, Offer } from '@/types'

interface Props {
  params: { threadId: string }
}

// ── Value gap bar helper ───────────────────────────────────────────────────────
function ValueBar({ offered, target }: { offered: number; target: number }) {
  const pct = target > 0 ? Math.min((offered / target) * 100, 100) : 0
  const gap = target > 0 ? offered / target : 0
  const color = gap >= 0.85 && gap <= 1.15 ? 'var(--grn)' : gap < 0.85 ? 'var(--red)' : 'var(--blu)'
  const label = gap >= 0.85 && gap <= 1.15 ? '✓ Fair trade'
    : gap < 0.7 ? '↓↓ Big value gap'
    : gap < 0.85 ? '↓ Offering less'
    : gap > 1.3 ? '↑↑ Offering a lot more'
    : '↑ Offering more'
  return (
    <div>
      <div style={{ height: 5, background: 'var(--brd)', borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.3s' }} />
      </div>
      <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color, display: 'flex', justifyContent: 'space-between' }}>
        <span>{label}</span>
        <span>~£{Math.round(offered)} vs £{Math.round(target)}</span>
      </div>
    </div>
  )
}

// ── Offer card ─────────────────────────────────────────────────────────────────
function OfferCard({
  offeredItems,
  topupAmount,
  topupCurrency,
  targetValueMid,
  status,
  onAccept,
  onDecline,
  onComplete,
  isReceiver,
}: {
  offeredItems: Array<{ title: string; value_low?: number | null; value_high?: number | null }>
  topupAmount?: number | null
  topupCurrency?: string | null
  targetValueMid: number
  status: string
  onAccept?: () => void
  onDecline?: () => void
  onComplete?: () => void
  isReceiver: boolean
}) {
  const offeredMid = offeredItems.reduce((sum, i) => {
    const lo = i.value_low ?? 0
    const hi = i.value_high ?? lo
    return sum + (lo + hi) / 2
  }, 0) + (topupAmount ?? 0)

  const statusColor = status === 'accepted' || status === 'completed' ? 'var(--grn)'
    : status === 'declined' ? 'var(--red)'
    : 'var(--muted)'

  return (
    <div style={{
      background: 'var(--surf)', border: '1px solid var(--brd)',
      borderRadius: 'var(--rl)', padding: '14px 16px', margin: '8px 0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Trade offer
        </span>
        <span style={{
          fontFamily: 'var(--font-dm-mono)', fontSize: 10,
          padding: '3px 9px', borderRadius: 99,
          background: status === 'pending' ? 'var(--bg2)' : status === 'accepted' || status === 'completed' ? 'var(--gbg)' : 'var(--rbg)',
          border: `1px solid ${status === 'pending' ? 'var(--brd)' : status === 'accepted' || status === 'completed' ? 'var(--gbd)' : 'var(--rbd)'}`,
          color: statusColor,
        }}>
          {status}
        </span>
      </div>

      {/* Offered items */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 6 }}>
          Offering
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {offeredItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{item.title}</span>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--muted)' }}>
                {formatValueRange(item.value_low ?? null, item.value_high ?? null)}
              </span>
            </div>
          ))}
          {topupAmount && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>+ Cash top-up intent</span>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--blu)' }}>
                £{topupAmount} {topupCurrency ?? 'GBP'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Value bar */}
      {targetValueMid > 0 && (
        <div style={{ marginBottom: 12 }}>
          <ValueBar offered={offeredMid} target={targetValueMid} />
        </div>
      )}

      {/* Actions */}
      {status === 'pending' && isReceiver && onAccept && onDecline && (
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button onClick={onAccept} style={{
            flex: 1, padding: '10px', borderRadius: 99,
            background: 'var(--grn)', border: '1px solid #136038',
            color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}>
            Accept ✓
          </button>
          <button onClick={onDecline} style={{
            flex: 1, padding: '10px', borderRadius: 99,
            border: '1px solid var(--brd)', background: 'var(--surf)',
            color: 'var(--muted)', fontSize: 13, cursor: 'pointer',
          }}>
            Decline
          </button>
        </div>
      )}

      {status === 'accepted' && isReceiver && onComplete && (
        <button onClick={onComplete} style={{
          width: '100%', padding: '10px', borderRadius: 99, marginTop: 4,
          background: 'var(--gbg)', border: '1px solid var(--gbd)',
          color: 'var(--grn)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
        }}>
          Mark trade complete →
        </button>
      )}

      {status === 'completed' && (
        <div style={{
          marginTop: 8, padding: '8px 12px', borderRadius: 'var(--r)',
          background: 'var(--gbg)', border: '1px solid var(--gbd)',
          fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--grn)',
          textAlign: 'center',
        }}>
          ✓ Trade logged on the public ledger
        </div>
      )}
    </div>
  )
}

// ── Message bubble ─────────────────────────────────────────────────────────────
function Bubble({ msg, isMe, avatarInitial }: { msg: { content: string; created_at: string; is_offer_summary?: boolean }; isMe: boolean; avatarInitial: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexDirection: isMe ? 'row-reverse' : 'row' }}>
      {!isMe && (
        <div style={{
          width: 30, height: 30, borderRadius: '50%', flexShrink: 0, marginTop: 2,
          background: 'var(--brd2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--muted)',
        }}>
          {avatarInitial}
        </div>
      )}
      <div style={{
        maxWidth: '75%', padding: '10px 13px', borderRadius: 'var(--rl)',
        background: isMe ? 'var(--rbg)' : 'var(--surf)',
        border: `1px solid ${isMe ? 'var(--rbd)' : 'var(--brd)'}`,
        fontStyle: msg.is_offer_summary ? 'italic' : 'normal',
      }}>
        <p style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.5 }}>{msg.content}</p>
        <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)', marginTop: 4 }}>
          {formatRelativeTime(msg.created_at)}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DEMO THREAD VIEW
// ─────────────────────────────────────────────────────────────────────────────

function DemoThreadView({ thread }: { thread: DemoThread }) {
  const [messages, setMessages] = useState<DemoMessage[]>(thread.messages)
  const [offerStatus, setOfferStatus] = useState(thread.offer.status)
  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function addSystemMsg(content: string) {
    const msg: DemoMessage = {
      id: `sys-${Date.now()}`,
      content,
      is_me: true,
      handle: 'you',
      display_name: 'You',
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, msg])
  }

  function handleAccept() {
    setOfferStatus('accepted')
    addSystemMsg("Offer accepted. Let's sort out the meetup!")
    toast.success('Offer accepted!')
  }

  function handleDecline() {
    setOfferStatus('declined')
    addSystemMsg('Offer declined.')
    toast('Offer declined.')
  }

  function handleComplete() {
    setOfferStatus('completed')
    addSystemMsg('Trade complete ✓ — logged on the public ledger.')
    toast.success('Trade logged!')
  }

  function sendDraft() {
    if (!draft.trim()) return
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      content: draft.trim(),
      is_me: true,
      handle: 'you',
      display_name: 'You',
      created_at: new Date().toISOString(),
    }])
    setDraft('')
    // Simulate reply after 1.5s
    const replies = [
      "Sounds good to me!",
      "Let me check my schedule.",
      "That works. Looking forward to it.",
      "Perfect — see you then!",
    ]
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `reply-${Date.now()}`,
        content: replies[Math.floor(Math.random() * replies.length)],
        is_me: false,
        handle: thread.other_handle,
        display_name: thread.other_display_name,
        created_at: new Date().toISOString(),
      }])
    }, 1500)
  }

  const targetMid = ((thread.listing.value_estimate_low ?? 0) + (thread.listing.value_estimate_high ?? thread.listing.value_estimate_low ?? 0)) / 2

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)' }}>
      <TopBar title={thread.listing.title} back />

      {/* Demo banner */}
      <div style={{
        padding: '8px 16px',
        background: 'var(--gldbg)', borderBottom: '1px solid var(--gldbd)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--gld)' }}>
          Sample conversation — type a message to try it out
        </span>
        <Link href="/signup" style={{
          fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--gld)',
          padding: '2px 9px', border: '1px solid var(--gldbd)',
          borderRadius: 99, textDecoration: 'none',
        }}>
          Join free →
        </Link>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 140px', maxWidth: 680, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.map(msg => (
            <Bubble
              key={msg.id}
              msg={msg}
              isMe={msg.is_me}
              avatarInitial={msg.display_name.charAt(0)}
            />
          ))}

          {/* Offer card (not in messages, shown inline) */}
          <OfferCard
            offeredItems={thread.offer.offered_items}
            topupAmount={thread.offer.topup_amount}
            topupCurrency={thread.offer.topup_currency}
            targetValueMid={targetMid}
            status={offerStatus}
            onAccept={handleAccept}
            onDecline={handleDecline}
            onComplete={handleComplete}
            isReceiver={thread.id === 'demo-thread-1'} // thread-1 = you're the receiver
          />
        </div>

        <div ref={bottomRef} />
      </div>

      {/* Listing link */}
      <div style={{
        position: 'fixed', bottom: 72, left: 0, right: 0,
        padding: '0 16px', pointerEvents: 'none',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', justifyContent: 'flex-end' }}>
          <Link href={`/listings/${thread.listing.id}`} style={{
            pointerEvents: 'all',
            fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--muted)',
            padding: '4px 10px', border: '1px solid var(--brd)',
            borderRadius: 99, background: 'var(--surf)', textDecoration: 'none',
          }}>
            View listing →
          </Link>
        </div>
      </div>

      {/* Input bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        padding: '10px 16px 20px',
        background: 'rgba(246,244,241,0.97)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--brd)',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', gap: 8 }}>
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendDraft() } }}
            placeholder="Type a message to try it out…"
            style={{
              flex: 1, padding: '11px 14px',
              border: '1px solid var(--brd)', borderRadius: 'var(--rl)',
              background: 'var(--surf)', color: 'var(--ink)',
              fontSize: 14, outline: 'none',
              fontFamily: 'var(--font-dm-sans)',
            }}
          />
          <button
            onClick={sendDraft}
            disabled={!draft.trim()}
            style={{
              padding: '11px 18px', borderRadius: 'var(--rl)',
              background: draft.trim() ? 'var(--red)' : 'var(--brd)',
              border: `1px solid ${draft.trim() ? '#A8251F' : 'var(--brd)'}`,
              color: 'white', fontWeight: 500, fontSize: 14, cursor: draft.trim() ? 'pointer' : 'default',
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// REAL THREAD VIEW (authenticated users)
// ─────────────────────────────────────────────────────────────────────────────

function RealThreadView({ threadId }: { threadId: string }) {
  const supabase = createClient()
  const bottomRef = useRef<HTMLDivElement>(null)

  const [userId, setUserId] = useState<string | null>(null)
  const [thread, setThread] = useState<Thread | null>(null)
  const [offer, setOffer] = useState<Offer | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      const [{ data: threadData }, { data: msgData }, { data: offerData }] = await Promise.all([
        supabase.from('threads')
          .select('*, listing:listings(*, profile:profiles(id, handle, display_name, avatar_url, tier))')
          .eq('id', threadId).single(),
        supabase.from('messages')
          .select('*, from_profile:profiles(id, handle, display_name, avatar_url)')
          .eq('thread_id', threadId).order('created_at', { ascending: true }),
        supabase.from('offers')
          .select('*, from_profile:profiles!from_user_id(id, handle, display_name, avatar_url, tier)')
          .eq('thread_id', threadId)
          .order('created_at', { ascending: false }).limit(1).maybeSingle(),
      ])

      setThread(threadData as Thread)
      setMessages((msgData ?? []) as Message[])
      setOffer(offerData as Offer | null)
    }
    load()
  }, [threadId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  useEffect(() => {
    const channel = supabase.channel(`thread:${threadId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `thread_id=eq.${threadId}` },
        (payload) => setMessages(prev => [...prev, payload.new as Message]))
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [threadId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function sendMessage() {
    if (!draft.trim() || !userId) return
    setSending(true)
    const { error } = await supabase.from('messages').insert({ thread_id: threadId, from_user_id: userId, content: draft.trim() })
    if (error) toast.error('Failed to send')
    else setDraft('')
    setSending(false)
  }

  async function respondOffer(action: 'accepted' | 'declined') {
    if (!offer) return
    const { error } = await supabase.from('offers').update({ status: action }).eq('id', offer.id)
    if (error) { toast.error('Failed'); return }
    setOffer({ ...offer, status: action })
    toast.success(action === 'accepted' ? 'Offer accepted!' : 'Offer declined')
    await supabase.from('messages').insert({ thread_id: threadId, from_user_id: userId!, content: action === 'accepted' ? "Offer accepted. Let's coordinate meetup." : 'Offer declined.' })
  }

  async function completeOffer() {
    if (!offer) return
    const { error } = await supabase.from('offers').update({ status: 'completed' }).eq('id', offer.id)
    if (error) { toast.error('Failed'); return }
    setOffer({ ...offer, status: 'completed' })
    toast.success('Trade completed!')
  }

  const listing = (thread as { listing?: { id: string; title: string; value_estimate_low?: number; value_estimate_high?: number } } | null)?.listing
  const targetMid = listing ? ((listing.value_estimate_low ?? 0) + (listing.value_estimate_high ?? listing.value_estimate_low ?? 0)) / 2 : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)' }}>
      <TopBar title={listing?.title ?? 'Thread'} back />

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 140px', maxWidth: 680, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.map(msg => {
            const isMe = msg.from_user_id === userId
            const profile = (msg as { from_profile?: { display_name?: string } }).from_profile
            return (
              <Bubble
                key={msg.id}
                msg={msg}
                isMe={isMe}
                avatarInitial={(profile?.display_name ?? 'U').charAt(0)}
              />
            )
          })}

          {offer && (
            <OfferCard
              offeredItems={(offer.offered_items ?? []) as Array<{ title: string; value_low?: number; value_high?: number }>}
              topupAmount={offer.topup_amount}
              topupCurrency={offer.topup_currency}
              targetValueMid={targetMid}
              status={offer.status}
              onAccept={() => respondOffer('accepted')}
              onDecline={() => respondOffer('declined')}
              onComplete={completeOffer}
              isReceiver={offer.to_user_id === userId}
            />
          )}
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        padding: '10px 16px 20px',
        background: 'rgba(246,244,241,0.97)', backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--brd)',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', gap: 8 }}>
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="Message…"
            style={{
              flex: 1, padding: '11px 14px',
              border: '1px solid var(--brd)', borderRadius: 'var(--rl)',
              background: 'var(--surf)', color: 'var(--ink)',
              fontSize: 14, outline: 'none', fontFamily: 'var(--font-dm-sans)',
            }}
          />
          {listing && (
            <Link href={`/offer/${listing.id}`} style={{
              padding: '11px 14px', borderRadius: 'var(--rl)',
              border: '1px solid var(--brd)', background: 'var(--surf)',
              color: 'var(--ink2)', fontSize: 13, textDecoration: 'none',
              display: 'flex', alignItems: 'center',
            }}>
              Offer
            </Link>
          )}
          <button
            onClick={sendMessage}
            disabled={sending || !draft.trim()}
            style={{
              padding: '11px 18px', borderRadius: 'var(--rl)',
              background: draft.trim() ? 'var(--red)' : 'var(--brd)',
              border: `1px solid ${draft.trim() ? '#A8251F' : 'var(--brd)'}`,
              color: 'white', fontWeight: 500, fontSize: 14,
              cursor: draft.trim() ? 'pointer' : 'default',
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTER — picks demo or real view
// ─────────────────────────────────────────────────────────────────────────────

export default function ThreadPage({ params }: Props) {
  const demoThread = DEMO_THREADS.find(t => t.id === params.threadId)

  if (demoThread) {
    return <DemoThreadView thread={demoThread} />
  }

  return <RealThreadView threadId={params.threadId} />
}
