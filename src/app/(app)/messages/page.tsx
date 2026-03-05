import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { Avatar } from '@/components/ui/Avatar'
import { Chip } from '@/components/ui/Chip'
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

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/messages')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  const threads = await getThreads(user.id)

  return (
    <>
      <TopBar title="Messages" />

      <main className="max-w-2xl mx-auto px-4 py-4 w-full">
        {threads.length > 0 ? (
          <div className="space-y-2">
            {threads.map(thread => (
              <Link
                key={thread.id}
                href={`/messages/${thread.id}`}
                className="card p-4 flex items-start gap-3 hover:border-stroke-2 transition-colors block"
              >
                <div className="avatar-md bg-surface-2 border border-stroke rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-muted-2 text-lg">◻</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="font-semibold text-sm truncate">
                      {thread.listing?.title ?? 'Listing'}
                    </div>
                    {thread.last_message_at && (
                      <span className="text-xs text-muted-2 flex-shrink-0 font-mono">
                        {formatRelativeTime(thread.last_message_at)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <Chip className="text-[10px]">{thread.listing?.category}</Chip>
                    <span className="text-xs font-mono text-red-light">
                      {formatValueRange(
                        thread.listing?.value_estimate_low ?? null,
                        thread.listing?.value_estimate_high ?? null
                      )}
                    </span>
                  </div>

                  {thread.last_message && (
                    <p className="text-xs text-muted truncate">{thread.last_message}</p>
                  )}

                  {thread.latest_offer && (
                    <div className="mt-1.5">
                      <Chip
                        variant={
                          thread.latest_offer.status === 'accepted' ? 'green' :
                          thread.latest_offer.status === 'completed' ? 'green' :
                          thread.latest_offer.status === 'declined' ? 'red' :
                          'default'
                        }
                        className="text-[10px]"
                      >
                        Offer: {thread.latest_offer.status}
                      </Chip>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted">
            <div className="text-4xl mb-4">◻</div>
            <p className="text-sm mb-4">No messages yet.</p>
            <Link href="/browse" className="btn btn-primary text-sm">
              Browse listings
            </Link>
          </div>
        )}
      </main>
    </>
  )
}
