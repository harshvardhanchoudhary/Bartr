import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ListingCard } from '@/components/listings/ListingCard'
import { TopBar } from '@/components/layout/TopBar'
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
      profile:profiles(
        id, handle, display_name, avatar_url, tier,
        verified_id, verified_phone, verified_photo
      )
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

  const listings = await getListings(q, cat)

  return (
    <>
      <TopBar
        right={
          <Link href="/list" className="btn btn-primary text-xs px-3 py-2">
            + List item
          </Link>
        }
      />

      <main className="max-w-2xl mx-auto px-4 py-4 w-full">
        {/* Search */}
        <form className="mb-4">
          <div className="relative">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search listings, categories, wants…"
              className="input pr-10 text-sm"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-2"
              aria-label="Search"
            >
              ◎
            </button>
          </div>
        </form>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/browse?${q ? `q=${q}&` : ''}cat=${c}`}
              className={
                cat === c
                  ? 'chip-red flex-shrink-0'
                  : 'chip flex-shrink-0 hover:border-stroke-2'
              }
            >
              {c}
            </Link>
          ))}
        </div>

        {/* Count */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted text-sm font-mono">
            {listings.length} listing{listings.length !== 1 ? 's' : ''}
            {cat !== 'All' && ` in ${cat}`}
            {q && ` for "${q}"`}
          </span>
          {/* Earn-the-signup nudge — shown when not logged in */}
          <Link href="/login" className="text-xs text-muted hover:text-text transition-colors">
            Sign in to see matches →
          </Link>
        </div>

        {/* Grid */}
        {listings.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                matchScore={listing.match_score}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted">
            <div className="text-4xl mb-4">◻</div>
            <p className="text-sm">
              {q ? `No listings for "${q}"` : 'No listings yet — be the first to list!'}
            </p>
            <Link href="/list" className="btn btn-primary mt-4 text-sm">
              List your first item
            </Link>
          </div>
        )}
      </main>
    </>
  )
}
