import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BTopBar } from '@/components/b/BTopBar'
import { Avatar } from '@/components/ui/Avatar'
import { formatRelativeTime } from '@/lib/utils'
import type { Brief } from '@/types/bartr-b'

const CATEGORY_EMOJI: Record<string, string> = {
  Design: '🎨', Development: '💻', Writing: '✍️',
  Marketing: '📣', Video: '🎬', Music: '🎧',
  Photography: '📷', Consulting: '💡', Other: '◎',
}

async function getBriefs(): Promise<Brief[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('briefs')
    .select('*, profile:profiles(id, handle, display_name, avatar_url, tier)')
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
        title="Open Briefs"
        right={
          <Link href="/b/briefs/new" style={{
            padding: '5px 14px', borderRadius: 99,
            background: 'var(--grn)', color: 'white',
            fontFamily: 'var(--font-dm-sans)', fontSize: 12, fontWeight: 500,
            border: '1px solid var(--gbn)', textDecoration: 'none',
          }}>
            + Post brief
          </Link>
        }
      />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '16px 16px 80px', width: '100%' }}>

        {/* Explainer strip */}
        <div style={{
          padding: '14px 16px', marginBottom: 20,
          background: 'var(--surf)', border: '1px solid var(--gbd)',
          borderRadius: 'var(--rl)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 9, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: 'var(--grn)', marginBottom: 4,
            }}>
              What are briefs?
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.5 }}>
              Scoped work requests. Browse, then apply with your proposed Credits and timeline.
            </p>
          </div>
          <Link href="/b/list" style={{
            flexShrink: 0, fontFamily: 'var(--font-dm-mono)', fontSize: 10,
            color: 'var(--grn)', border: '1px solid var(--gbd)',
            background: 'var(--gbg)', borderRadius: 99, padding: '6px 12px',
            textDecoration: 'none', whiteSpace: 'nowrap',
          }}>
            Offer a skill →
          </Link>
        </div>

        {briefs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {briefs.map(brief => (
              <BriefCard key={brief.id} brief={brief} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.4 }}>✦</div>
            <p style={{ fontSize: 14, marginBottom: 20 }}>No open briefs yet — be the first to post one.</p>
            <Link href="/b/briefs/new" style={{
              display: 'inline-flex', padding: '11px 24px', borderRadius: 99,
              background: 'var(--grn)', color: 'white',
              fontSize: 14, fontWeight: 500, textDecoration: 'none',
              border: '1px solid var(--gbn)',
            }}>
              Post a brief
            </Link>
          </div>
        )}
      </main>
    </>
  )
}

function BriefCard({ brief }: { brief: Brief }) {
  const emoji = CATEGORY_EMOJI[brief.category] ?? '◎'

  return (
    <Link href={`/b/briefs/${brief.id}`} style={{ textDecoration: 'none' }}>
      <div
        className="hover-lift"
        style={{
          background: 'var(--surf)', border: '1px solid var(--brd)',
          borderRadius: 'var(--rl)', overflow: 'hidden',
        }}
      >
        {/* Header bar */}
        <div style={{
          padding: '10px 14px',
          background: 'var(--gbg)', borderBottom: '1px solid var(--gbd)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>{emoji}</span>
            <span style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 9,
              textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--grn)',
            }}>
              {brief.category}
            </span>
          </div>
          {brief.budget_credits && (
            <span style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 14, fontWeight: 500, color: 'var(--grn)',
            }}>
              {brief.budget_credits}c
            </span>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '12px 14px' }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginBottom: 6, lineHeight: 1.3 }}>
            {brief.title}
          </h3>
          <p style={{
            fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 10,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {brief.description}
          </p>

          {brief.skills_needed?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
              {brief.skills_needed.slice(0, 4).map((s: string) => (
                <span key={s} style={{
                  fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                  padding: '2px 8px', borderRadius: 99,
                  background: 'var(--gbg)', border: '1px solid var(--gbd)', color: 'var(--grn)',
                }}>
                  {s}
                </span>
              ))}
            </div>
          )}

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: 10, borderTop: '1px solid var(--brd)',
          }}>
            {brief.profile ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Avatar src={brief.profile.avatar_url} alt={brief.profile.handle} size="sm" />
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{brief.profile.handle}</span>
              </div>
            ) : <span />}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {(brief.application_count ?? 0) > 0 && (
                <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--muted)' }}>
                  {brief.application_count} applied
                </span>
              )}
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)' }}>
                {formatRelativeTime(brief.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
