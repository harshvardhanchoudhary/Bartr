-- ============================================================
-- BARTR — Initial Database Schema
-- Run in Supabase SQL Editor or via `supabase db push`
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  handle          text unique not null,           -- @username
  display_name    text,
  avatar_url      text,
  bio             text,
  location        text,
  tier            text not null default 'bronze' check (tier in ('bronze','silver','gold')),
  verified_id     boolean not null default false,
  verified_phone  boolean not null default false,
  verified_photo  boolean not null default false,
  follower_count  int not null default 0,
  following_count int not null default 0,
  trade_count     int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Profiles are publicly readable"
  on profiles for select using (true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, handle)
  values (
    new.id,
    '@' || lower(split_part(new.email, '@', 1)) || '_' || substr(new.id::text, 1, 4)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- LISTINGS
-- ============================================================
create table listings (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid not null references profiles(id) on delete cascade,
  title                text not null,
  description          text,
  category             text not null,
  condition            text not null default 'good'
    check (condition in ('new','like_new','good','fair','poor')),
  value_estimate_low   int,    -- GBP, from eBay API or user input
  value_estimate_high  int,
  wants                text,   -- free text: what they want in return
  location             text,
  images               text[] not null default '{}',
  status               text not null default 'active'
    check (status in ('active','in_trade','completed','archived')),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

alter table listings enable row level security;

create policy "Listings are publicly readable"
  on listings for select using (true);

create policy "Users can manage own listings"
  on listings for all using (auth.uid() = user_id);

-- Full-text search index
create index listings_fts_idx on listings
  using gin (to_tsvector('english', title || ' ' || coalesce(description, '') || ' ' || coalesce(wants, '')));

create index listings_category_idx on listings (category, status, created_at desc);
create index listings_user_idx on listings (user_id, status);

-- ============================================================
-- THREADS (conversations)
-- ============================================================
create table threads (
  id               uuid primary key default uuid_generate_v4(),
  listing_id       uuid not null references listings(id) on delete cascade,
  participant_ids  uuid[] not null,
  last_message     text,
  last_message_at  timestamptz,
  offer_id         uuid,       -- FK added after offers table
  created_at       timestamptz not null default now()
);

alter table threads enable row level security;

create policy "Thread participants can view"
  on threads for select
  using (auth.uid() = any(participant_ids));

create policy "Authenticated users can create threads"
  on threads for insert
  with check (auth.uid() = any(participant_ids));

create policy "Thread participants can update"
  on threads for update
  using (auth.uid() = any(participant_ids));

-- ============================================================
-- MESSAGES
-- ============================================================
create table messages (
  id            uuid primary key default uuid_generate_v4(),
  thread_id     uuid not null references threads(id) on delete cascade,
  from_user_id  uuid not null references profiles(id) on delete cascade,
  content       text not null,
  created_at    timestamptz not null default now()
);

alter table messages enable row level security;

-- Messages visible to thread participants
create policy "Thread participants can view messages"
  on messages for select
  using (
    exists (
      select 1 from threads t
      where t.id = thread_id
      and auth.uid() = any(t.participant_ids)
    )
  );

create policy "Thread participants can send messages"
  on messages for insert
  with check (
    auth.uid() = from_user_id and
    exists (
      select 1 from threads t
      where t.id = thread_id
      and auth.uid() = any(t.participant_ids)
    )
  );

create index messages_thread_idx on messages (thread_id, created_at asc);

-- Update thread last_message on insert
create or replace function update_thread_last_message()
returns trigger language plpgsql as $$
begin
  update threads
  set last_message = new.content,
      last_message_at = new.created_at
  where id = new.thread_id;
  return new;
end;
$$;

create trigger on_message_inserted
  after insert on messages
  for each row execute procedure update_thread_last_message();

-- ============================================================
-- OFFERS
-- ============================================================
create table offers (
  id                  uuid primary key default uuid_generate_v4(),
  thread_id           uuid not null references threads(id) on delete cascade,
  from_user_id        uuid not null references profiles(id),
  to_user_id          uuid not null references profiles(id),
  target_listing_id   uuid not null references listings(id),
  offered_items       jsonb not null default '[]',  -- [{listing_id, title, value_low, value_high}]
  topup_amount        numeric(10,2),
  topup_currency      text default 'GBP',
  message             text,
  status              text not null default 'pending'
    check (status in ('pending','accepted','declined','withdrawn','completed')),
  value_gap_state     text
    check (value_gap_state in ('fair','under','over','big_under','big_over')),
  created_at          timestamptz not null default now()
);

alter table offers enable row level security;

create policy "Offer parties can view"
  on offers for select
  using (auth.uid() = from_user_id or auth.uid() = to_user_id);

create policy "Senders can create offers"
  on offers for insert
  with check (auth.uid() = from_user_id);

create policy "Offer parties can update status"
  on offers for update
  using (auth.uid() = from_user_id or auth.uid() = to_user_id);

-- Link thread to latest offer
alter table threads add constraint threads_offer_fk
  foreign key (offer_id) references offers(id);

-- ============================================================
-- TRADES
-- ============================================================
-- Trust layer: public ledger, NOT escrow. No deposits, no payments on consumer Bartr.
create table trades (
  id            uuid primary key default uuid_generate_v4(),
  offer_id      uuid unique not null references offers(id),
  initiator_id  uuid not null references profiles(id),
  receiver_id   uuid not null references profiles(id),
  status        text not null default 'offered'
    check (status in ('offered','accepted','meetup_arranged','completed','disputed')),
  completed_at  timestamptz,
  created_at    timestamptz not null default now()
);

alter table trades enable row level security;

create policy "Trade parties can view"
  on trades for select
  using (auth.uid() = initiator_id or auth.uid() = receiver_id);

-- On trade completion: increment trade_count, archive listing, write ledger entry
create or replace function on_trade_completed()
returns trigger language plpgsql security definer as $$
begin
  if new.status = 'completed' and old.status != 'completed' then
    update profiles set trade_count = trade_count + 1
    where id in (new.initiator_id, new.receiver_id);

    update listings set status = 'completed'
    where id = (select target_listing_id from offers where id = new.offer_id);

    new.completed_at = now();
  end if;
  return new;
end;
$$;

create trigger on_trade_status_change
  before update on trades
  for each row execute procedure on_trade_completed();

-- ============================================================
-- LEDGER ENTRIES (public trade record)
-- ============================================================
create table ledger_entries (
  id               uuid primary key default uuid_generate_v4(),
  trade_id         uuid not null references trades(id),
  from_profile_id  uuid not null references profiles(id),
  to_profile_id    uuid not null references profiles(id),
  summary          text not null,
  items_offered    text[] not null default '{}',
  item_received    text not null,
  created_at       timestamptz not null default now()
);

alter table ledger_entries enable row level security;

create policy "Ledger is publicly readable"
  on ledger_entries for select using (true);

-- ============================================================
-- SOCIAL POSTS
-- ============================================================
create table social_posts (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references profiles(id) on delete cascade,
  type           text not null
    check (type in ('trade_win','accepted_pattern','looking_for','joined')),
  content        text not null,
  listing_id     uuid references listings(id) on delete set null,
  trade_id       uuid references trades(id) on delete set null,
  like_count     int not null default 0,
  comment_count  int not null default 0,
  created_at     timestamptz not null default now()
);

alter table social_posts enable row level security;

create policy "Social posts are publicly readable"
  on social_posts for select using (true);

create policy "Users can create posts"
  on social_posts for insert with check (auth.uid() = user_id);

create policy "Users can update own posts"
  on social_posts for update using (auth.uid() = user_id);

create index social_posts_feed_idx on social_posts (created_at desc);

-- ============================================================
-- FOLLOWS
-- ============================================================
create table follows (
  follower_id  uuid not null references profiles(id) on delete cascade,
  following_id uuid not null references profiles(id) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (follower_id, following_id)
);

alter table follows enable row level security;

create policy "Anyone can view follows"
  on follows for select using (true);

create policy "Users can manage own follows"
  on follows for all using (auth.uid() = follower_id);

-- Maintain counts
create or replace function update_follow_counts()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    update profiles set follower_count = follower_count + 1 where id = new.following_id;
    update profiles set following_count = following_count + 1 where id = new.follower_id;
  elsif TG_OP = 'DELETE' then
    update profiles set follower_count = greatest(0, follower_count - 1) where id = old.following_id;
    update profiles set following_count = greatest(0, following_count - 1) where id = old.follower_id;
  end if;
  return null;
end;
$$;

create trigger on_follow_change
  after insert or delete on follows
  for each row execute procedure update_follow_counts();

-- ============================================================
-- REALTIME: enable for messaging
-- ============================================================
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table offers;
alter publication supabase_realtime add table threads;
