import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { Avatar } from '@/components/ui/Avatar'
import { TierBadge } from '@/components/ui/TierBadge'
import { SocialActions } from '@/components/social/SocialActions'
import { SocialComposer } from '@/components/social/SocialComposer'
import { formatRelativeTime, formatValueRange } from '@/lib/utils'
import { DEMO_POSTS } from '@/lib/demo-data'
import type { SocialPost } from '@/types'

const POST_TYPE_STYLES: Record<string, { label: string; bg: string; brd: string; color: string }> = {
  trade_win:        { label: 'Trade win',   bg: 'var(--gbg)',   brd: 'var(--gbd)',   color: 'var(--grn)' },
  accepted_pattern: { label: 'Accepted',    bg: 'var(--rbg)',   brd: 'var(--rbd)',   color: 'var(--red)' },
  looking_for:      { label: 'Looking for', bg: 'var(--blubg)', brd: 'var(--blubd)', color: 'var(--blu)' },
  joined:           { label: 'New member',  bg: 'var(--bg2)',   brd: 'var(--brd)',   color: 'var(--muted)' },
}

async function getPosts(): Promise<SocialPost[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('social_posts')
    .select(`
      *,
      profile:profiles(id, handle, display_name, avatar_url, tier),
      listing:listings(id, title, category, value_estimate_low, value_estimate_high, condition)
    `)
    .order('created_at', { ascending: false })
    .limit(30)
  return (data ?? []) as SocialPost[]
}

export default async function SocialPage() {
  const dbPosts = await getPosts()
  const posts = dbPosts.length > 0 ? dbPosts : DEMO_POSTS

  return (
    <>
      <TopBar
        right={
          <Link href="/list" style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '6px 14px', borderRadius: 99,
            background: 'var(--red)', color: 'white',
            fontFamily: 'var(--font-dm-sans)', fontSize: 13, fontWeight: 500,
            border: '1px solid var(--rbn)', textDecoration: 'none',
          }}>
            + List
          </Link>
        }
      />

      <main style={{ maxWidth: 640, margin: '0 auto', padding: '16px 16px 100px', width: '100%' }}>

        <div style={{ marginBottom: 20 }}>
          <SocialComposer />
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
        }}>
          <span style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--muted)',
          }}>
            Community
          </span>
          {dbPosts.length === 0 && (
            <span style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 9,
              padding: '2px 8px', borderRadius: 99,
              background: 'var(--gldbg)', border: '1px solid var(--gldbd)', color: 'var(--gld)',
            }}>
              Sample posts
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {posts.map((post: SocialPost) => {
            const ts = POST_TYPE_STYLES[post.type] ?? POST_TYPE_STYLES.joined
            return (
              <article key={post.id} style={{
                background: 'var(--surf)', border: '1px solid var(--brd)',
                borderRadius: 'var(--rl)', overflow: 'hidden',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                  gap: 12, padding: '14px 16px 10px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {post.profile && (
                      <Link href={`/profile/${post.profile.handle}`}>
                        <Avatar
                          src={post.profile.avatar_url}
                          alt={post.profile.display_name ?? post.profile.handle}
                          size="md"
                        />
                      </Link>
                    )}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Link
                          href={`/profile/${post.profile?.handle ?? '#'}`}
                          style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', textDecoration: 'none' }}
                        >
                          {post.profile?.display_name ?? post.profile?.handle}
                        </Link>
                        {post.profile && <TierBadge tier={post.profile.tier} />}
                      </div>
                      <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)', marginTop: 1 }}>
                        {formatRelativeTime(post.created_at)}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    padding: '3px 8px', borderRadius: 99, flexShrink: 0,
                    background: ts.bg, border: `1px solid ${ts.brd}`, color: ts.color,
                  }}>
                    {ts.label}
                  </span>
                </div>

                <div style={{ padding: '0 16px 12px' }}>
                  <p style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.65 }}>{post.content}</p>
                </div>

                {post.listing && (
                  <Link href={`/listings/${post.listing.id}`} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    margin: '0 16px 12px', padding: '10px 12px',
                    background: 'var(--bg2)', border: '1px solid var(--brd)',
                    borderRadius: 'var(--rl)', textDecoration: 'none',
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                        color: 'var(--faint)', marginBottom: 3,
                      }}>
                        {post.listing.category}
                      </div>
                      <div style={{
                        fontSize: 13, fontWeight: 500, color: 'var(--ink)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {post.listing.title}
                      </div>
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-dm-mono)', fontSize: 13,
                      fontWeight: 500, color: 'var(--red)', flexShrink: 0, marginLeft: 12,
                    }}>
                      {formatValueRange(post.listing.value_estimate_low, post.listing.value_estimate_high)}
                    </div>
                  </Link>
                )}

                <div style={{ borderTop: '1px solid var(--brd)', padding: '8px 12px' }}>
                  <SocialActions
                    postId={post.id}
                    likeCount={post.like_count}
                    commentCount={post.comment_count}
                    listingId={post.listing_id}
                  />
                </div>
              </article>
            )
          })}
        </div>
      </main>
    </>
  )
}
