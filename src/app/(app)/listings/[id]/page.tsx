import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { Avatar } from '@/components/ui/Avatar'
import { formatValueRange, conditionLabel, formatRelativeTime } from '@/lib/utils'
import type { Listing } from '@/types'

interface Props {
  params: { id: string }
}

async function getListing(id: string): Promise<Listing | null> {
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
  return (data ?? null) as Listing | null
}

export default async function ListingPage({ params }: Props) {
  const listing = await getListing(params.id)
  if (!listing) notFound()

  const value = formatValueRange(listing.value_estimate_low, listing.value_estimate_high)
  const images = listing.images ?? []
  const wantsArray = listing.wants ? listing.wants.split(',').map((w: string) => w.trim()).filter(Boolean) : []

  return (
    <>
      <TopBar back title={listing.category} />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '0 0 140px', width: '100%' }}>

        {/* Main image */}
        <div style={{
          position: 'relative', aspectRatio: '4/3',
          background: 'var(--bg2)', overflow: 'hidden',
        }}>
          {images[0] ? (
            <Image
              src={images[0]}
              alt={listing.title}
              fill
              priority
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 680px) 100vw, 680px"
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 64, color: 'var(--faint)',
            }}>
              ◻
            </div>
          )}

          {/* Condition badge */}
          <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
            <span style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10,
              padding: '4px 10px', borderRadius: 99,
              background: 'rgba(253,252,250,0.92)', border: '1px solid var(--brd)',
              color: 'var(--ink2)',
            }}>
              {conditionLabel(listing.condition)}
            </span>
          </div>
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div style={{
            display: 'flex', gap: 8, padding: '8px 16px',
            overflowX: 'auto', background: 'var(--bg2)',
            borderBottom: '1px solid var(--brd)',
          }}>
            {images.slice(1, 6).map((img, i) => (
              <div key={i} style={{
                flexShrink: 0, width: 64, height: 64,
                borderRadius: 'var(--r)', overflow: 'hidden',
                position: 'relative', border: '1px solid var(--brd)',
              }}>
                <Image src={img} alt="" fill style={{ objectFit: 'cover' }} sizes="64px" />
              </div>
            ))}
          </div>
        )}

        <div style={{ padding: '20px 16px 0' }}>

          {/* Title + value */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
            <h1 style={{
              fontFamily: 'var(--font-instrument-serif)',
              fontSize: 24, lineHeight: 1.2, color: 'var(--ink)',
            }}>
              {listing.title}
            </h1>
            <div style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 18,
              fontWeight: 500, color: 'var(--red)', flexShrink: 0,
            }}>
              {value}
            </div>
          </div>

          {/* Tags row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {[listing.category, conditionLabel(listing.condition), listing.location].filter(Boolean).map(tag => (
              <span key={tag} style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.04em',
                padding: '4px 10px', borderRadius: 99,
                background: 'var(--bg2)', border: '1px solid var(--brd)', color: 'var(--muted)',
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Description */}
          {listing.description && (
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 20 }}>
              {listing.description}
            </p>
          )}

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--brd)', margin: '16px 0' }} />

          {/* What they want — social proof */}
          {wantsArray.length > 0 && (
            <div style={{ marginBottom: 20 }}>
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

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--brd)', margin: '16px 0' }} />

          {/* Seller card */}
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

          {/* Listed time */}
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)', marginBottom: 8 }}>
            Listed {formatRelativeTime(listing.created_at)}
          </div>

          {/* Trust note */}
          <div style={{
            padding: '10px 12px', borderRadius: 'var(--r)',
            background: 'var(--bg2)', border: '1px solid var(--brd)',
            fontSize: 11, color: 'var(--faint)', lineHeight: 1.5,
          }}>
            Trades logged on the public ledger — that&apos;s the trust layer. No escrow, no payments on Bartr.
          </div>
        </div>
      </main>

      {/* Sticky offer bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        padding: '12px 16px 24px',
        background: 'rgba(246,244,241,0.96)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--brd)',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', gap: 10 }}>
          <Link
            href={`/messages?listing=${listing.id}`}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '13px', borderRadius: 99,
              border: '1px solid var(--brd2)', background: 'var(--surf)',
              color: 'var(--ink2)', fontSize: 14, fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Message
          </Link>
          <Link
            href={`/offer/${listing.id}`}
            style={{
              flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '13px', borderRadius: 99,
              background: 'var(--red)', border: '1px solid #A8251F',
              color: 'white', fontSize: 15, fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Make offer →
          </Link>
        </div>
      </div>
    </>
  )
}
