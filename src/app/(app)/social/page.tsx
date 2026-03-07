import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { Avatar } from '@/components/ui/Avatar'
import { Chip } from '@/components/ui/Chip'
import { DEMO_POSTS } from '@/lib/demo-data'
import { TierBadge } from '@/components/ui/TierBadge'
import { SocialActions } from '@/components/social/SocialActions'
import { SocialComposer } from '@/components/social/SocialComposer'
import { formatRelativeTime, formatValueRange } from '@/lib/utils'
import type { SocialPost } from '@/types'

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

const postTypeLabel: Record<string, { label: string; variant: 'red' | 'green' | 'default' }> = {
  trade_win: { label: 'Trade win', variant: 'green' },
  accepted_pattern: { label: 'Accepted', variant: 'red' },
  looking_for: { label: 'Looking for', variant: 'default' },
  joined: { label: 'New member', variant: 'default' },
}

export default async function SocialPage() {
  const dbPosts = await getPosts()
  const posts = dbPosts.length > 0 ? dbPosts : DEMO_POSTS

  return (
    <>
      <TopBar
        right={
          <Link href="/list" className="btn btn-primary text-xs px-3 py-2">
            + List
          </Link>
        }
      />

      <main className="max-w-2xl mx-auto px-4 py-4 w-full space-y-3">
        <SocialComposer />

        {/* Feed */}
        {posts.length > 0 ? (
          posts.map((post: typeof posts[0]) => {
            const type = postTypeLabel[post.type] ?? { label: post.type, variant: 'default' as const }
            return (
              <article key={post.id} className="card overflow-hidden">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 p-4 pb-3">
                  <div className="flex items-center gap-3">
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
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/profile/${post.profile?.handle ?? '#'}`}
                          className="text-sm font-semibold hover:text-muted transition-colors"
                        >
                          {post.profile?.display_name ?? post.profile?.handle}
                        </Link>
                        {post.profile && <TierBadge tier={post.profile.tier} />}
                      </div>
                      <div className="text-xs text-muted-2 mt-0.5">
                        {formatRelativeTime(post.created_at)}
                      </div>
                    </div>
                  </div>
                  <Chip variant={type.variant as 'red' | 'green' | 'default'}>{type.label}</Chip>
                </div>

                {/* Content */}
                <div className="px-4 pb-3">
                  <p className="text-sm leading-relaxed">{post.content}</p>
                </div>

                {/* Linked listing */}
                {post.listing && (
                  <Link
                    href={`/listings/${post.listing.id}`}
                    className="mx-4 mb-3 p-3 bg-surface-2 rounded border border-stroke flex items-center justify-between hover:border-stroke-2 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-mono text-muted-2 uppercase mb-0.5">
                        {post.listing.category}
                      </div>
                      <div className="text-sm font-medium line-clamp-1">{post.listing.title}</div>
                    </div>
                    <div className="text-red-light font-mono text-sm flex-shrink-0 ml-3">
                      {formatValueRange(post.listing.value_estimate_low, post.listing.value_estimate_high)}
                    </div>
                  </Link>
                )}

                {/* Actions */}
                <SocialActions
                  postId={post.id}
                  likeCount={post.like_count}
                  commentCount={post.comment_count}
                  listingId={post.listing_id}
                />
              </article>
            )
          })
        ) : (
          <div className="text-center py-16 text-muted">
            <div className="text-4xl mb-4">◎</div>
            <p className="text-sm">No posts yet. Make a trade and share your win!</p>
          </div>
        )}
      </main>
    </>
  )
}
