import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ListingCard } from '@/components/listings/ListingCard'
import { TopBar } from '@/components/layout/TopBar'
import { DEMO_LISTINGS } from '@/lib/demo-data'
import type { Listing } from '@/types'

const CATEGORIES = [
  'All', 'Fashion', 'Electronics', 'Books', 'Art',
  'Collectibles', 'Home', 'Sports', 'Music', 'Other',
]

interface BrowsePageProps {
  searchParams: { q?: string; cat?: string }
}

async function getListings(q?: string, cat?: string): Promise<Listing[]> {
  const supabase = await createClient()

  let query = supabase
    .from('listings')
    .select(`
      *,
      profile:profiles(id, handle, display_name, avatar_url, tier)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(48)

  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,wants.ilike.%${q}%`)
  }
  if (cat && cat !== 'All') {
    query = query.eq('category', cat)
  }

  const { data } = await query
  return (data ?? []) as Listing[]
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const q = searchParams.q
  const cat = searchParams.cat ?? 'All'
  const dbListings = await getListings(q, cat)
  // Fall back to demo listings when the DB is empty and no search is active
  const isFiltered = !!(q || (cat && cat !== 'All'))
  const listings = dbListings.length > 0 || isFiltered ? dbListings : DEMO_LISTINGS
  const isDemo = dbListings.length === 0 && !isFiltered

  return (
    <>
      <TopBar
        right={
          <Link href="/list" style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '6px 14px', borderRadius: 99,
            background: 'var(--red)', color: 'white',
            fontFamily: 'var(--font-dm-sans)', fontSize: 13, fontWeight: 500,
            border: '1px solid #A8251F', textDecoration: 'none',
          }}>
            + List
          </Link>
        }
      />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '16px 16px 80px', width: '100%' }}>


        <section style={{
          marginBottom: 12,
          padding: '12px 14px',
          background: 'var(--surf)',
          border: '1px solid var(--brd)',
          borderRadius: 'var(--rl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>
              Bartr network
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink2)' }}>Need services too? Bartr-B lets you trade skills via Credits.</div>
          </div>
          <Link href="/b/browse" style={{
            textDecoration: 'none',
            fontFamily: 'var(--font-dm-mono)',
            fontSize: 10,
            color: 'var(--grn)',
            border: '1px solid var(--gbd)',
            background: 'var(--gbg)',
            borderRadius: 99,
            padding: '6px 10px',
            whiteSpace: 'nowrap',
          }}>
            Open Bartr-B ↗
          </Link>
        </section>

        {/* Search */}
        <form style={{ marginBottom: 12 }}>
          <div style={{ position: 'relative' }}>
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search listings…"
              style={{
                width: '100%', padding: '11px 40px 11px 14px',
                border: '1px solid var(--brd)', borderRadius: 'var(--rl)',
                background: 'var(--surf)', color: 'var(--ink)',
                fontSize: 14, outline: 'none',
                fontFamily: 'var(--font-dm-sans)',
              }}
            />
            <button type="submit" style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--faint)', fontSize: 16,
            }} aria-label="Search">
              ◎
            </button>
          </div>
        </form>

        {/* Category tabs */}
        <div style={{
          display: 'flex', gap: 6, overflowX: 'auto',
          paddingBottom: 8, marginBottom: 16, scrollbarWidth: 'none',
        }}>
          {CATEGORIES.map(c => (
            <Link
              key={c}
              href={`/browse?${q ? `q=${q}&` : ''}cat=${c}`}
              style={{
                flexShrink: 0, padding: '5px 12px', borderRadius: 99,
                fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em',
                textDecoration: 'none', whiteSpace: 'nowrap',
                background: cat === c ? 'var(--red)' : 'var(--surf)',
                border: `1px solid ${cat === c ? '#A8251F' : 'var(--brd)'}`,
                color: cat === c ? 'white' : 'var(--ink2)',
                transition: 'all 0.12s',
              }}
            >
              {c}
            </Link>
          ))}
        </div>

        {/* Count + match nudge */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 16,
        }}>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--faint)' }}>
            {isDemo ? 'Sample listings — be the first to list!' : (
              <>
                {listings.length} listing{listings.length !== 1 ? 's' : ''}
                {cat !== 'All' && ` in ${cat}`}
                {q && ` for "${q}"`}
              </>
            )}
          </span>
          <Link href="/login" style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--muted)',
            textDecoration: 'none', letterSpacing: '0.04em',
          }}>
            Sign in to see your matches →
          </Link>
        </div>

        {/* Grid */}
        {listings.length > 0 ? (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
          }}>
            {listings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>◻</div>
            <p style={{ fontSize: 14, marginBottom: 20 }}>
              {q ? `No listings for "${q}"` : 'No listings yet — be the first!'}
            </p>
            <Link href="/list" style={{
              display: 'inline-flex', padding: '11px 24px', borderRadius: 99,
              background: 'var(--red)', color: 'white',
              fontSize: 14, fontWeight: 500, textDecoration: 'none',
              border: '1px solid #A8251F',
            }}>
              List your first item
            </Link>
          </div>
        )}
      </main>
    </>
  )
}
