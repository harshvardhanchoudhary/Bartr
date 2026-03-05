export type UserTier = 'bronze' | 'silver' | 'gold'

export type ListingCondition = 'new' | 'like_new' | 'good' | 'fair' | 'poor'

export type ListingStatus = 'active' | 'in_trade' | 'completed' | 'archived'

export type OfferStatus = 'pending' | 'accepted' | 'declined' | 'withdrawn' | 'completed'

export type TradeStatus = 'escrow_pending' | 'escrow_held' | 'meetup_arranged' | 'completed' | 'disputed'

// ---- Value gap states (offer value logic) ----
export type ValueGapState =
  | 'fair'         // within 15% — green
  | 'under'        // offering less — amber/red
  | 'over'         // offering more — blue nudge
  | 'big_under'    // >40% under — red strong
  | 'big_over'     // >40% over — red strong

export interface Profile {
  id: string
  handle: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  tier: UserTier
  location: string | null
  verified_id: boolean
  verified_phone: boolean
  verified_photo: boolean
  follower_count: number
  following_count: number
  trade_count: number
  created_at: string
}

export interface Listing {
  id: string
  user_id: string
  title: string
  description: string | null
  category: string
  condition: ListingCondition
  value_estimate_low: number | null
  value_estimate_high: number | null
  wants: string | null
  location: string | null
  images: string[]
  status: ListingStatus
  match_score?: number // computed per-user
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface OfferItem {
  listing_id: string
  title: string
  value_low: number | null
  value_high: number | null
}

export interface Offer {
  id: string
  trade_id: string
  from_user_id: string
  to_user_id: string
  target_listing_id: string
  offered_items: OfferItem[]
  topup_amount: number | null
  topup_currency: string | null
  message: string | null
  status: OfferStatus
  value_gap_state: ValueGapState | null
  created_at: string
  from_profile?: Profile
  to_profile?: Profile
  target_listing?: Listing
}

export interface Trade {
  id: string
  offer_id: string
  buyer_id: string
  seller_id: string
  status: TradeStatus
  deposit_intent_id: string | null
  deposit_amount: number | null
  completed_at: string | null
  created_at: string
}

export interface Message {
  id: string
  thread_id: string
  from_user_id: string
  content: string
  created_at: string
  from_profile?: Profile
}

export interface Thread {
  id: string
  listing_id: string
  participant_ids: string[]
  last_message: string | null
  last_message_at: string | null
  offer_id: string | null
  created_at: string
  listing?: Listing
  other_profile?: Profile
  latest_offer?: Offer
}

export interface SocialPost {
  id: string
  user_id: string
  type: 'trade_win' | 'accepted_pattern' | 'looking_for' | 'joined'
  content: string
  listing_id: string | null
  trade_id: string | null
  like_count: number
  comment_count: number
  created_at: string
  profile?: Profile
  listing?: Listing
  has_liked?: boolean
}

export interface LedgerEntry {
  id: string
  trade_id: string
  summary: string
  items_offered: string[]
  item_received: string
  created_at: string
  from_profile?: Profile
  to_profile?: Profile
}

// ---- Supabase DB types ----
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile }
      listings: { Row: Listing }
      offers: { Row: Offer }
      trades: { Row: Trade }
      messages: { Row: Message }
      threads: { Row: Thread }
      social_posts: { Row: SocialPost }
      ledger_entries: { Row: LedgerEntry }
    }
  }
}
