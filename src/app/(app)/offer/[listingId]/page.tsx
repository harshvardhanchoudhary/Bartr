'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/layout/TopBar'
import { formatValueRange, getValueGapState } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Listing, ValueGapState } from '@/types'

interface Props {
  params: { listingId: string }
}

const DRAFT_KEY = 'bartr:offer-draft'

const GAP_STYLES: Record<ValueGapState, { bg: string; border: string; color: string; label: string; icon: string }> = {
  fair: { bg: 'var(--gbg)', border: 'var(--gbd)', color: 'var(--grn)', label: 'Fair trade', icon: '✓' },
  short: { bg: 'var(--rbg)', border: 'var(--rbd)', color: 'var(--red)', label: "You're offering less", icon: '↓' },
  way_short: { bg: 'var(--rbg)', border: 'var(--rbd)', color: 'var(--red)', label: 'Big value gap', icon: '↓↓' },
  over: { bg: 'var(--blubg)', border: 'var(--blubd)', color: 'var(--blu)', label: "You're offering more", icon: '↑' },
  way_over: { bg: 'var(--gldbg)', border: 'var(--gldbd)', color: 'var(--gld)', label: 'You are offering a lot more', icon: '↑↑' },
}

function mapGapForDb(state: ValueGapState | null): string | null {
  if (!state) return null
  return state
}

export default function OfferPage({ params }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [target, setTarget] = useState<Listing | null>(null)
  const [myListings, setMyListings] = useState<Listing[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [guestOfferDraft, setGuestOfferDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUserId(user?.id ?? null)

      const { data: targetData } = await supabase
        .from('listings')
        .select('*, profile:profiles(id, handle, display_name, avatar_url, tier)')
        .eq('id', params.listingId)
        .single()

      setTarget(targetData as Listing)

      if (user) {
        const { data: myData } = await supabase
          .from('listings')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')

        setMyListings((myData ?? []) as Listing[])
      }

      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) {
        try {
          const draft = JSON.parse(raw) as {
            listingId: string
            selectedItems: string[]
            message: string
            guestOfferDraft: string
          }
          if (draft.listingId === params.listingId) {
            setSelectedItems(draft.selectedItems ?? [])
            setMessage(draft.message ?? '')
            setGuestOfferDraft(draft.guestOfferDraft ?? '')
            if (user) {
              toast.success('Draft restored — you can send when ready')
            }
          }
        } catch {
          // ignore invalid local draft
        }
      }
    }
    load()
  }, [params.listingId]) // eslint-disable-line react-hooks/exhaustive-deps

  const offeredMid = selectedItems.reduce((sum, id) => {
    const l = myListings.find(x => x.id === id)
    if (!l) return sum
    return sum + ((l.value_estimate_low ?? 0) + (l.value_estimate_high ?? l.value_estimate_low ?? 0)) / 2
  }, 0)

  const targetMid = target
    ? ((target.value_estimate_low ?? 0) + (target.value_estimate_high ?? target.value_estimate_low ?? 0)) / 2
    : 0

  const gapState = offeredMid > 0 && targetMid > 0 ? getValueGapState(offeredMid, targetMid) : null
  const balancePct = targetMid > 0 ? Math.min(offeredMid / targetMid, 2) * 50 : 0

  function toggleItem(id: string) {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  async function sendOffer() {
    if (!target) return

    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      listingId: params.listingId,
      selectedItems,
      message,
      guestOfferDraft,
    }))

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast('Sign in at the very end — your draft is saved', { icon: '✨' })
      router.push(`/login?next=/offer/${params.listingId}`)
      return
    }

    if (selectedItems.length === 0) {
      toast.error('Pick at least one item to offer')
      return
    }

    setSending(true)
    try {
      const { data: thread, error: threadErr } = await supabase
        .from('threads')
        .insert({
          listing_id: target.id,
          participant_ids: [user.id, target.user_id],
        })
        .select()
        .single()

      if (threadErr) throw threadErr

      const offeredItems = selectedItems.map(id => {
        const l = myListings.find(x => x.id === id)!
        return {
          listing_id: id,
          title: l.title,
          value_low: l.value_estimate_low,
          value_high: l.value_estimate_high,
        }
      })

      const { error: offerErr } = await supabase.from('offers').insert({
        thread_id: thread.id,
        from_user_id: user.id,
        to_user_id: target.user_id,
        target_listing_id: target.id,
        offered_items: offeredItems,
        message: message || null,
        value_gap_state: mapGapForDb(gapState),
        status: 'pending',
      })

      if (offerErr) throw offerErr

      const itemNames = selectedItems.map(id => myListings.find(x => x.id === id)?.title).filter(Boolean).join(' + ')
      const msgStr = message ? `\n\n${message}` : ''

      await supabase.from('messages').insert({
        thread_id: thread.id,
        from_user_id: user.id,
        content: `Offer: ${itemNames}${msgStr}`,
      })

      localStorage.removeItem(DRAFT_KEY)
      toast.success('Offer sent!')
      router.push(`/messages/${thread.id}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to send offer')
    } finally {
      setSending(false)
    }
  }

  if (!target) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: 'var(--faint)' }}>Loading…</span>
      </div>
    )
  }

  const targetValue = formatValueRange(target.value_estimate_low, target.value_estimate_high)

  return (
    <>
      <TopBar title="Build offer" back />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '16px 16px 120px' }}>
        {!userId && (
          <div style={{
            marginBottom: 12,
            padding: '12px 14px',
            background: 'var(--blubg)',
            border: '1px solid var(--blubd)',
            borderRadius: 'var(--rl)',
            fontSize: 13,
            color: 'var(--ink2)',
          }}>
            You can draft your offer now. Sign in only when you tap <strong>Send offer</strong>.
          </div>
        )}

        <div style={{
          background: 'var(--surf)', border: '1px solid var(--brd)',
          borderRadius: 'var(--rl)', padding: '14px 16px', marginBottom: 12,
        }}>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--faint)', marginBottom: 6 }}>
            You want
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 500, color: 'var(--ink)', fontSize: 15 }}>{target.title}</div>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                from {target.profile?.handle}
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 16, fontWeight: 500, color: 'var(--red)', flexShrink: 0 }}>
              {targetValue}
            </div>
          </div>
        </div>

        {userId ? (
          <div style={{
            background: 'var(--surf)', border: '1px solid var(--brd)',
            borderRadius: 'var(--rl)', padding: '14px 16px', marginBottom: 12,
          }}>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--faint)', marginBottom: 12 }}>
              Choose items to offer
            </div>

            {myListings.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {myListings.map(l => {
                  const selected = selectedItems.includes(l.id)
                  const itemValue = formatValueRange(l.value_estimate_low, l.value_estimate_high)
                  return (
                    <button
                      key={l.id}
                      onClick={() => toggleItem(l.id)}
                      style={{
                        padding: '10px 8px', borderRadius: 'var(--r)',
                        border: `1px solid ${selected ? '#A8251F' : 'var(--brd)'}`,
                        background: selected ? 'var(--rbg)' : 'var(--bg)',
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'all 0.12s', position: 'relative',
                      }}
                    >
                      {selected && <div style={{ position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: '50%', background: 'var(--red)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>✓</div>}
                      <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.3, marginBottom: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {l.title}
                      </div>
                      <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--red)' }}>{itemValue}</div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>You have no active listings to offer.</p>
                <Link href="/list" style={{ display: 'inline-flex', padding: '9px 20px', borderRadius: 99, background: 'var(--red)', color: 'white', fontSize: 13, border: '1px solid #A8251F', textDecoration: 'none' }}>
                  List an item first
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div style={{
            background: 'var(--surf)', border: '1px solid var(--brd)',
            borderRadius: 'var(--rl)', padding: '14px 16px', marginBottom: 12,
          }}>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--faint)', marginBottom: 8 }}>
              Draft your side of the trade
            </div>
            <textarea
              value={guestOfferDraft}
              onChange={e => setGuestOfferDraft(e.target.value)}
              placeholder="Example: Canon 50mm lens + Patagonia jacket"
              rows={3}
              style={{ width: '100%', padding: '10px 12px', resize: 'none', border: '1px solid var(--brd)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 14, outline: 'none', lineHeight: 1.5, fontFamily: 'var(--font-dm-sans)' }}
            />
          </div>
        )}

        {(offeredMid > 0 || selectedItems.length > 0) && (
          <div style={{ background: 'var(--surf)', border: '1px solid var(--brd)', borderRadius: 'var(--rl)', padding: '14px 16px', marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--muted)' }}>Your offer: ~£{offeredMid.toFixed(0)}</span>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--muted)' }}>Their item: {targetValue}</span>
            </div>
            <div style={{ height: 6, background: 'var(--brd)', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ height: '100%', borderRadius: 99, transition: 'width 0.3s ease', width: `${Math.min(balancePct * 2, 100)}%`, background: gapState === 'fair' ? 'var(--grn)' : (gapState === 'short' || gapState === 'way_short') ? 'var(--red)' : gapState === 'way_over' ? 'var(--gld)' : 'var(--blu)' }} />
            </div>
            {gapState && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 99, fontFamily: 'var(--font-dm-mono)', fontSize: 10, background: GAP_STYLES[gapState].bg, border: `1px solid ${GAP_STYLES[gapState].border}`, color: GAP_STYLES[gapState].color }}>
                {GAP_STYLES[gapState].icon} {GAP_STYLES[gapState].label}
              </div>
            )}
          </div>
        )}

        <div style={{ background: 'var(--surf)', border: '1px solid var(--brd)', borderRadius: 'var(--rl)', padding: '14px 16px' }}>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--faint)', marginBottom: 8 }}>
            Message (optional)
          </div>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Meetup preference, timing, condition notes…"
            rows={3}
            style={{ width: '100%', padding: '10px 12px', resize: 'none', border: '1px solid var(--brd)', borderRadius: 'var(--r)', background: 'var(--bg)', color: 'var(--ink)', fontSize: 14, outline: 'none', lineHeight: 1.5, fontFamily: 'var(--font-dm-sans)' }}
          />
        </div>
      </main>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, padding: '12px 16px 24px', background: 'rgba(246,244,241,0.97)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--brd)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <button
            onClick={sendOffer}
            disabled={sending || (userId ? selectedItems.length === 0 : !guestOfferDraft.trim())}
            style={{
              width: '100%', padding: '14px', borderRadius: 99,
              background: (userId ? selectedItems.length === 0 : !guestOfferDraft.trim()) ? 'var(--brd2)' : 'var(--red)',
              border: `1px solid ${(userId ? selectedItems.length === 0 : !guestOfferDraft.trim()) ? 'var(--brd2)' : '#A8251F'}`,
              color: 'white', fontSize: 16, fontWeight: 500,
              cursor: (userId ? selectedItems.length === 0 : !guestOfferDraft.trim()) ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {sending
              ? 'Sending…'
              : !userId
                ? 'Continue → sign in at final step'
                : selectedItems.length === 0
                  ? 'Select items to offer'
                  : `Send offer (${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''})`}
          </button>
        </div>
      </div>
    </>
  )
}
