import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BTopBar } from '@/components/b/BTopBar'
import { Avatar } from '@/components/ui/Avatar'
import { TierBadge } from '@/components/ui/TierBadge'
import { formatRelativeTime } from '@/lib/utils'
import { DEMO_SERVICES } from '@/lib/demo-data'
import type { ServiceListing } from '@/types/bartr-b'

interface Props {
  params: { id: string }
}

async function getListing(id: string): Promise<{ listing: ServiceListing | null; isDemo: boolean }> {
  if (id.startsWith('dsvc-')) {
    const demo = DEMO_SERVICES.find(s => s.id === id) ?? null
    return { listing: demo, isDemo: true }
  }

  const supabase = await createClient()
  const { data } = await supabase
    .from('service_listings')
    .select(`
      *,
      profile:profiles(
        id, handle, display_name, avatar_url, bio, tier,
        verified_id, trade_count, follower_count
      )
    `)
    .eq('id', id)
    .single()
  return { listing: (data ?? null) as ServiceListing | null, isDemo: false }
}

export default async function BListingPage({ params }: Props) {
  const { listing, isDemo } = await getListing(params.id)
  if (!listing) notFound()

  return (
    <>
      <BTopBar title={listing.category} back />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '0 0 140px', width: '100%' }}>

        {/* Demo banner */}
        {isDemo && (
          <div style={{
            padding: '10px 16px',
            background: 'var(--gbg)', borderBottom: '1px solid var(--gbd)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--grn)' }}>
              Sample listing — sign up to access real skills
            </span>
            <Link href="/signup" style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--grn)',
              padding: '3px 10px', border: '1px solid var(--gbd)',
              borderRadius: 99, background: 'var(--gbg)', textDecoration: 'none',
            }}>
              Join free →
            </Link>
          </div>
        )}

        <div style={{ padding: '20px 16px 0' }}>

          {/* Header card */}
          <div style={{
            borderRadius: 'var(--rl)', border: '1px solid var(--gbd)',
            background: 'var(--gbg)', padding: '16px', marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--grn)', marginBottom: 6 }}>
                  {listing.category}
                </div>
                <h1 style={{ fontFamily: 'var(--font-instrument-serif)', fontSize: 22, lineHeight: 1.2, color: 'var(--ink)' }}>
                  {listing.title}
                </h1>
              </div>
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 20, fontWeight: 500, color: 'var(--grn)' }}>
                  {listing.credit_rate}c
                </div>
                <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--muted)' }}>
                  {listing.credit_unit}
                </div>
              </div>
            </div>

            {/* Skills */}
            {listing.skills?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {listing.skills.map(skill => (
                  <span key={skill} style={{
                    fontFamily: 'var(--font-dm-mono)', fontSize: 11,
                    padding: '4px 10px', borderRadius: 99,
                    background: 'rgba(26,122,74,0.10)', border: '1px solid var(--gbd)', color: 'var(--grn)',
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{
            background: 'var(--surf)', border: '1px solid var(--brd)',
            borderRadius: 'var(--rl)', padding: '16px', marginBottom: 16,
          }}>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
              About this service
            </div>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {listing.description}
            </p>
            {listing.delivery_time_days && (
              <p style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--faint)', marginTop: 12 }}>
                Typical delivery: {listing.delivery_time_days} day{listing.delivery_time_days !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Portfolio */}
          {listing.portfolio_urls?.length > 0 && (
            <div style={{
              background: 'var(--surf)', border: '1px solid var(--brd)',
              borderRadius: 'var(--rl)', padding: '16px', marginBottom: 16,
            }}>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>
                Portfolio
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {listing.portfolio_urls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontSize: 13, color: 'var(--muted)', textDecoration: 'none',
                  }}>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)' }}>{i + 1}</span>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</span>
                    <span style={{ color: 'var(--faint)' }}>↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Provider */}
          {listing.profile && (
            <Link
              href={`/b/profile/${listing.profile.handle}`}
              style={{ textDecoration: 'none' }}
            >
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: 500, fontSize: 14, color: 'var(--ink)' }}>
                      {listing.profile.display_name ?? listing.profile.handle}
                    </span>
                    <TierBadge tier={listing.profile.tier} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--muted)' }}>
                    {listing.profile.handle}
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)' }}>
                      {listing.profile.trade_count} jobs
                    </span>
                    {listing.profile.verified_id && (
                      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--grn)' }}>
                        ✓ ID verified
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
        </div>
      </main>

      {/* CTA */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        padding: '12px 16px 28px',
        background: 'rgba(246,244,241,0.97)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--brd)',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          {isDemo ? (
            <Link href="/signup" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '14px', borderRadius: 99,
              background: 'var(--grn)', border: '1px solid #136038',
              color: 'white', fontSize: 15, fontWeight: 500,
              textDecoration: 'none',
            }}>
              Join free to post a brief →
            </Link>
          ) : (
            <Link
              href={`/b/briefs/new?provider=${listing.user_id}&listing=${listing.id}`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '14px', borderRadius: 99,
                background: 'var(--grn)', border: '1px solid #136038',
                color: 'white', fontSize: 15, fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Post a brief for this skill →
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
