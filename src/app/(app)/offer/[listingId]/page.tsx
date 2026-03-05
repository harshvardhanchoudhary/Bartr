'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/layout/TopBar'
import { ValueGapBadge } from '@/components/ui/ValueGapBadge'
import { Chip } from '@/components/ui/Chip'
import { formatValueRange } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Listing } from '@/types'

interface Props {
  params: { listingId: string }
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
  const [preview, setPreview] = useState<string | null>(null)

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
  }, [params.listingId])

  // Compute value gap
  const offeredMid = selectedItems.reduce((sum, id) => {
    const l = myListings.find(x => x.id === id)
    if (!l) return sum
    const lo = l.value_estimate_low ?? 0
    const hi = l.value_estimate_high ?? lo
    return sum + (lo + hi) / 2
  }, 0) + (parseFloat(topupAmount) || 0)

  const targetMid = target
    ? ((target.value_estimate_low ?? 0) + (target.value_estimate_high ?? target.value_estimate_low ?? 0)) / 2
    : 0

  function toggleItem(id: string) {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
    setPreview(null)
  }

  function buildPreview(): string {
    const items = selectedItems.map(id => myListings.find(x => x.id === id)?.title).filter(Boolean)
    const cashStr = topupAmount ? ` + ${topupAmount} ${topupCurrency} top-up intent` : ''
    const msgStr = message ? ` — "${message}"` : ''
    return `Offering: ${items.join(' + ') || '(none)'}${cashStr}${msgStr}`
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

      // Create thread first
      const { data: thread, error: threadErr } = await supabase
        .from('threads')
        .insert({
          listing_id: target.id,
          participant_ids: [user.id, target.user_id],
        })
        .select()
        .single()

      if (threadErr) throw threadErr

      // Offered items payload
      const offeredItems = selectedItems.map(id => {
        const l = myListings.find(x => x.id === id)!
        return {
          listing_id: id,
          title: l.title,
          value_low: l.value_estimate_low,
          value_high: l.value_estimate_high,
        }
      })

      // Create offer
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

      // Initial message
      await supabase.from('messages').insert({
        thread_id: thread.id,
        from_user_id: user.id,
        content: buildPreview(),
      })

      toast.success('Offer sent!')
      router.push(`/messages/${thread.id}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send offer'
      toast.error(msg)
    } finally {
      setSending(false)
    }
  }

  if (!target) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted text-sm">Loading…</div>
      </div>
    )
  }

  const targetValue = formatValueRange(target.value_estimate_low, target.value_estimate_high)

  return (
    <>
      <TopBar title="Make offer" />

      <main className="max-w-2xl mx-auto px-4 py-4 pb-32 space-y-4">
        {/* Target listing summary */}
        <div className="card p-4">
          <div className="label">You want</div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold">{target.title}</div>
              <div className="text-muted text-sm mt-0.5">{target.profile?.handle}</div>
            </div>
            <div className="text-red-light font-mono text-sm flex-shrink-0">{targetValue}</div>
          </div>
        </div>

        {/* Value gap indicator */}
        {offeredMid > 0 && targetMid > 0 && (
          <ValueGapBadge offeredMid={offeredMid} targetMid={targetMid} />
        )}

        {/* Pick items from your listings */}
        <div className="card p-4">
          <div className="label mb-3">Your items to offer</div>

          {myListings.length > 0 ? (
            <div className="space-y-2">
              {myListings.map(l => {
                const selected = selectedItems.includes(l.id)
                return (
                  <button
                    key={l.id}
                    onClick={() => toggleItem(l.id)}
                    className={`w-full flex items-center justify-between gap-3 p-3 rounded border text-left transition-colors ${
                      selected
                        ? 'border-red-border bg-red-muted'
                        : 'border-stroke bg-surface-2 hover:border-stroke-2'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium line-clamp-1">{l.title}</div>
                      <div className="flex gap-2 mt-1">
                        <Chip>{l.category}</Chip>
                        <span className="text-xs font-mono text-muted">
                          {formatValueRange(l.value_estimate_low, l.value_estimate_high)}
                        </span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center text-xs ${
                      selected ? 'bg-red-light border-red-light text-white' : 'border-stroke'
                    }`}>
                      {selected ? '✓' : ''}
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted text-sm mb-3">You have no active listings to offer.</p>
              <Link href="/list" className="btn btn-primary text-sm">
                List an item first
              </Link>
            </div>
          )}
        </div>

        {/* Top-up intent (off-platform) */}
        <div className="card p-4">
          <div className="label mb-3">Top-up intent (optional)</div>
          <div className="flex gap-2">
            <input
              type="number"
              value={topupAmount}
              onChange={e => setTopupAmount(e.target.value)}
              placeholder="e.g. 10"
              className="input flex-1"
              min="0"
              step="0.01"
            />
            <select
              value={topupCurrency}
              onChange={e => setTopupCurrency(e.target.value)}
              className="select w-24"
            >
              <option>GBP</option>
              <option>EUR</option>
              <option>USD</option>
              <option>AUD</option>
            </select>
          </div>
          <p className="text-xs text-muted-2 mt-2">
            Top-up amounts are recorded as intent only — payment happens off-platform between traders.
          </p>
        </div>

        {/* Message */}
        <div className="card p-4">
          <div className="label mb-2">Message (optional)</div>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Meetup preference, timing, condition notes…"
            className="textarea"
            rows={3}
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className="card p-4 border-stroke-2">
            <div className="label mb-1">Preview</div>
            <p className="text-sm text-muted">{preview}</p>
          </div>
        )}
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-20 left-0 right-0 px-4 pb-4 bg-gradient-to-t from-bg via-bg/90 to-transparent">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            onClick={() => setPreview(buildPreview())}
            className="btn flex-1"
          >
            Preview
          </button>
          <button
            onClick={sendOffer}
            disabled={sending || selectedItems.length === 0}
            className="btn btn-primary flex-1 text-base"
          >
            {sending ? 'Sending…' : 'Send offer'}
          </button>
        </div>
      </div>
    </>
  )
}
