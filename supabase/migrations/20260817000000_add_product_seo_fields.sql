-- Migration: Add Product SEO Columns
-- Description: Adds optional SEO metadata fields to the public.products table for AkbaliShop.

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS seo_keywords TEXT,
ADD COLUMN IF NOT EXISTS seo_h1 TEXT,
ADD COLUMN IF NOT EXISTS seo_short_description TEXT,
ADD COLUMN IF NOT EXISTS seo_alt_text TEXT,
ADD COLUMN IF NOT EXISTS canonical_url TEXT,
ADD COLUMN IF NOT EXISTS og_title TEXT,
ADD COLUMN IF NOT EXISTS og_description TEXT,
ADD COLUMN IF NOT EXISTS og_image TEXT,
ADD COLUMN IF NOT EXISTS seo_noindex BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN public.products.seo_title IS 'Custom SEO title tag override for search engines';
COMMENT ON COLUMN public.products.seo_description IS 'Custom SEO meta description override';
COMMENT ON COLUMN public.products.seo_keywords IS 'Comma-separated meta keywords';
COMMENT ON COLUMN public.products.seo_h1 IS 'Primary H1 header override for product detail page';
COMMENT ON COLUMN public.products.seo_short_description IS 'Optimized short summary for SERP snippets';
COMMENT ON COLUMN public.products.seo_alt_text IS 'Descriptive ALT text for product images';
COMMENT ON COLUMN public.products.canonical_url IS 'Absolute canonical URL override';
COMMENT ON COLUMN public.products.og_title IS 'Open Graph social title override';
COMMENT ON COLUMN public.products.og_description IS 'Open Graph social description override';
COMMENT ON COLUMN public.products.og_image IS 'Open Graph social image URL override';
COMMENT ON COLUMN public.products.seo_noindex IS 'Flag to set robots noindex meta tag if true';
