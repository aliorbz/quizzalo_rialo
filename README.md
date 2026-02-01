# Quizzalo Setup

To enable the leaderboard features, you need a Supabase project.

## 1. Environment Variables
Create a `.env` file in the root directory:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 2. SQL Schema
Run this in your Supabase SQL Editor:

```sql
-- Table: quiz_scores (Tracks every run)
create table public.quiz_scores (
  id uuid default gen_random_uuid() primary key,
  player_name text not null,
  topic text not null,
  score int4 not null,
  total_questions int4 default 10,
  time_remaining_ms int4 not null,
  created_at timestamptz default now()
);

-- Table: player_best (Tracks highest score per topic and total)
create table public.player_best (
  player_name text primary key,
  best_by_topic jsonb not null default '{}'::jsonb,
  total_points int4 not null default 0,
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.quiz_scores enable row level security;
alter table public.player_best enable row level security;

-- Policies
create policy "Public Select Scores" on public.quiz_scores for select using (true);
create policy "Public Insert Scores" on public.quiz_scores for insert with check (true);
create policy "Public Select Bests" on public.player_best for select using (true);
create policy "Public Upsert Bests" on public.player_best for upsert with check (true);
```

## 3. Scoring Logic
- **Topic Cap**: Each topic allows a maximum of 10 points.
- **Global Cap**: With 3 active topics (Introducing Rialo I, II, III), the maximum achievable Hall of Fame score is **30**.
- **Tie-breakers**: Ranked by total points (DESC), then by earliest achievement time (`updated_at` ASC). Users who reached the top first stay ahead on ties.