'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/layout/TopBar'
import { formatValueRange, getValueGapState } from '@/lib/utils'
import { DEMO_LISTINGS } from '@/lib/demo-data'
import toast from 'react-hot-toast'
import type { Listing, ValueGapState } from '@/types'

interface Props {
  params: { listingId: string }
}

const DRAFT_KEY = 'bartr:offer-draft'

const GAP_STYLES: Record<ValueGapState, { bg: string; border: string; color: string; label: string; icon: string }> = {
  fair:      { bg: 'var(--gbg)',   border: 'var(--gbd)',   color: 'var(--grn)', label: 'Fair trade — values well matched', icon: '✓' },
  short:     { bg: 'var(--rbg)',   border: 'var(--rbd)',   color: 'var(--red)', label: "You're offering less — consider adding more", icon: '↓' },
  way_short: { bg: 'var(--rbg)',   border: 'var(--rbd)',   color: 'var(--red)', label: 'Big value gap — they may not accept this', icon: '↓↓' },
  over:      { bg: 'var(--blubg)', border: 'var(--blubd)', color: 'var(--blu)', label: "You're offering more — request something extra?", icon: '↑' },
  way_over:  { bg: 'var(--gldbg)', border: 'var(--gldbd)', color: 'var(--gld)', label: "You're offering a lot more — request something extra", icon: '↑↑' },
}

function mapGapForDb(state: ValueGapState | null): string | null {
  if (!state) return null
  return state
}

// 3 sample items shown when user has no real listings (new users + guests)
const SAMPLE_YOUR_ITEMS: Listing[] = DEMO_LISTINGS.slice(1, 4)

export default function OfferPage({ params }: Props) {
  const supabase = createClient()

  const isDemo = params.listingId.startsWith('demo-')

  const [target, setTarget] = useState<Listing | null>(null)
  const [myListings, setMyListings] = useState<Listing[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [guestOfferDraft, setGuestOfferDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [showTopup, setShowTopup] = useState(false)
  const [topupAmount, setTopupAmount] = useState('')
  const [topupCurrency, setTopupCurrency] = useState('GBP')
  const [isGuest, setIsGuest] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      const guest = !user
      setIsGuest(guest)
      setUserId(user?.id ?? null)

      if (isDemo || guest) {
        // Demo or guest mode: load demo listing, show sample items
        const demoListing = DEMO_LISTINGS.find(l => l.id === params.listingId)
          ?? DEMO_LISTINGS[0] // fallback
        setTarget(demoListing)
        setMyListings(DEMO_LISTINGS.filter(l => l.id !== params.listingId).slice(0, 3))

        // Restore localStorage draft if present (additive CODEX feature)
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
            }
          } catch {
            // ignore invalid local draft
          }
        }
        return
      }

      // Authenticated + real listing
      const [{ data: targetData }, { data: myData }] = await Promise.all([
        supabase
          .from('listings')
          .select('*, profile:profiles(id, handle, display_name, avatar_url, tier)')
          .eq('id', params.listingId)
          .single(),
        supabase
          .from('listings')
          .select('*')
          .eq('user_id', user!.id)
          .eq('status', 'active'),
      ])

      setTarget(targetData as Listing)
      const realListings = (myData ?? []) as Listing[]
      if (realListings.length === 0) {
        setMyListings(SAMPLE_YOUR_ITEMS)
      } else {
        setMyListings(realListings)
      }

      // Restore localStorage draft if present (additive CODEX feature)
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
            toast.success('Draft restored — you can send when ready')
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

  function toggleItem(id: string) {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function fireGate() {
    // Save draft to localStorage before firing gate (additive CODEX feature)
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      listingId: params.listingId,
      selectedItems,
      message,
      guestOfferDraft,
    }))
    window.dispatchEvent(new CustomEvent('bartr:offer-gate', {
      detail: { next: `/offer/${params.listingId}` },
    }))
  }

  async function sendOffer() {
    if (isGuest || isDemo) {
      // Guest: show gate so they can sign up and come back
      fireGate()
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
          listing_id: target!.id,
          participant_ids: [userId!, target!.user_id],
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
        from_user_id: userId!,
        to_user_id: target!.user_id,
        target_listing_id: target!.id,
        offered_items: offeredItems,
        message: message || null,
        value_gap_state: mapGapForDb(gapState),
        status: 'pending',
      })

      if (offerErr) throw offerErr

      const itemNames = selectedItems.map(id => myListings.find(x => x.id === id)?.title).filter(Boolean).join(' + ')
      const topupStr = topupAmount ? ` + £${topupAmount} top-up` : ''
      const msgStr = message ? `\n\n${message}` : ''

      await supabase.from('messages').insert({
        thread_id: thread.id,
        from_user_id: userId!,
        content: `Offer: ${itemNames}${topupStr}${msgStr}`,
      })

      localStorage.removeItem(DRAFT_KEY)
      setSent(true)
      toast.success('Offer sent!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to send offer')
    } finally {
      setSending(false)
    }
  }

  // ── Sent confirmation screen ───────────────────────────────────────────
  if (sent) {
    return (
      <>
        <TopBar title="Offer sent" />
        <main style={{
          maxWidth: 480, margin: '0 auto', padding: '60px 24px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🤝</div>
          <h1 style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 26, color: 'var(--ink)', marginBottom: 10 }}>
            Offer sent!
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 32 }}>
            {target?.profile?.display_name ?? 'The seller'} will be notified. You&apos;ll see their response in Messages.
            The trade is logged on the public ledger when completed.
          </p>
          <Link href="/messages" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '13px 24px', borderRadius: 99, marginBottom: 12,
            background: 'var(--red)', border: '1px solid #A8251F',
            color: 'white', fontSize: 15, fontWeight: 500, textDecoration: 'none',
          }}>
            Go to Messages →
          </Link>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href={`/listings/${params.listingId}`} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '12px 16px', borderRadius: 99,
              border: '1px solid var(--brd2)', background: 'var(--surf)',
              color: 'var(--ink2)', fontSize: 13, textDecoration: 'none',
            }}>
              View listing
            </Link>
            <Link href="/browse" style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '12px 16px', borderRadius: 99,
              border: '1px solid var(--brd2)', background: 'var(--surf)',
              color: 'var(--ink2)', fontSize: 13, textDecoration: 'none',
            }}>
              Keep browsing
            </Link>
          </div>
        </main>
      </>
    )
  }

  // ── Loading ────────────────────────────────────────────────────────────
  if (!target) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 12, color: 'var(--faint)' }}>Loading…</span>
      </div>
    )
  }

  const targetValue = formatValueRange(target.value_estimate_low, target.value_estimate_high)
  const noRealListings = !isGuest && !isDemo && myListings.every(l => l.id.startsWith('demo-'))

  return (
    <>
      <TopBar title="Build offer" back />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '16px 16px 140px' }}>

        {/* Guest banner */}
        {(isGuest || isDemo) && (
          <div style={{
            padding: '10px 14px', marginBottom: 16, borderRadius: 'var(--rl)',
            background: 'var(--gldbg)', border: '1px solid var(--gldbd)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--gld)', lineHeight: 1.4 }}>
              {isDemo ? 'Sample listing — explore the offer flow' : 'Exploring as guest — sign up to send a real offer'}
            </span>
            <button onClick={fireGate} style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--gld)',
              padding: '3px 10px', border: '1px solid var(--gldbd)',
              borderRadius: 99, background: 'var(--gldbg)', cursor: 'pointer',
              flexShrink: 0,
            }}>
              Join free →
            </button>
          </div>
        )}

        {noRealListings && (
          <div style={{
            padding: '10px 14px', marginBottom: 16, borderRadius: 'var(--rl)',
            background: 'var(--blubg)', border: '1px solid var(--blubd)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--blu)', lineHeight: 1.4 }}>
              No listings yet — items below are examples. List something to make a real offer.
            </span>
            <Link href="/list" style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--blu)',
              padding: '3px 10px', border: '1px solid var(--blubd)',
              borderRadius: 99, background: 'var(--blubg)', textDecoration: 'none', flexShrink: 0,
            }}>
              List item →
            </Link>
          </div>
        )}

        {/* Target listing */}
        <div style={{
          background: 'var(--surf)', border: '1px solid var(--brd)',
          borderRadius: 'var(--rl)', padding: '14px 16px', marginBottom: 12,
        }}>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--faint)', marginBottom: 6 }}>
            You want
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 500, color: 'var(--ink)', fontSize: 15, marginBottom: 2 }}>{target.title}</div>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--muted)' }}>
                from {target.profile?.display_name ?? target.profile?.handle}
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 16, fontWeight: 500, color: 'var(--red)', flexShrink: 0 }}>
              {targetValue}
            </div>
          </div>
          {target.wants && (
            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {target.wants.split(',').map(w => w.trim()).filter(Boolean).slice(0, 4).map(w => (
                <span key={w} style={{
                  fontFamily: 'var(--font-dm-mono)', fontSize: 10,
                  padding: '3px 9px', borderRadius: 99,
                  background: 'var(--gbg)', border: '1px solid var(--gbd)', color: 'var(--grn)',
                }}>
                  {w}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Value balance bar */}
        {selectedItems.length > 0 && (
          <div style={{
            background: 'var(--surf)', border: '1px solid var(--brd)',
            borderRadius: 'var(--rl)', padding: '14px 16px', marginBottom: 12,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--muted)' }}>
                Your offer: ~£{Math.round(offeredMid)}
              </span>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--muted)' }}>
                Their item: {targetValue}
              </span>
            </div>

            <div style={{ height: 6, background: 'var(--brd)', borderRadius: 99, overflow: 'hidden', marginBottom: 10 }}>
              <div style={{
                height: '100%', borderRadius: 99, transition: 'width 0.3s ease',
                width: `${Math.min((offeredMid / (targetMid || 1)) * 100, 100)}%`,
                background: gapState === 'fair' ? 'var(--grn)'
                           : (gapState === 'short' || gapState === 'way_short') ? 'var(--red)'
                           : gapState === 'way_over' ? 'var(--gld)'
                           : 'var(--blu)',
              }} />
            </div>

            {gapState && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 12px', borderRadius: 99,
                fontFamily: 'var(--font-dm-mono)', fontSize: 10,
                background: GAP_STYLES[gapState].bg,
                border: `1px solid ${GAP_STYLES[gapState].border}`,
                color: GAP_STYLES[gapState].color,
              }}>
                {GAP_STYLES[gapState].icon} {GAP_STYLES[gapState].label}
              </div>
            )}
          </div>
        )}

        {/* Item picker — what you're offering */}
        <div style={{
          background: 'var(--surf)', border: '1px solid var(--brd)',
          borderRadius: 'var(--rl)', padding: '14px 16px', marginBottom: 12,
        }}>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--faint)', marginBottom: 12 }}>
            {isGuest || noRealListings ? 'Example items — tap to see value gap' : 'Choose items to offer'}
          </div>

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
                  {selected && (
                    <div style={{
                      position: 'absolute', top: 5, right: 5,
                      width: 16, height: 16, borderRadius: '50%',
                      background: 'var(--red)', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9,
                    }}>
                      ✓
                    </div>
                  )}
                  <div style={{
                    fontSize: 11, fontWeight: 500, color: 'var(--ink)',
                    lineHeight: 1.3, marginBottom: 5,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {l.title}
                  </div>
                  <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--red)' }}>
                    {itemValue}
                  </div>
                  {l.condition && (
                    <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: 'var(--faint)', marginTop: 3 }}>
                      {l.condition.replace('_', ' ')}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {(isGuest || noRealListings) && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--brd)', textAlign: 'center' }}>
              <button onClick={isGuest ? fireGate : undefined} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  {isGuest ? '+ Join free to offer your own items' : '+ List your own items to make a real offer'}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Top-up */}
        {(gapState === 'short' || gapState === 'way_short' || showTopup) && (
          <div style={{
            background: 'var(--surf)', border: '1px solid var(--brd)',
            borderRadius: 'var(--rl)', padding: '14px 16px', marginBottom: 12,
          }}>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 6 }}>
              Bridge the gap — add cash top-up intent
            </div>
            <p style={{ fontSize: 12, color: 'var(--faint)', marginBottom: 10, lineHeight: 1.5 }}>
              Not paid through Bartr — tells the other person you&apos;ll add cash to balance the trade.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="number"
                value={topupAmount}
                onChange={e => setTopupAmount(e.target.value)}
                placeholder="Amount (e.g. 50)"
                min="0" step="1"
                style={{
                  flex: 1, padding: '10px 12px',
                  border: '1px solid var(--brd)', borderRadius: 'var(--r)',
                  background: 'var(--surf)', color: 'var(--ink)',
                  fontSize: 14, outline: 'none',
                }}
              />
              <select
                value={topupCurrency}
                onChange={e => setTopupCurrency(e.target.value)}
                style={{
                  width: 72, padding: '10px 8px',
                  border: '1px solid var(--brd)', borderRadius: 'var(--r)',
                  background: 'var(--surf)', color: 'var(--ink)',
                  fontSize: 13, outline: 'none',
                }}
              >
                <option>GBP</option><option>EUR</option><option>USD</option><option>AUD</option>
              </select>
            </div>
          </div>
        )}

        {!showTopup && gapState !== 'short' && gapState !== 'way_short' && (
          <button
            onClick={() => setShowTopup(true)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-dm-mono)', fontSize: 11,
              color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: 3,
              marginBottom: 12, padding: '0 2px',
            }}
          >
            + Add cash top-up intent
          </button>
        )}

        {/* Message */}
        <div style={{
          background: 'var(--surf)', border: '1px solid var(--brd)',
          borderRadius: 'var(--rl)', padding: '14px 16px',
        }}>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--faint)', marginBottom: 8 }}>
            Message (optional)
          </div>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Meetup preference, timing, condition notes…"
            rows={3}
            style={{
              width: '100%', padding: '10px 12px', resize: 'none',
              border: '1px solid var(--brd)', borderRadius: 'var(--r)',
              background: 'var(--bg)', color: 'var(--ink)',
              fontSize: 14, outline: 'none', lineHeight: 1.5,
              fontFamily: 'var(--font-dm-sans)', boxSizing: 'border-box',
            }}
          />
        </div>
      </main>

      {/* Sticky send bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        padding: '12px 16px 28px',
        background: 'rgba(246,244,241,0.97)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--brd)',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          {isGuest || isDemo ? (
            // Guest: fire gate on send
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={fireGate}
                style={{
                  flex: 2, padding: '14px', borderRadius: 99,
                  background: 'var(--red)', border: '1px solid #A8251F',
                  color: 'white', fontSize: 15, fontWeight: 500, cursor: 'pointer',
                }}
              >
                {selectedItems.length === 0 ? 'Join to make a real offer →' : `Join & send offer (${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''}) →`}
              </button>
            </div>
          ) : (
            <button
              onClick={sendOffer}
              disabled={sending || selectedItems.length === 0}
              style={{
                width: '100%', padding: '14px', borderRadius: 99,
                background: selectedItems.length === 0 ? 'var(--brd2)' : 'var(--red)',
                border: `1px solid ${selectedItems.length === 0 ? 'var(--brd2)' : '#A8251F'}`,
                color: 'white', fontSize: 16, fontWeight: 500,
                cursor: selectedItems.length === 0 ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {sending ? 'Sending offer…'
                : selectedItems.length === 0 ? 'Select items to offer'
                : `Let's swap! (${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''}) →`}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
