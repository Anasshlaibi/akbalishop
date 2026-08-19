-- Migration: 20260819000000_create_categories_table.sql
-- Description: Create public.categories table with RLS policies and Realtime publication

CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT DEFAULT '',
    item_count INTEGER DEFAULT 0,
    image TEXT NOT NULL,
    icon_name TEXT DEFAULT 'Tag',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Public Read & Admin Write RLS Policies
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable write access for categories" ON public.categories;
CREATE POLICY "Enable write access for categories" ON public.categories
    FOR ALL USING (true) WITH CHECK (true);

-- Index for fast lookup by slug
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- Enable Realtime Publication for Categories
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
