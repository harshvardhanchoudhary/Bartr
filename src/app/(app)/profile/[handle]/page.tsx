import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { Avatar } from '@/components/ui/Avatar'
import { TierBadge } from '@/components/ui/TierBadge'
import { ListingCard } from '@/components/listings/ListingCard'
import { AchievementBadges } from '@/components/ui/AchievementBadges'
import { ProfileActivityFeed } from '@/components/profile/ProfileActivityFeed'
import { DEMO_LISTINGS } from '@/lib/demo-data'
import type { ActivityItem } from '@/components/profile/ProfileActivityFeed'
import type { Profile, Listing, LedgerEntry } from '@/types'

interface Props {
  params: { handle: string }
}

const DEMO_PROFILES = Object.fromEntries(
  DEMO_LISTINGS
    .filter(l => l.profile)
    .map(l => [l.profile!.handle, l.profile!])
)

// Per-handle demo activity — makes each profile feel alive and specific
const DEMO_ACTIVITY: Record<string, ActivityItem[]> = {
  tessafilm: [
    { id: '1', type: 'listed', text: 'Listed Fujifilm X-T20 + kit lens', subtext: 'Est. £380–460 · Electronics', time: '3h ago', emoji: '📷' },
    { id: '2', type: 'received_offer', text: 'New offer received', subtext: 'MacBook Air offered in return', time: '1d ago', emoji: '📬' },
    { id: '3', type: 'listed', text: "Listed Arc'teryx Beta AR jacket", subtext: 'Est. £320–360 · Fashion', time: '2w ago', emoji: '🧥' },
    { id: '4', type: 'traded', text: 'Completed a trade in London', subtext: 'Canon AE-1 → Lomo LC-A film kit', time: '1mo ago', emoji: '🤝' },
    { id: '5', type: 'joined', text: 'Joined the Bartr community', subtext: 'London · Documentary filmmaker', time: '8mo ago', emoji: '◎' },
  ],
  jordanmc: [
    { id: '1', type: 'listed', text: "Listed Vintage Levi's 501 jacket", subtext: 'Est. £65–90 · Fashion', time: '8h ago', emoji: '👕' },
    { id: '2', type: 'traded', text: 'Completed a trade in Bristol', subtext: 'Vintage Nike tee → Photography print', time: '1w ago', emoji: '🤝' },
    { id: '3', type: 'listed', text: 'Listed Doc Martens 1460 (UK10)', subtext: 'Est. £55–75 · Fashion', time: '3w ago', emoji: '👞' },
    { id: '4', type: 'joined', text: 'Joined the Bartr community', subtext: 'Bristol · Thrift & vintage obsessive', time: '6mo ago', emoji: '◎' },
  ],
  mikeb: [
    { id: '1', type: 'listed', text: 'Listed Fender Telecaster (Squier)', subtext: 'Est. £200–240 · Music', time: '1d ago', emoji: '🎸' },
    { id: '2', type: 'received_offer', text: 'New offer on Telecaster', subtext: 'Effects pedal bundle offered · Pending', time: '6h ago', emoji: '📬' },
    { id: '3', type: 'traded', text: 'Swapped synths in Manchester', subtext: 'Arturia Keystep → Korg Minilogue XD', time: '3w ago', emoji: '🤝' },
    { id: '4', type: 'joined', text: 'Joined the Bartr community', subtext: 'Manchester · Musician & producer', time: '5mo ago', emoji: '◎' },
  ],
  pablor: [
    { id: '1', type: 'listed', text: "Listed Arc'teryx Beta AR jacket", subtext: 'Est. £320–360 · Fashion', time: '2d ago', emoji: '🧥' },
    { id: '2', type: 'traded', text: 'Swapped gear in Edinburgh', subtext: 'Ski helmet → Snowboard boots', time: '2w ago', emoji: '🤝' },
    { id: '3', type: 'joined', text: 'Joined the Bartr community', subtext: 'Edinburgh · Outdoor enthusiast', time: '7mo ago', emoji: '◎' },
  ],
  lilyc: [
    { id: '1', type: 'listed', text: 'Listed iPad Pro 11" (2021)', subtext: 'Est. £540–620 · Electronics', time: '5h ago', emoji: '🖥️' },
    { id: '2', type: 'traded', text: 'Completed trade in London', subtext: 'Sony 85mm → Sigma Art 35mm', time: '2w ago', emoji: '🤝' },
    { id: '3', type: 'joined', text: 'Joined the Bartr community', subtext: 'London · Visual artist & designer', time: '9mo ago', emoji: '◎' },
  ],
  djsol: [
    { id: '1', type: 'listed', text: 'Listed Technics SL-1200MK2', subtext: 'Est. £440–520 · Music', time: '12h ago', emoji: '🎵' },
    { id: '2', type: 'received_offer', text: 'Offer received on SL-1200', subtext: 'Vinyl collection (200+ records) offered', time: '2h ago', emoji: '📬' },
    { id: '3', type: 'traded', text: 'Traded in Birmingham', subtext: 'Roland TR-808 → Pioneer CDJ-2000', time: '1mo ago', emoji: '🤝' },
    { id: '4', type: 'joined', text: 'Joined the Bartr community', subtext: 'Birmingham · DJ & music collector', time: '11mo ago', emoji: '◎' },
  ],
  kwamea: [
    { id: '1', type: 'listed', text: 'Listed Nike Air Max 1 OG (UK9)', subtext: 'Est. £130–150 · Fashion', time: '6h ago', emoji: '👟' },
    { id: '2', type: 'traded', text: 'Swapped in London', subtext: 'Jordan 1 Retro → New Balance 550', time: '2w ago', emoji: '🤝' },
    { id: '3', type: 'joined', text: 'Joined the Bartr community', subtext: 'London · Sneakerhead', time: '4mo ago', emoji: '◎' },
  ],
  samirk: [
    { id: '1', type: 'listed', text: 'Listed Philosophy Books ×12', subtext: 'Est. £50–70 · Books', time: '1d ago', emoji: '📚' },
    { id: '2', type: 'traded', text: 'Book swap in Oxford', subtext: 'Camus collection → DFW complete works', time: '1w ago', emoji: '🤝' },
    { id: '3', type: 'joined', text: 'Joined the Bartr community', subtext: 'Oxford · Philosophy & literature', time: '3mo ago', emoji: '◎' },
  ],
}

export default async function ProfilePage({ params }: Props) {
  const supabase = await createClient()
  const handle = decodeURIComponent(params.handle).replace(/^@/, '')

  const { data: dbProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('handle', handle)
    .single()

  const isDemo = !dbProfile && !!DEMO_PROFILES[handle]
  const profile = (dbProfile ?? DEMO_PROFILES[handle] ?? null) as Profile | null
  if (!profile) notFound()

  const [{ data: dbListings }, { data: ledger }] = isDemo
    ? [{ data: null }, { data: null }]
    : await Promise.all([
        supabase
          .from('listings')
          .select('*, profile:profiles(id, handle, display_name, avatar_url, tier)')
          .eq('user_id', profile.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(12),
        supabase
          .from('ledger_entries')
          .select('*')
          .or(`from_profile_id.eq.${profile.id},to_profile_id.eq.${profile.id}`)
          .order('created_at', { ascending: false })
          .limit(10),
      ])

  const listings: Listing[] = isDemo
    ? DEMO_LISTINGS.filter(l => l.profile?.handle === handle)
    : (dbListings ?? []) as Listing[]

  const ledgerEntries = (ledger ?? []) as LedgerEntry[]
  const verifications = [profile.verified_id, profile.verified_phone, profile.verified_photo].filter(Boolean)

  // Extract unique "wants" from listings for the wants board
  const allWants = listings
    .flatMap(l => l.wants ? l.wants.split(',').map((w: string) => w.trim()).filter(Boolean) : [])
    .filter(w => !w.toLowerCase().includes('open to') && !w.toLowerCase().includes('other'))
  const uniqueWants = [...new Set(allWants)].slice(0, 8)

  // Activity feed
  const activityItems: ActivityItem[] = isDemo
    ? (DEMO_ACTIVITY[handle] ?? [
        { id: '1', type: 'joined', text: 'Joined the Bartr community', subtext: '', time: 'recently', emoji: '◎' },
      ])
    : ledgerEntries.map(e => ({
        id: e.id,
        type: 'traded' as const,
        text: 'Completed a trade',
        subtext: e.summary,
        time: new Date(e.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        emoji: '🤝',
      }))

  return (
    <>
      <TopBar back title={`@${handle}`} />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '0 0 100px', width: '100%' }}>

        {/* Demo banner */}
        {isDemo && (
          <div style={{
            margin: '12px 16px 0',
            padding: '10px 14px',
            background: 'var(--gldbg)', border: '1px solid var(--gldbd)',
            borderRadius: 'var(--rl)', fontSize: 12, color: 'var(--gld)',
            fontFamily: 'var(--font-dm-mono)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span>Sample trader — sign up to connect with real community members</span>
            <Link href="/signup" style={{
              color: 'var(--gld)', padding: '2px 10px', border: '1px solid var(--gldbd)',
              borderRadius: 99, background: 'var(--gldbg)', textDecoration: 'none',
              fontSize: 11, flexShrink: 0, marginLeft: 8,
            }}>Join free →</Link>
          </div>
        )}

        {/* ── HERO CARD ── */}
        <div style={{
          margin: '12px 16px 0',
          background: 'linear-gradient(160deg, #1A1814 0%, #2D261A 50%, #3C3018 100%)',
          borderRadius: 16,
          padding: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Ambient glow — red top right */}
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 200, height: 200, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(196,49,42,0.20) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          {/* Ambient glow — amber bottom left */}
          <div style={{
            position: 'absolute', bottom: -30, left: 20,
            width: 160, height: 160, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(180,120,20,0.14) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          {/* Subtle grid texture */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            pointerEvents: 'none',
          }} />

          {/* Avatar + name */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20, position: 'relative' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              padding: 2.5,
              background: 'linear-gradient(135deg, rgba(196,49,42,0.9) 0%, rgba(200,150,30,0.7) 50%, rgba(196,49,42,0.5) 100%)',
              flexShrink: 0,
              boxShadow: '0 0 24px rgba(196,49,42,0.35), 0 0 48px rgba(196,49,42,0.12)',
            }}>
              <div style={{
                width: '100%', height: '100%', borderRadius: '50%',
                background: '#2D261A', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Avatar src={profile.avatar_url} alt={profile.display_name ?? profile.handle} size="lg" />
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
              <h1 style={{
                fontFamily: 'var(--font-instrument-serif)',
                fontSize: 22, fontWeight: 400, color: 'rgba(255,255,255,0.95)',
                lineHeight: 1.1, marginBottom: 4,
              }}>
                {profile.display_name ?? `@${handle}`}
              </h1>
              <div style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 12,
                color: 'rgba(255,255,255,0.40)', marginBottom: 8,
              }}>
                @{handle}
              </div>
              <TierBadge tier={profile.tier} />
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p style={{
              fontSize: 14, color: 'rgba(255,255,255,0.60)',
              lineHeight: 1.65, marginBottom: 20, position: 'relative',
            }}>
              {profile.bio}
            </p>
          )}

          {/* Stats — glass pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, position: 'relative' }}>
            {[
              { value: profile.trade_count ?? 0, label: 'TRADES' },
              { value: profile.follower_count ?? 0, label: 'FOLLOWERS' },
              { value: `${verifications.length}/3`, label: 'VERIFIED' },
              ...(profile.location ? [{ value: profile.location, label: 'LOCATION' }] : []),
            ].map(stat => (
              <div key={stat.label} style={{
                padding: '8px 14px', borderRadius: 99,
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.11)',
              }}>
                <div style={{
                  fontSize: 17, fontWeight: 700, color: 'rgba(255,255,255,0.92)',
                  fontFamily: 'var(--font-dm-mono)', lineHeight: 1.1,
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontFamily: 'var(--font-dm-mono)', fontSize: 8,
                  color: 'rgba(255,255,255,0.32)', letterSpacing: '0.12em', marginTop: 1,
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
            <Link href={`/browse?user=${handle}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', borderRadius: 99,
              background: 'var(--red)', color: 'white',
              fontFamily: 'var(--font-dm-sans)', fontSize: 13, fontWeight: 500,
              border: '1px solid var(--rbn)', textDecoration: 'none',
            }}>
              Offer a trade →
            </Link>
            <Link href={`/messages?to=${handle}`} style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '10px 16px', borderRadius: 99,
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.14)',
              color: 'rgba(255,255,255,0.75)',
              fontFamily: 'var(--font-dm-sans)', fontSize: 13,
              textDecoration: 'none',
            }}>
              Message
            </Link>
          </div>

          {/* Verification chips */}
          <div style={{
            marginTop: 16, paddingTop: 16,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', gap: 6, flexWrap: 'wrap', position: 'relative',
          }}>
            {[
              { label: 'ID', active: !!profile.verified_id },
              { label: 'Phone', active: !!profile.verified_phone },
              { label: 'Photo', active: !!profile.verified_photo },
            ].map(v => (
              <span key={v.label} style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.06em',
                padding: '3px 10px', borderRadius: 99,
                background: v.active ? 'rgba(5,150,105,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${v.active ? 'rgba(5,150,105,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: v.active ? '#6EE7B7' : 'rgba(255,255,255,0.25)',
              }}>
                {v.active ? '✓ ' : ''}{v.label}
              </span>
            ))}
          </div>
        </div>

        {/* ── WANTS BOARD ── */}
        {uniqueWants.length > 0 && (
          <div style={{
            margin: '10px 16px 0',
            padding: '16px',
            background: 'var(--surf)', border: '1px solid var(--brd)',
            borderRadius: 'var(--rl)',
          }}>
            <div style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10,
            }}>
              Looking to swap for
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {uniqueWants.map(want => (
                <span key={want} style={{
                  fontFamily: 'var(--font-dm-mono)', fontSize: 11,
                  padding: '5px 12px', borderRadius: 99,
                  background: 'var(--rbg)', border: '1px solid var(--rbd)',
                  color: 'var(--red)',
                }}>
                  {want}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── ACHIEVEMENT BADGES ── */}
        <div style={{ margin: '0 16px' }}>
          <AchievementBadges profile={profile} />
        </div>

        {/* ── ACTIVITY FEED ── */}
        {activityItems.length > 0 && (
          <div style={{
            margin: '10px 16px 0',
            padding: '16px',
            background: 'var(--surf)', border: '1px solid var(--brd)',
            borderRadius: 'var(--rl)',
          }}>
            <div style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span>Recent activity</span>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#059669',
                boxShadow: '0 0 0 0 rgba(5,150,105,0.4)',
                display: 'inline-block',
                animation: 'pulse-dot 2.4s ease-in-out infinite',
              }} />
            </div>
            <ProfileActivityFeed items={activityItems} />
          </div>
        )}

        {/* ── ACTIVE LISTINGS ── */}
        {listings.length > 0 && (
          <section style={{ margin: '10px 16px 0' }}>
            <div style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12,
            }}>
              {listings.length} active listing{listings.length !== 1 ? 's' : ''}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {listings.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}
            </div>
          </section>
        )}

        {/* ── PUBLIC LEDGER ── */}
        {ledgerEntries.length > 0 && (
          <section style={{ margin: '16px 16px 0' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
            }}>
              <span style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'var(--muted)',
              }}>Public ledger</span>
              <span style={{
                fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                padding: '2px 8px', borderRadius: 99,
                background: 'var(--rbg)', border: '1px solid var(--rbd)', color: 'var(--red)',
              }}>
                {ledgerEntries.length} entries
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ledgerEntries.map(entry => (
                <div key={entry.id} style={{
                  padding: '12px 14px',
                  background: 'var(--surf)', border: '1px solid var(--brd)',
                  borderRadius: 'var(--rl)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{
                      fontFamily: 'var(--font-dm-mono)', fontSize: 9,
                      padding: '2px 8px', borderRadius: 99,
                      background: 'var(--gbg)', border: '1px solid var(--gbd)', color: 'var(--grn)',
                    }}>✓ Confirmed</span>
                    <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--faint)' }}>
                      {new Date(entry.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--muted)' }}>{entry.summary}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Demo public ledger gate */}
        {isDemo && (
          <section style={{ margin: '16px 16px 0' }}>
            <div style={{
              fontFamily: 'var(--font-dm-mono)', fontSize: 9, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12,
            }}>
              Public ledger · {profile.trade_count ?? 0} entries
            </div>
            <div style={{
              padding: '20px', textAlign: 'center',
              background: 'var(--surf)', border: '1px solid var(--brd)',
              borderRadius: 'var(--rl)',
            }}>
              <p style={{ fontSize: 13, color: 'var(--faint)', fontFamily: 'var(--font-dm-mono)', marginBottom: 14 }}>
                Sign up to view the full public trade ledger
              </p>
              <Link href="/signup" style={{
                display: 'inline-flex', padding: '9px 20px', borderRadius: 99,
                background: 'var(--red)', color: 'white',
                fontSize: 13, fontWeight: 500, textDecoration: 'none',
                border: '1px solid var(--rbn)',
              }}>
                Create free account →
              </Link>
            </div>
          </section>
        )}

        {listings.length === 0 && ledgerEntries.length === 0 && !isDemo && (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--muted)' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>◻</div>
            <p style={{ fontSize: 14 }}>No listings or trades yet.</p>
          </div>
        )}
      </main>
    </>
  )
}
