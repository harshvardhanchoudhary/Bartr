import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { formatRelativeTime, formatValueRange } from '@/lib/utils'
import { DEMO_THREADS } from '@/lib/demo-data'
import type { Thread } from '@/types'

async function getThreads(userId: string): Promise<Thread[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('threads')
    .select(`
      *,
      listing:listings(id, title, category, value_estimate_low, value_estimate_high),
      latest_offer:offers(id, status, offered_items, topup_amount, topup_currency)
    `)
    .contains('participant_ids', [userId])
    .order('last_message_at', { ascending: false })
  return (data ?? []) as Thread[]
}

const offerStatusStyle = (status: string) => {
  if (status === 'accepted' || status === 'completed') return { bg: 'var(--gbg)', border: 'var(--gbd)', color: 'var(--grn)' }
  if (status === 'declined') return { bg: 'var(--rbg)', border: 'var(--rbd)', color: 'var(--red)' }
  return { bg: 'var(--bg2)', border: 'var(--brd)', color: 'var(--muted)' }
}

function ThreadCard({
  href,
  icon,
  title,
  otherName,
  category,
  valueLow,
  valueHigh,
  lastMessage,
  lastMessageAt,
  offerStatus,
}: {
  href: string
  icon: string
  title: string
  otherName: string
  category?: string
  valueLow?: number | null
  valueHigh?: number | null
  lastMessage?: string
  lastMessageAt?: string
  offerStatus?: string
}) {
  const ss = offerStatus ? offerStatusStyle(offerStatus) : null
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '14px 16px',
        background: 'var(--surf)', border: '1px solid var(--brd)',
        borderRadius: 'var(--rl)', cursor: 'pointer',
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 'var(--r)',
          background: 'var(--bg2)', border: '1px solid var(--brd)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: 20,
        }}>
          {icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
            <div style={{ fontWeight: 500, color: 'var(--ink)', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {title}
            </div>
            {lastMessageAt && (
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)', flexShrink: 0 }}>
                {formatRelativeTime(lastMessageAt)}
              </span>
            )}
          </div>

          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--muted)', marginBottom: 5 }}>
            with {otherName}
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
            {category && (
              <span style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.06em',
                padding: '2px 7px', borderRadius: 99,
                background: 'var(--bg2)', border: '1px solid var(--brd)', color: 'var(--muted)',
              }}>
                {category}
              </span>
            )}
            {(valueLow || valueHigh) && (
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--red)' }}>
                {formatValueRange(valueLow ?? null, valueHigh ?? null)}
              </span>
            )}
            {ss && offerStatus && (
              <span style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                padding: '2px 8px', borderRadius: 99,
                background: ss.bg, border: `1px solid ${ss.border}`, color: ss.color,
              }}>
                {offerStatus}
              </span>
            )}
          </div>

          {lastMessage && (
            <p style={{ fontSize: 12, color: 'var(--faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {lastMessage}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

const ICONS = ['📷', '🎵', '💻', '👟', '📚', '🎸']

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // ── Guest mode — fully explorable demo inbox ───────────────────────────
  if (!user) {
    return (
      <>
        <TopBar title="Messages" />
        <main style={{ maxWidth: 680, margin: '0 auto', padding: '16px 16px 80px' }}>
          <div style={{
            padding: '10px 14px', marginBottom: 16, borderRadius: 'var(--rl)',
            background: 'var(--gldbg)', border: '1px solid var(--gldbd)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--gld)' }}>
              Sample inbox — your real trade threads appear here
            </span>
            <Link href="/signup" style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--gld)',
              padding: '3px 10px', border: '1px solid var(--gldbd)',
              borderRadius: 99, background: 'var(--gldbg)', textDecoration: 'none',
            }}>
              Join free →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DEMO_THREADS.map((thread, i) => (
              <ThreadCard
                key={thread.id}
                href={`/messages/${thread.id}`}
                icon={ICONS[i] ?? '◻'}
                title={thread.listing.title}
                otherName={thread.other_display_name}
                category={thread.listing.category}
                valueLow={thread.listing.value_estimate_low}
                valueHigh={thread.listing.value_estimate_high}
                lastMessage={thread.last_message}
                lastMessageAt={thread.last_message_at}
                offerStatus={thread.offer.status}
              />
            ))}
          </div>
        </main>
      </>
    )
  }

  // ── Authenticated — real threads ───────────────────────────────────────
  const threads = await getThreads(user.id)

  return (
    <>
      <TopBar title="Messages" />
      <main style={{ maxWidth: 680, margin: '0 auto', padding: '16px 16px 80px' }}>
        {threads.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {threads.map((thread, i) => {
              const t = thread as Thread & {
                listing?: { title: string; category: string; value_estimate_low: number; value_estimate_high: number }
                latest_offer?: { status: string }
              }
              return (
                <ThreadCard
                  key={thread.id}
                  href={`/messages/${thread.id}`}
                  icon={ICONS[i % ICONS.length] ?? '◻'}
                  title={t.listing?.title ?? 'Trade thread'}
                  otherName="Other trader"
                  category={t.listing?.category}
                  valueLow={t.listing?.value_estimate_low}
                  valueHigh={t.listing?.value_estimate_high}
                  lastMessage={thread.last_message}
                  lastMessageAt={thread.last_message_at}
                  offerStatus={t.latest_offer?.status}
                />
              )
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16, color: 'var(--faint)' }}>◻</div>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>
              No messages yet. Browse listings and make an offer.
            </p>
            <Link href="/browse" style={{
              display: 'inline-flex', padding: '11px 24px', borderRadius: 99,
              background: 'var(--red)', color: 'white',
              fontSize: 14, fontWeight: 500, textDecoration: 'none',
              border: '1px solid #A8251F',
            }}>
              Browse listings
            </Link>
          </div>
        )}
      </main>
    </>
  )
}
