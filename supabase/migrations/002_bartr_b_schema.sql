-- ============================================================
-- BARTR-B — Skills & Services Layer
-- Run after 001_initial_schema.sql
-- ============================================================

-- ============================================================
-- SERVICE LISTINGS — what freelancers offer
-- ============================================================
create table service_listings (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references profiles(id) on delete cascade,
  title               text not null,
  description         text not null,
  category            text not null,
  skills              text[] not null default '{}',
  credit_rate         int not null,           -- Credits per unit
  credit_unit         text not null,          -- "per hour", "per project", etc.
  delivery_time_days  int,
  portfolio_urls      text[] not null default '{}',
  is_available        boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table service_listings enable row level security;

create policy "Service listings are publicly readable"
  on service_listings for select using (true);

create policy "Users can manage own service listings"
  on service_listings for all using (auth.uid() = user_id);

create index service_listings_category_idx on service_listings (category, is_available, created_at desc);
create index service_listings_user_idx on service_listings (user_id, is_available);

-- Full-text search (generated column required — array_to_string is not IMMUTABLE)
alter table service_listings
  add column fts tsvector generated always as (
    to_tsvector('english', title || ' ' || description || ' ' || coalesce(array_to_string(skills, ' '), ''))
  ) stored;

create index service_listings_fts_idx on service_listings using gin (fts);

-- ============================================================
-- BRIEFS — what clients need
-- ============================================================
create table briefs (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid not null references profiles(id) on delete cascade,
  title                   text not null,
  description             text not null,
  category                text not null,
  skills_needed           text[] not null default '{}',
  budget_credits          int,
  deadline                date,
  status                  text not null default 'open'
    check (status in ('open','matched','in_progress','completed','disputed')),
  selected_application_id uuid,
  application_count       int not null default 0,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

alter table briefs enable row level security;

create policy "Open briefs are publicly readable"
  on briefs for select using (status = 'open' or auth.uid() = user_id);

create policy "Users can manage own briefs"
  on briefs for all using (auth.uid() = user_id);

create index briefs_status_idx on briefs (status, created_at desc);

-- ============================================================
-- APPLICATIONS — freelancer applies to a brief
-- ============================================================
create table applications (
  id                      uuid primary key default uuid_generate_v4(),
  brief_id                uuid not null references briefs(id) on delete cascade,
  applicant_id            uuid not null references profiles(id) on delete cascade,
  cover_note              text not null,
  proposed_credits        int not null,
  proposed_timeline_days  int,
  status                  text not null default 'pending'
    check (status in ('pending','accepted','declined','withdrawn')),
  created_at              timestamptz not null default now(),
  unique (brief_id, applicant_id)
);

alter table applications enable row level security;

create policy "Brief owner and applicant can view"
  on applications for select
  using (
    auth.uid() = applicant_id or
    exists (select 1 from briefs b where b.id = brief_id and b.user_id = auth.uid())
  );

create policy "Authenticated users can apply"
  on applications for insert
  with check (auth.uid() = applicant_id);

create policy "Brief owner can update application status"
  on applications for update
  using (
    auth.uid() = applicant_id or
    exists (select 1 from briefs b where b.id = brief_id and b.user_id = auth.uid())
  );

-- Increment brief application_count on new application
create or replace function on_application_created()
returns trigger language plpgsql as $$
begin
  update briefs set application_count = application_count + 1
  where id = new.brief_id;
  return new;
end;
$$;

create trigger on_application_insert
  after insert on applications
  for each row execute procedure on_application_created();

-- ============================================================
-- MILESTONES — scope-locked deliverables within a brief
-- ============================================================
create table milestones (
  id           uuid primary key default uuid_generate_v4(),
  brief_id     uuid not null references briefs(id) on delete cascade,
  title        text not null,
  description  text,
  credits      int not null,
  status       text not null default 'pending'
    check (status in ('pending','in_progress','submitted','approved','disputed')),
  due_date     date,
  submitted_at timestamptz,
  approved_at  timestamptz,
  created_at   timestamptz not null default now()
);

alter table milestones enable row level security;

create policy "Milestone parties can view"
  on milestones for select
  using (
    exists (
      select 1 from briefs b
      where b.id = brief_id
      and (b.user_id = auth.uid() or
        exists (
          select 1 from applications a
          where a.brief_id = b.id
          and a.applicant_id = auth.uid()
          and a.status = 'accepted'
        )
      )
    )
  );

create policy "Milestone parties can update"
  on milestones for update
  using (
    exists (
      select 1 from briefs b
      where b.id = brief_id
      and (b.user_id = auth.uid() or
        exists (
          select 1 from applications a
          where a.brief_id = b.id
          and a.applicant_id = auth.uid()
          and a.status = 'accepted'
        )
      )
    )
  );

-- ============================================================
-- CREDITS — internal currency
-- ============================================================

-- Running balance per user
create table credit_balances (
  user_id          uuid primary key references profiles(id) on delete cascade,
  balance          int not null default 0,
  lifetime_earned  int not null default 0,
  lifetime_spent   int not null default 0,
  updated_at       timestamptz not null default now()
);

alter table credit_balances enable row level security;

create policy "Users can view own credit balance"
  on credit_balances for select using (auth.uid() = user_id);

-- Ensure every profile gets a credit_balance row
create or replace function ensure_credit_balance()
returns trigger language plpgsql security definer as $$
begin
  insert into credit_balances (user_id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

create trigger on_profile_created
  after insert on profiles
  for each row execute procedure ensure_credit_balance();

-- Transaction ledger
create table credit_transactions (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references profiles(id) on delete cascade,
  amount        int not null,   -- positive = credit, negative = debit
  type          text not null
    check (type in ('earned','spent','granted','expired')),
  reference_id  uuid,           -- milestone_id, brief_id, etc.
  note          text,
  created_at    timestamptz not null default now()
);

alter table credit_transactions enable row level security;

create policy "Users can view own transactions"
  on credit_transactions for select using (auth.uid() = user_id);

create policy "Service role can insert transactions"
  on credit_transactions for insert with check (true); -- restricted in app via service role

create index credit_transactions_user_idx on credit_transactions (user_id, created_at desc);

-- Update balance when transaction inserted
create or replace function apply_credit_transaction()
returns trigger language plpgsql security definer as $$
begin
  insert into credit_balances (user_id, balance, lifetime_earned, lifetime_spent)
  values (
    new.user_id,
    new.amount,
    greatest(0, new.amount),
    greatest(0, -new.amount)
  )
  on conflict (user_id) do update
  set
    balance = credit_balances.balance + new.amount,
    lifetime_earned = credit_balances.lifetime_earned + greatest(0, new.amount),
    lifetime_spent = credit_balances.lifetime_spent + greatest(0, -new.amount),
    updated_at = now();
  return new;
end;
$$;

create trigger on_credit_transaction
  after insert on credit_transactions
  for each row execute procedure apply_credit_transaction();

-- Grant starting credits on first login (50c to bootstrap)
-- Called from app logic when profile is first created
-- (Avoids a chicken-and-egg problem with the credits economy)

-- ============================================================
-- REALTIME: enable for briefs and milestones
-- ============================================================
alter publication supabase_realtime add table milestones;
alter publication supabase_realtime add table applications;
