-- AKABLISHOP Supabase Storage Setup Migration
-- Migration: 02_storage_setup.sql

-- 1. Create the 'products' bucket if it doesn't already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'products',
    'products',
    true,
    10485760, -- 10MB limit per file before server compression
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Storage Policies for Public Read & Write Access
-- Enable Public Read
DROP POLICY IF EXISTS "Public Read Product Images" ON storage.objects;
CREATE POLICY "Public Read Product Images" ON storage.objects
    FOR SELECT USING (bucket_id = 'products');

-- Enable Public/Admin Insert
DROP POLICY IF EXISTS "Public Insert Product Images" ON storage.objects;
CREATE POLICY "Public Insert Product Images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'products');

-- Enable Public/Admin Update
DROP POLICY IF EXISTS "Public Update Product Images" ON storage.objects;
CREATE POLICY "Public Update Product Images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'products');

-- Enable Public/Admin Delete
DROP POLICY IF EXISTS "Public Delete Product Images" ON storage.objects;
CREATE POLICY "Public Delete Product Images" ON storage.objects
    FOR DELETE USING (bucket_id = 'products');
