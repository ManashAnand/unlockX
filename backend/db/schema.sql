-- Users table: stores email on first Google OAuth login
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- Each user can only read/write their own row
CREATE POLICY "users_self_access" ON users
    FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS profile_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    handle TEXT UNIQUE NOT NULL,
    profile_data JSONB NOT NULL,
    analytics_data JSONB NOT NULL,
    tone_data JSONB NOT NULL,
    topics_data JSONB NOT NULL,
    top_tweets JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comparison_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    handle_a TEXT NOT NULL,
    handle_b TEXT NOT NULL,
    result JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(handle_a, handle_b)
);

-- RLS: lock down both tables to server-only access
-- The backend uses the service_role key which bypasses RLS automatically.
-- No client (anon/frontend) can read or write these tables directly.
ALTER TABLE profile_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparison_cache ENABLE ROW LEVEL SECURITY;

-- No permissive policies added = deny all by default for anon/authenticated roles.
-- service_role always bypasses RLS — no policy needed for the backend.

CREATE TABLE IF NOT EXISTS user_comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    handle_a TEXT NOT NULL,
    handle_b TEXT NOT NULL,
    name_a TEXT NOT NULL,
    name_b TEXT NOT NULL,
    followers_a INTEGER NOT NULL,
    followers_b INTEGER NOT NULL,
    winner_handle TEXT NOT NULL,
    total_followers INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE user_comparisons ENABLE ROW LEVEL SECURITY;
-- Users can insert/read/delete their own rows
CREATE POLICY "user_comparisons_own" ON user_comparisons
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
-- Anyone (anon included) can SELECT for the leaderboard
CREATE POLICY "user_comparisons_public_read" ON user_comparisons
    FOR SELECT USING (true);
