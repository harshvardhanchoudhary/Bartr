import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { Avatar } from '@/components/ui/Avatar'
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
      .limit(6)
    socialPosts = (posts ?? []) as SellerPost[]
  }

  return { listing: (data ?? null) as Listing | null, isDemo: false, socialPosts }
}

export default async function ListingPage({ params }: Props) {
  const { listing, isDemo, socialPosts } = await getListing(params.id)
  if (!listing) notFound()

  const value = formatValueRange(listing.value_estimate_low, listing.value_estimate_high)
  const images = listing.images ?? []
  const wantsArray = listing.wants ? listing.wants.split(',').map((w: string) => w.trim()).filter(Boolean) : []

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
            <Link href="/signup" style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--gld)',
              padding: '3px 10px', border: '1px solid var(--gldbd)',
              borderRadius: 99, background: 'var(--gldbg)', textDecoration: 'none',
            }}>
              Join free →
            </Link>
          </div>
        )}

        <ListingMediaCarousel title={listing.title} images={images} />

        <div style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, marginBottom: 10 }}>
            <h1 style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 30, lineHeight: 1.1, color: 'var(--ink)' }}>
              {listing.title}
            </h1>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 18, color: 'var(--red)', flexShrink: 0 }}>
              {value}
            </span>
          </div>

          <div style={{ marginBottom: 14 }}>
            <span style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10,
              padding: '4px 10px', borderRadius: 99,
              background: 'var(--bg2)', border: '1px solid var(--brd)', color: 'var(--muted)',
            }}>
              {conditionLabel(listing.condition)}
            </span>
          </div>

          {listing.description && (
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 16 }}>
              {listing.description}
            </p>
          )}

          {wantsArray.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10,
              }}>
                What they&apos;ll accept
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {wantsArray.map((want: string) => (
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

          {socialPosts.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
                Seller social taste
              </div>
              <div style={{ display: 'grid', gap: 8 }}>
                {socialPosts.slice(0, 3).map(post => (
                  <div key={post.id} style={{ padding: '10px 12px', borderRadius: 'var(--r)', background: 'var(--surf)', border: '1px solid var(--brd)' }}>
                    <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)', marginBottom: 4 }}>{post.type}</div>
                    <div style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.5 }}>{post.content}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--brd)', margin: '16px 0' }} />

          {listing.profile && (
            <Link href={`/profile/${listing.profile.handle}`} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px',
                background: 'var(--surf)', border: '1px solid var(--brd)',
                borderRadius: 'var(--rl)', marginBottom: 16,
              }}>
                <Avatar
                  src={listing.profile.avatar_url}
                  alt={listing.profile.display_name ?? listing.profile.handle}
                  size="lg"
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, color: 'var(--ink)', marginBottom: 2, fontSize: 14 }}>
                    {listing.profile.display_name ?? listing.profile.handle}
                  </div>
                  <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--muted)' }}>
                    {listing.profile.handle}
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
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
                <span style={{ color: 'var(--faint)', fontSize: 16 }}>→</span>
              </div>
            </Link>
          )}

          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)', marginBottom: 8 }}>
            Listed {formatRelativeTime(listing.created_at)}
          </div>

          <div style={{
            padding: '10px 12px', borderRadius: 'var(--r)',
            background: 'var(--bg2)', border: '1px solid var(--brd)',
            fontSize: 11, color: 'var(--faint)', lineHeight: 1.5,
          }}>
            Trades logged on the public ledger — trust is visible before signup.
          </div>
        </div>
      </main>

      <OfferGateBar listingId={listing.id} />
    </>
  )
}
