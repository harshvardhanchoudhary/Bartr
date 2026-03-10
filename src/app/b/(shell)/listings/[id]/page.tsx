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

const CATEGORY_EMOJI: Record<string, string> = {
  Design: '🎨', Development: '💻', Writing: '✍️',
  Marketing: '📣', Video: '🎬', Music: '🎧',
  Photography: '📷', Consulting: '💡', Other: '◎',
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

  const emoji = CATEGORY_EMOJI[listing.category] ?? '◎'

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
            <Link href="/b" style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--grn)',
              padding: '3px 10px', border: '1px solid var(--gbd)',
              borderRadius: 99, background: 'var(--gbg)', textDecoration: 'none',
            }}>
              Join free →
            </Link>
          </div>
        )}

        {/* Hero visual */}
        <div style={{
          height: 160,
          background: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #34d399 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Grid overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />
          {/* Decorative circle */}
          <div style={{
            position: 'absolute', right: -40, bottom: -40,
            width: 180, height: 180, borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10,
              color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em',
              textTransform: 'uppercase', marginBottom: 8,
            }}>
              {listing.category}
            </div>
            <h1 style={{
              fontFamily: 'var(--font-instrument-serif)',
              fontSize: 22, lineHeight: 1.25, color: '#fff',
              maxWidth: 260,
            }}>
              {listing.title}
            </h1>
          </div>
          <div style={{
            position: 'relative', zIndex: 1,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <span style={{ fontSize: 44 }}>{emoji}</span>
            <div style={{
              marginTop: 8,
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 99, padding: '4px 12px',
              fontFamily: 'var(--font-dm-mono)', fontSize: 16,
              fontWeight: 600, color: '#fff',
            }}>
              {listing.credit_rate}c
              <span style={{ fontSize: 10, fontWeight: 400, marginLeft: 3, opacity: 0.75 }}>
                / {listing.credit_unit}
              </span>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 16px 0' }}>

          {/* Skills + delivery */}
          {(listing.skills?.length > 0 || listing.delivery_time_days) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
              {listing.skills?.map(skill => (
                <span key={skill} style={{
                  fontFamily: 'var(--font-dm-mono)', fontSize: 11,
                  padding: '4px 10px', borderRadius: 99,
                  background: 'var(--gbg)', border: '1px solid var(--gbd)', color: 'var(--grn)',
                }}>
                  {skill}
                </span>
              ))}
              {listing.delivery_time_days && (
                <span style={{
                  fontFamily: 'var(--font-dm-mono)', fontSize: 11,
                  padding: '4px 10px', borderRadius: 99,
                  background: 'var(--surf)', border: '1px solid var(--brd)', color: 'var(--muted)',
                }}>
                  ⏱ {listing.delivery_time_days}d delivery
                </span>
              )}
            </div>
          )}

          {/* Provider card */}
          {listing.profile && (
            <Link href={`/b/profile/${listing.profile.handle}`} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px',
                background: 'linear-gradient(135deg, var(--gbg) 0%, var(--surf) 100%)',
                border: '1px solid var(--gbd)', borderRadius: 'var(--rl)',
                marginBottom: 16, cursor: 'pointer',
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
                      {listing.profile.trade_count} jobs done
                    </span>
                    {listing.profile.verified_id && (
                      <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--grn)' }}>
                        ✓ ID verified
                      </span>
                    )}
                  </div>
                </div>
                <span style={{ color: 'var(--grn)', fontSize: 16 }}>→</span>
              </div>
            </Link>
          )}

          {/* Description */}
          <div style={{
            background: 'var(--surf)', border: '1px solid var(--brd)',
            borderRadius: 'var(--rl)', padding: '18px', marginBottom: 16,
          }}>
            <div style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 10,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--muted)', marginBottom: 12,
            }}>
              About this service
            </div>
            <p style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
              {listing.description}
            </p>
          </div>

          {/* Portfolio */}
          {listing.portfolio_urls?.length > 0 && (
            <div style={{
              background: 'var(--surf)', border: '1px solid var(--brd)',
              borderRadius: 'var(--rl)', padding: '16px', marginBottom: 16,
            }}>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 10,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'var(--muted)', marginBottom: 12,
              }}>
                Portfolio
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {listing.portfolio_urls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 'var(--r)',
                    background: 'var(--gbg)', border: '1px solid var(--gbd)',
                    textDecoration: 'none',
                  }}>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--grn)', width: 16 }}>{i + 1}</span>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12, color: 'var(--muted)' }}>{url}</span>
                    <span style={{ color: 'var(--grn)', fontSize: 12, flexShrink: 0 }}>↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 10,
            color: 'var(--faint)', marginBottom: 8,
          }}>
            Listed {formatRelativeTime(listing.created_at)}
          </div>
        </div>
      </main>

      {/* Fixed CTA */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        padding: '12px 16px 28px',
        background: 'rgba(246,244,241,0.97)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--gbd)',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', gap: 10 }}>
          <Link href="/b/browse" style={{
            flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '14px 18px', borderRadius: 99,
            background: 'var(--surf)', border: '1px solid var(--gbd)',
            color: 'var(--grn)', fontSize: 13, textDecoration: 'none',
          }}>
            ← Browse
          </Link>
          {isDemo ? (
            <Link href="/b" style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '14px', borderRadius: 99,
              background: 'var(--grn)', border: '1px solid var(--gbn)',
              color: 'white', fontSize: 15, fontWeight: 500, textDecoration: 'none',
            }}>
              Join free to hire →
            </Link>
          ) : (
            <Link href="/b/briefs/new" style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '14px', borderRadius: 99,
              background: 'var(--grn)', border: '1px solid var(--gbn)',
              color: 'white', fontSize: 15, fontWeight: 500, textDecoration: 'none',
            }}>
              Post a brief →
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
