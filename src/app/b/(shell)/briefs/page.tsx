import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BTopBar } from '@/components/b/BTopBar'
import { Avatar } from '@/components/ui/Avatar'
import { formatRelativeTime } from '@/lib/utils'
import type { Brief } from '@/types/bartr-b'

async function getBriefs(): Promise<Brief[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('briefs')
    .select(`
      *,
      profile:profiles(id, handle, display_name, avatar_url, tier)
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(30)
  return (data ?? []) as Brief[]
}

export default async function BriefsPage() {
  const briefs = await getBriefs()

  return (
    <>
      <BTopBar
        title="Briefs"
        right={
          <Link
            href="/b/briefs/new"
            className="text-xs px-3 py-2 rounded-full border font-medium"
            style={{
              background: 'rgba(45,106,79,0.80)',
              borderColor: 'rgba(45,106,79,0.55)',
              color: 'white',
            }}
          >
            + Post brief
          </Link>
        }
      />

      <main className="max-w-2xl mx-auto px-4 py-4 w-full">
        <p className="text-muted text-sm mb-4">
          Open briefs — scope is locked when matched. Apply with your proposed Credits and timeline.
        </p>

        {briefs.length > 0 ? (
          <div className="space-y-3">
            {briefs.map(brief => (
              <Link
                key={brief.id}
                href={`/b/briefs/${brief.id}`}
                className="block rounded-md border p-4 transition-colors"
                style={{
                  background: 'rgba(45,106,79,0.04)',
                  borderColor: 'rgba(45,106,79,0.15)',
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span
                      className="font-mono text-[10px] uppercase tracking-widest mb-1 block"
                      style={{ color: '#52B788' }}
                    >
                      {brief.category}
                    </span>
                    <h3 className="font-semibold text-sm">{brief.title}</h3>
                  </div>
                  {brief.budget_credits && (
                    <div
                      className="font-mono text-sm font-medium flex-shrink-0"
                      style={{ color: '#52B788' }}
                    >
                      {brief.budget_credits}c
                    </div>
                  )}
                </div>

                <p className="text-xs text-muted line-clamp-2 mb-3">{brief.description}</p>

                {brief.skills_needed?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {brief.skills_needed.slice(0, 4).map(s => (
                      <span
                        key={s}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(45,106,79,0.15)', color: '#52B788' }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  {brief.profile && (
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={brief.profile.avatar_url}
                        alt={brief.profile.handle}
                        size="sm"
                      />
                      <span className="text-xs text-muted">{brief.profile.handle}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 ml-auto">
                    {(brief.application_count ?? 0) > 0 && (
                      <span className="text-xs text-muted-2 font-mono">
                        {brief.application_count} applied
                      </span>
                    )}
                    <span className="text-xs text-muted-2 font-mono">
                      {formatRelativeTime(brief.created_at)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted">
            <div className="text-4xl mb-4" style={{ color: 'rgba(45,106,79,0.5)' }}>◎</div>
            <p className="text-sm mb-4">No open briefs yet.</p>
            <Link
              href="/b/briefs/new"
              className="inline-flex items-center px-5 py-2.5 rounded-full text-sm border font-medium"
              style={{
                background: 'rgba(45,106,79,0.80)',
                borderColor: 'rgba(45,106,79,0.55)',
                color: 'white',
              }}
            >
              Post a brief
            </Link>
          </div>
        )}
      </main>
    </>
  )
}
