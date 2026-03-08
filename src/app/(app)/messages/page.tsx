import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { formatRelativeTime, formatValueRange } from '@/lib/utils'
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
  if (status === 'accepted' || status === 'completed') {
    return { bg: 'var(--gbg)', border: 'var(--gbd)', color: 'var(--grn)' }
  }
  if (status === 'declined') {
    return { bg: 'var(--rbg)', border: 'var(--rbd)', color: 'var(--red)' }
  }
  return { bg: 'var(--bg2)', border: 'var(--brd)', color: 'var(--muted)' }
}

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const threads = user ? await getThreads(user.id) : []

  return (
    <>
      <TopBar title="Messages" />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '16px 16px 80px' }}>
        {!user && (
          <div style={{
            marginBottom: 12,
            padding: '12px 14px',
            background: 'var(--blubg)',
            border: '1px solid var(--blubd)',
            borderRadius: 'var(--rl)',
          }}>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--blu)', marginBottom: 6 }}>
              Commit-time signup
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink2)', marginBottom: 8, lineHeight: 1.6 }}>
              Browse everything first. Messages unlock when you start or receive an offer.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Link href="/browse" className="btn">Back to browse</Link>
              <Link href="/login?next=/messages" className="btn btn-primary">Sign in to open inbox</Link>
            </div>
          </div>
        )}

        {user && threads.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {threads.map(thread => {
              const offerStatus = thread.latest_offer?.status
              const statusStyle = offerStatus ? offerStatusStyle(offerStatus) : null
              return (
                <Link
                  key={thread.id}
                  href={`/messages/${thread.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '14px 16px',
                    background: 'var(--surf)', border: '1px solid var(--brd)',
                    borderRadius: 'var(--rl)',
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 'var(--r)',
                      background: 'var(--bg2)', border: '1px solid var(--brd)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, fontSize: 18, color: 'var(--faint)',
                    }}>
                      ◻
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                        <div style={{ fontWeight: 500, color: 'var(--ink)', fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {thread.listing?.title ?? 'Trade thread'}
                        </div>
                        {thread.last_message_at && (
                          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)', flexShrink: 0 }}>
                            {formatRelativeTime(thread.last_message_at)}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                        {thread.listing?.category && (
                          <span style={{
                            fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.06em',
                            padding: '2px 7px', borderRadius: 99,
                            background: 'var(--bg2)', border: '1px solid var(--brd)', color: 'var(--muted)',
                          }}>
                            {thread.listing.category}
                          </span>
                        )}
                        <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--red)' }}>
                          {formatValueRange(thread.listing?.value_estimate_low ?? null, thread.listing?.value_estimate_high ?? null)}
                        </span>
                      </div>

                      {thread.last_message && (
                        <p style={{ fontSize: 12, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: offerStatus ? 6 : 0 }}>
                          {thread.last_message}
                        </p>
                      )}

                      {statusStyle && offerStatus && (
                        <span style={{
                          display: 'inline-flex',
                          fontFamily: 'var(--font-dm-mono)', fontSize: 10,
                          padding: '3px 8px', borderRadius: 99,
                          background: statusStyle.bg,
                          border: `1px solid ${statusStyle.border}`,
                          color: statusStyle.color,
                        }}>
                          {offerStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : user ? (
          <div style={{ textAlign: 'center', padding: '52px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>◻</div>
            <p style={{ fontSize: 14, marginBottom: 16 }}>No conversations yet.</p>
            <Link href="/browse" className="btn btn-primary">Browse listings</Link>
          </div>
        ) : null}
      </main>
    </>
  )
}
