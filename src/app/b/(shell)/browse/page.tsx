import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BTopBar } from '@/components/b/BTopBar'
import { ServiceCard } from '@/components/b/ServiceCard'
import { DEMO_SERVICES } from '@/lib/demo-data'
import type { ServiceListing } from '@/types/bartr-b'

const CATEGORIES = [
  'All', 'Design', 'Development', 'Writing', 'Marketing',
  'Video', 'Music', 'Photography', 'Consulting', 'Other',
]

interface Props {
  searchParams: { q?: string; cat?: string }
}

async function getListings(q?: string, cat?: string): Promise<ServiceListing[]> {
  const supabase = await createClient()
  let query = supabase
    .from('service_listings')
    .select('*, profile:profiles(id, handle, display_name, avatar_url, tier, trade_count)')
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .limit(48)
  if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
  if (cat && cat !== 'All') query = query.eq('category', cat)
  const { data } = await query
  return (data ?? []) as ServiceListing[]
}

export default async function BBrowsePage({ searchParams }: Props) {
  const q = searchParams.q
  const cat = searchParams.cat ?? 'All'
  const dbListings = await getListings(q, cat)
  const isFiltered = !!(q || (cat && cat !== 'All'))
  const listings = dbListings.length > 0 || isFiltered ? dbListings : DEMO_SERVICES
  const isDemo = dbListings.length === 0 && !isFiltered

  return (
    <>
      <BTopBar
        right={
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/b/briefs" style={{
              padding: '5px 10px', borderRadius: 99,
              border: '1px solid var(--gbd)', background: 'var(--gbg)',
              color: 'var(--grn)', fontFamily: 'var(--font-dm-mono)', fontSize: 11,
              textDecoration: 'none',
            }}>
              Briefs
            </Link>
            <Link href="/b/list" style={{
              padding: '5px 12px', borderRadius: 99,
              background: 'var(--grn)', color: 'white',
              fontFamily: 'var(--font-dm-sans)', fontSize: 12,
              border: '1px solid #136038', textDecoration: 'none',
            }}>
              + Offer skill
            </Link>
          </div>
        }
      />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '16px 16px 80px', width: '100%' }}>

        {/* Search */}
        <form style={{ marginBottom: 12 }}>
          <div style={{ position: 'relative' }}>
            <input
              type="search" name="q" defaultValue={q}
              placeholder="Search skills, e.g. logo design, React dev, copywriting…"
              style={{
                width: '100%', padding: '11px 40px 11px 14px',
                border: '1px solid var(--brd)', borderRadius: 'var(--rl)',
                background: 'var(--surf)', color: 'var(--ink)',
                fontSize: 14, outline: 'none', fontFamily: 'var(--font-dm-sans)',
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
            <Link key={c}
              href={`/b/browse?${q ? `q=${q}&` : ''}cat=${c}`}
              style={{
                flexShrink: 0, padding: '5px 12px', borderRadius: 99,
                fontFamily: 'var(--font-dm-mono)', fontSize: 11, letterSpacing: '0.04em',
                textDecoration: 'none', whiteSpace: 'nowrap',
                background: cat === c ? 'var(--grn)' : 'var(--surf)',
                border: `1px solid ${cat === c ? '#136038' : 'var(--brd)'}`,
                color: cat === c ? 'white' : 'var(--ink2)',
                transition: 'all 0.12s',
              }}
            >
              {c}
            </Link>
          ))}
        </div>

        {/* Count + briefs link */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--faint)' }}>
            {isDemo
              ? 'Sample skills — be the first to offer yours!'
              : `${listings.length} skill${listings.length !== 1 ? 's' : ''}${cat !== 'All' ? ` in ${cat}` : ''}${q ? ` for "${q}"` : ''}`}
          </span>
          <Link href="/b/briefs" style={{
            fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--grn)',
            textDecoration: 'none', border: '1px solid var(--gbd)',
            background: 'var(--gbg)', borderRadius: 99, padding: '3px 10px',
          }}>
            Open briefs →
          </Link>
        </div>

        {/* Grid */}
        {listings.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {listings.map((listing, i) => <ServiceCard key={listing.id} listing={listing} index={i} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16, color: 'var(--grn)', opacity: 0.4 }}>◎</div>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>
              {q ? `No skills matching "${q}"` : 'No skills listed yet — be the first!'}
            </p>
            <Link href="/b/list" style={{
              display: 'inline-flex', padding: '11px 24px', borderRadius: 99,
              background: 'var(--grn)', color: 'white',
              fontSize: 14, fontWeight: 500, textDecoration: 'none',
              border: '1px solid #136038',
            }}>
              Offer your skill
            </Link>
          </div>
        )}
      </main>
    </>
  )
}
