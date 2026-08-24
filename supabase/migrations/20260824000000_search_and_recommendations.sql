-- Migration: Intelligent Search & Recommendations Indexes and Tables
-- Created: 2026-08-24

-- 1. Enable Full-Text Search and Trigram extensions if available
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Create Full-Text Search tsvector Column & Index on Products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS fts tsvector;

-- Function to update fts vector automatically
CREATE OR REPLACE FUNCTION public.products_fts_trigger() RETURNS trigger AS $$
BEGIN
  NEW.fts :=
    setweight(to_tsvector('french', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('french', coalesce(NEW.brand, '')), 'B') ||
    setweight(to_tsvector('french', coalesce(NEW.category, '')), 'B') ||
    setweight(to_tsvector('french', coalesce(NEW.short_description, '')), 'C') ||
    setweight(to_tsvector('french', coalesce(NEW.description, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_fts ON public.products;
CREATE TRIGGER trg_products_fts
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.products_fts_trigger();

-- Initialize fts values for existing products
UPDATE public.products SET fts =
  setweight(to_tsvector('french', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('french', coalesce(brand, '')), 'B') ||
  setweight(to_tsvector('french', coalesce(category, '')), 'B') ||
  setweight(to_tsvector('french', coalesce(short_description, '')), 'C') ||
  setweight(to_tsvector('french', coalesce(description, '')), 'D');

CREATE INDEX IF NOT EXISTS idx_products_fts ON public.products USING gin(fts);
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON public.products USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_brand_trgm ON public.products USING gin(brand gin_trgm_ops);

-- 3. Search Analytics Log Table
CREATE TABLE IF NOT EXISTS public.search_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  results_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policy for Search Analytics
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to search_analytics" ON public.search_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read to search_analytics" ON public.search_analytics
  FOR SELECT USING (true);
