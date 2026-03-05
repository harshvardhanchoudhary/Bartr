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
    .select(`
      *,
      profile:profiles(id, handle, display_name, avatar_url, tier, trade_count)
    `)
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .limit(48)

  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
  }
  if (cat && cat !== 'All') {
    query = query.eq('category', cat)
  }

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
          <Link
            href="/b/list"
            className="text-xs px-3 py-2 rounded-full border font-medium transition-colors"
            style={{
              background: 'rgba(45,106,79,0.80)',
              borderColor: 'rgba(45,106,79,0.55)',
              color: 'white',
            }}
          >
            + Offer skill
          </Link>
        }
      />

      <main className="max-w-2xl mx-auto px-4 py-4 w-full">
        {/* Search */}
        <form className="mb-4">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search skills, e.g. logo design, React dev, copywriting…"
            className="input text-sm"
            style={{ borderColor: 'rgba(45,106,79,0.25)', background: 'rgba(45,106,79,0.05)' }}
          />
        </form>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
          {CATEGORIES.map(c => (
            <Link
              key={c}
              href={`/b/browse?${q ? `q=${q}&` : ''}cat=${c}`}
              className="flex-shrink-0 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-mono border whitespace-nowrap transition-colors"
              style={
                cat === c
                  ? { background: 'rgba(45,106,79,0.80)', borderColor: 'rgba(45,106,79,0.55)', color: 'white' }
                  : { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.62)' }
              }
            >
              {c}
            </Link>
          ))}
        </div>

        {/* Count + brief link */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted text-sm font-mono">
            {listings.length} skill{listings.length !== 1 ? 's' : ''}
            {cat !== 'All' && ` in ${cat}`}
          </span>
          <Link href="/b/briefs" className="text-xs text-muted hover:text-text transition-colors">
            View open briefs →
          </Link>
        </div>

        {/* Grid */}
        {listings.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {listings.map(listing => (
              <ServiceCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted">
            <div className="text-4xl mb-4" style={{ color: 'rgba(45,106,79,0.6)' }}>◎</div>
            <p className="text-sm">
              {q ? `No skills matching "${q}"` : 'No skills listed yet — be the first!'}
            </p>
            <Link
              href="/b/list"
              className="inline-flex items-center mt-4 px-5 py-2.5 rounded-full text-sm border font-medium"
              style={{
                background: 'rgba(45,106,79,0.80)',
                borderColor: 'rgba(45,106,79,0.55)',
                color: 'white',
              }}
            >
              Offer your skill
            </Link>
          </div>
        )}
      </main>
    </>
  )
}
