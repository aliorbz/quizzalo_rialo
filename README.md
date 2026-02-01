# Quizzalo - Hall of Fame Setup

To enable global rankings, run the following script in your Supabase SQL Editor.

## Supabase SQL Script
```sql
-- 1. Create the quiz_scores table (Every attempt log)
CREATE TABLE public.quiz_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  topic TEXT NOT NULL,
  score INT4 NOT NULL,
  total_questions INT4 DEFAULT 10,
  time_remaining_ms INT4 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create the player_best table (Aggregated Hall of Fame)
CREATE TABLE public.player_best (
  player_name TEXT PRIMARY KEY,
  best_by_topic JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_points INT4 NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_best ENABLE ROW LEVEL SECURITY;

-- 4. Policies for quiz_scores (Public Insert & Select)
CREATE POLICY "Public Select Scores" ON public.quiz_scores FOR SELECT USING (true);
CREATE POLICY "Public Insert Scores" ON public.quiz_scores FOR INSERT WITH CHECK (true);

-- 5. Policies for player_best (Enables client-side upsert)
CREATE POLICY "Public Select Bests" ON public.player_best FOR SELECT USING (true);
CREATE POLICY "Public Insert Bests" ON public.player_best FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Bests" ON public.player_best FOR UPDATE USING (true) WITH CHECK (true);
```

## Setup Verification
- **Environment Variables**: Use `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- **Primary Key**: The leaderboard identifies players by their display name.
- **Tie-breakers**: If two players have 30/30 points, the one who achieved it first ranks higher.
