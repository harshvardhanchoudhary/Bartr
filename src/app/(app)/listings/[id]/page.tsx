import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { Avatar } from '@/components/ui/Avatar'
import { TierBadge } from '@/components/ui/TierBadge'
import { OfferGateBar } from '@/components/listings/OfferGateBar'
import { ListingMediaCarousel } from '@/components/listings/ListingMediaCarousel'
import { formatValueRange, conditionLabel, formatRelativeTime } from '@/lib/utils'
import { DEMO_LISTINGS } from '@/lib/demo-data'
import type { Listing } from '@/types'

interface Props {
  params: { id: string }
}

interface SellerPost {
  id: string
  content: string
  type: string
  created_at: string
}

const CONDITION_DOT: Record<string, string> = {
  new: '#16a34a', like_new: '#16a34a', good: '#d97706', fair: '#dc2626', poor: '#9ca3af',
}

async function getListing(id: string): Promise<{ listing: Listing | null; isDemo: boolean; socialPosts: SellerPost[] }> {
  if (id.startsWith('demo-')) {
    const demo = DEMO_LISTINGS.find(l => l.id === id) ?? null
    return { listing: demo, isDemo: true, socialPosts: [] }
  }

  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select(`
      *,
      profile:profiles(
        id, handle, display_name, avatar_url, bio, tier,
        verified_id, verified_phone, verified_photo,
        follower_count, trade_count
      )
    `)
    .eq('id', id)
    .single()

  const ownerId = (data as { user_id?: string } | null)?.user_id
  let socialPosts: SellerPost[] = []
  if (ownerId) {
    const { data: posts } = await supabase
      .from('social_posts')
      .select('id, content, type, created_at')
      .eq('user_id', ownerId)
      .order('created_at', { ascending: false })
      .limit(4)
    socialPosts = (posts ?? []) as SellerPost[]
  }

  return { listing: (data ?? null) as Listing | null, isDemo: false, socialPosts }
}

export default async function ListingPage({ params }: Props) {
  const { listing, isDemo, socialPosts } = await getListing(params.id)
  if (!listing) notFound()

  const value = formatValueRange(listing.value_estimate_low, listing.value_estimate_high)
  const images = listing.images ?? []
  const wantsArr = listing.wants
    ? listing.wants.split(',').map((w: string) => w.trim()).filter(Boolean)
    : []

  return (
    <>
      <TopBar back title={listing.category} />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '0 0 140px', width: '100%' }}>

        {isDemo && (
          <div style={{
            padding: '10px 16px',
            background: 'var(--gldbg)', borderBottom: '1px solid var(--gldbd)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--gld)' }}>
              Sample listing — sign up to see real trades
            </span>
            <Link href="/login" style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--gld)',
              padding: '3px 10px', border: '1px solid var(--gldbd)',
              borderRadius: 99, background: 'var(--gldbg)', textDecoration: 'none',
            }}>
              Join free →
            </Link>
          </div>
        )}

        <ListingMediaCarousel title={listing.title} images={images} />

        <div style={{ padding: '18px 16px 0' }}>

          {/* Title + value */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <h1 style={{
                fontFamily: 'var(--font-instrument-serif)',
                fontSize: 'clamp(22px, 5vw, 30px)',
                lineHeight: 1.1, color: 'var(--ink)', flex: 1,
              }}>
                {listing.title}
              </h1>
              {value && (
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <div style={{
                    fontFamily: 'var(--font-dm-mono)', fontSize: 20,
                    fontWeight: 600, color: 'var(--red)', lineHeight: 1,
                  }}>
                    {value}
                  </div>
                  <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 9, color: 'var(--faint)', marginTop: 2 }}>
                    est. value
                  </div>
                </div>
              )}
            </div>

            {/* Condition + category */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontFamily: 'var(--font-dm-mono)', fontSize: 10,
                padding: '4px 10px', borderRadius: 99,
                background: 'var(--bg2)', border: '1px solid var(--brd)', color: 'var(--ink2)',
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                  background: CONDITION_DOT[listing.condition] ?? 'var(--faint)',
                }} />
                {conditionLabel(listing.condition)}
              </span>
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)' }}>
                {listing.category}{listing.location ? ` · ${listing.location}` : ''}
              </span>
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <div style={{
              background: 'var(--surf)', border: '1px solid var(--brd)',
              borderRadius: 12, padding: '16px', marginBottom: 16,
            }}>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8,
              }}>
                Description
              </div>
              <p style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.75 }}>
                {listing.description}
              </p>
            </div>
          )}

          {/* What they'll accept */}
          {wantsArr.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10,
              }}>
                What they&apos;ll accept
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {wantsArr.map((want: string) => (
                  <span key={want} style={{
                    fontFamily: 'var(--font-dm-mono)', fontSize: 11,
                    padding: '5px 12px', borderRadius: 99,
                    background: 'var(--gbg)', border: '1px solid var(--gbd)', color: 'var(--grn)',
                  }}>
                    {want}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Seller taste */}
          {socialPosts.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10,
              }}>
                Seller&apos;s taste
              </div>
              <div style={{ display: 'grid', gap: 8 }}>
                {socialPosts.slice(0, 3).map(post => (
                  <div key={post.id} style={{
                    padding: '10px 12px', borderRadius: 10,
                    background: 'var(--surf)', border: '1px solid var(--brd)',
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                      color: 'var(--faint)', marginBottom: 4,
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                    }}>
                      {post.type}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.5 }}>
                      {post.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seller card */}
          {listing.profile && (
            <Link href={`/profile/${listing.profile.handle}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 14 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                background: 'var(--surf)', border: '1px solid var(--brd)',
                borderRadius: 12, cursor: 'pointer',
              }}>
                <Avatar
                  src={listing.profile.avatar_url}
                  alt={listing.profile.display_name ?? listing.profile.handle}
                  size="lg"
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: 500, fontSize: 14, color: 'var(--ink)' }}>
                      {listing.profile.display_name ?? listing.profile.handle}
                    </span>
                    <TierBadge tier={listing.profile.tier} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
                    {listing.profile.handle}
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)' }}>
                      {listing.profile.trade_count ?? 0} trades
                    </span>
                    {listing.profile.verified_id && (
                      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--grn)' }}>
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>
                <span style={{ color: 'var(--faint)', fontSize: 18, flexShrink: 0 }}>→</span>
              </div>
            </Link>
          )}

          {/* Meta footer */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 12px', borderRadius: 10,
            background: 'var(--bg2)', border: '1px solid var(--brd)',
          }}>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)' }}>
              Listed {formatRelativeTime(listing.created_at)}
            </span>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)' }}>
              Trades logged publicly
            </span>
          </div>
        </div>
      </main>

      <OfferGateBar listingId={listing.id} />
    </>
  )
}
