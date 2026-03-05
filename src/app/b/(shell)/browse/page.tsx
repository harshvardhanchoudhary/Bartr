import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BTopBar } from '@/components/b/BTopBar'
import { ServiceCard } from '@/components/b/ServiceCard'
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
  const listings = await getListings(q, cat)

  return (
    <>
      <BTopBar
        right={
          <Link href="/b/list" style={{
            padding: '5px 12px', borderRadius: 99,
            background: 'var(--grn)', color: 'white',
            fontFamily: 'var(--font-dm-sans)', fontSize: 12,
            border: '1px solid #136038', textDecoration: 'none',
          }}>
            + Offer skill
          </Link>
        }
      />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '16px 16px 80px' }}>

        {/* Search */}
        <form style={{ marginBottom: 12 }}>
          <input
            type="search" name="q" defaultValue={q}
            placeholder="Search skills, e.g. logo design, React dev, copywriting…"
            style={{
              width: '100%', padding: '11px 14px',
              border: '1px solid var(--brd)', borderRadius: 'var(--rl)',
              background: 'var(--surf)', color: 'var(--ink)',
              fontSize: 14, outline: 'none', fontFamily: 'var(--font-dm-sans)',
            }}
          />
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
              }}
            >
              {c}
            </Link>
          ))}
        </div>

        {/* Count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: 'var(--faint)' }}>
            {listings.length} skill{listings.length !== 1 ? 's' : ''}{cat !== 'All' ? ` in ${cat}` : ''}
          </span>
          <Link href="/b/briefs" style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: 'var(--muted)', textDecoration: 'none' }}>
            View open briefs →
          </Link>
        </div>

        {/* Grid */}
        {listings.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {listings.map(listing => <ServiceCard key={listing.id} listing={listing} />)}
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
