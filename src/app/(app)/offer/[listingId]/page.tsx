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

const GAP_STYLES: Record<ValueGapState, { bg: string; border: string; color: string; label: string; icon: string }> = {
  fair:      { bg: 'var(--gbg)',   border: 'var(--gbd)',   color: 'var(--grn)', label: 'Fair trade',            icon: '✓' },
  short:     { bg: 'var(--rbg)',   border: 'var(--rbd)',   color: 'var(--red)', label: "You're offering less",   icon: '↓' },
  way_short: { bg: 'var(--rbg)',   border: 'var(--rbd)',   color: 'var(--red)', label: 'Big value gap',          icon: '↓↓' },
  over:      { bg: 'var(--blubg)', border: 'var(--blubd)', color: 'var(--blu)', label: 'You\'re offering more — request something extra?', icon: '↑' },
  way_over:  { bg: 'var(--gldbg)', border: 'var(--gldbd)', color: 'var(--gld)', label: 'You\'re offering a lot more — request something extra', icon: '↑↑' },
}

export default function OfferPage({ params }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [target, setTarget] = useState<Listing | null>(null)
  const [myListings, setMyListings] = useState<Listing[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [topupAmount, setTopupAmount] = useState('')
  const [topupCurrency, setTopupCurrency] = useState('GBP')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [showTopup, setShowTopup] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push(`/login?next=/offer/${params.listingId}`)
        return
      }

      const [{ data: targetData }, { data: myData }] = await Promise.all([
        supabase
          .from('listings')
          .select('*, profile:profiles(id, handle, display_name, avatar_url, tier)')
          .eq('id', params.listingId)
          .single(),
        supabase
          .from('listings')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active'),
      ])

      setTarget(targetData as Listing)
      setMyListings((myData ?? []) as Listing[])
    }
    load()
  }, [params.listingId]) // eslint-disable-line react-hooks/exhaustive-deps

  const offeredMid = selectedItems.reduce((sum, id) => {
    const l = myListings.find(x => x.id === id)
    if (!l) return sum
    return sum + ((l.value_estimate_low ?? 0) + (l.value_estimate_high ?? l.value_estimate_low ?? 0)) / 2
  }, 0) + (parseFloat(topupAmount) || 0)

  const targetMid = target
    ? ((target.value_estimate_low ?? 0) + (target.value_estimate_high ?? target.value_estimate_low ?? 0)) / 2
    : 0

  const gapState = offeredMid > 0 && targetMid > 0 ? getValueGapState(offeredMid, targetMid) : null
  const balancePct = targetMid > 0 ? Math.min(offeredMid / targetMid, 2) * 50 : 0  // 50% = even, 0% = nothing, 100% = 2x

  function toggleItem(id: string) {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  async function sendOffer() {
    if (selectedItems.length === 0) {
      toast.error('Pick at least one item to offer')
      return
    }

    setSending(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !target) return

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
          listing_id: id, title: l.title,
          value_low: l.value_estimate_low, value_high: l.value_estimate_high,
        }
      })

      const { error: offerErr } = await supabase.from('offers').insert({
        thread_id: thread.id,
        from_user_id: user.id,
        to_user_id: target.user_id,
        target_listing_id: target.id,
        offered_items: offeredItems,
        topup_amount: topupAmount ? parseFloat(topupAmount) : null,
        topup_currency: topupAmount ? topupCurrency : null,
        message: message || null,
        status: 'pending',
      })

      if (offerErr) throw offerErr

      const itemNames = selectedItems.map(id => myListings.find(x => x.id === id)?.title).filter(Boolean).join(' + ')
      const topupStr = topupAmount ? ` + ${topupAmount} ${topupCurrency} top-up` : ''
      const msgStr = message ? `\n\n${message}` : ''

      await supabase.from('messages').insert({
        thread_id: thread.id,
        from_user_id: user.id,
        content: `Offer: ${itemNames}${topupStr}${msgStr}`,
      })

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
      <TopBar title="Make offer" back />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '16px 16px 120px' }}>

        {/* You want — target listing summary */}
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

        {/* Value balance bar */}
        {(offeredMid > 0 || selectedItems.length > 0) && (
          <div style={{
            background: 'var(--surf)', border: '1px solid var(--brd)',
            borderRadius: 'var(--rl)', padding: '14px 16px', marginBottom: 12,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--muted)' }}>
                Your offer: ~£{offeredMid.toFixed(0)}
              </span>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--muted)' }}>
                Their item: {targetValue}
              </span>
            </div>

            {/* Bar */}
            <div style={{ height: 6, background: 'var(--brd)', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{
                height: '100%', borderRadius: 99, transition: 'width 0.3s ease',
                width: `${Math.min(balancePct * 2, 100)}%`,
                background: gapState === 'fair' ? 'var(--grn)'
                           : (gapState === 'short' || gapState === 'way_short') ? 'var(--red)'
                           : gapState === 'way_over' ? 'var(--gld)'
                           : 'var(--blu)',
              }} />
            </div>

            {/* Gap badge */}
            {gapState && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 10px', borderRadius: 99,
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

        {/* Item picker — 3-column grid */}
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
                    {selected && (
                      <div style={{
                        position: 'absolute', top: 6, right: 6,
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
                      lineHeight: 1.3, marginBottom: 4,
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {l.title}
                    </div>
                    <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--red)' }}>
                      {itemValue}
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>
                You have no active listings to offer.
              </p>
              <Link href="/list" style={{
                display: 'inline-flex', padding: '9px 20px', borderRadius: 99,
                background: 'var(--red)', color: 'white', fontSize: 13,
                border: '1px solid #A8251F', textDecoration: 'none',
              }}>
                List an item first
              </Link>
            </div>
          )}
        </div>

        {/* Top-up / cash bridge (collapsed by default, shows when value is short) */}
        {(gapState === 'short' || gapState === 'way_short' || showTopup) && (
          <div style={{
            background: 'var(--surf)', border: '1px solid var(--brd)',
            borderRadius: 'var(--rl)', padding: '14px 16px', marginBottom: 12,
          }}>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 10 }}>
              Bridge the gap — add cash intent
            </div>
            <p style={{ fontSize: 12, color: 'var(--faint)', marginBottom: 10, lineHeight: 1.5 }}>
              Not paid through Bartr — just tells the other person you&apos;ll add cash off-platform.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="number"
                value={topupAmount}
                onChange={e => setTopupAmount(e.target.value)}
                placeholder="Amount (e.g. 20)"
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
              fontFamily: 'var(--font-dm-sans)',
            }}
          />
        </div>
      </main>

      {/* Sticky send bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        padding: '12px 16px 24px',
        background: 'rgba(246,244,241,0.97)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--brd)',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <button
            onClick={sendOffer}
            disabled={sending || selectedItems.length === 0}
            style={{
              width: '100%', padding: '14px',
              borderRadius: 99,
              background: selectedItems.length === 0 ? 'var(--brd2)' : 'var(--red)',
              border: `1px solid ${selectedItems.length === 0 ? 'var(--brd2)' : '#A8251F'}`,
              color: 'white', fontSize: 16, fontWeight: 500,
              cursor: selectedItems.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {sending ? 'Sending…'
              : selectedItems.length === 0 ? 'Select items to offer'
              : `Send offer (${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''})`}
          </button>
        </div>
      </div>
    </>
  )
}
