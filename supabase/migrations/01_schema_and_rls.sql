-- AKABLISHOP Database Schema & Row Level Security (RLS) Policies
-- Migration: 01_schema_and_rls.sql

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    old_price NUMERIC(10, 2) CHECK (old_price >= 0),
    rating NUMERIC(3, 2) DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    in_stock BOOLEAN DEFAULT true,
    stock_count INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    is_new BOOLEAN DEFAULT false,
    is_occasion BOOLEAN DEFAULT false,
    is_rental BOOLEAN DEFAULT false,
    rental_price_per_day NUMERIC(10, 2) CHECK (rental_price_per_day >= 0),
    image TEXT NOT NULL,
    gallery JSONB DEFAULT '[]'::jsonb,
    short_description TEXT DEFAULT '',
    description TEXT DEFAULT '',
    specs JSONB DEFAULT '{}'::jsonb,
    whats_in_the_box JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    items JSONB NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INVENTORY TABLE
CREATE TABLE IF NOT EXISTS public.inventory (
    product_id TEXT PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    reserved_quantity INTEGER NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    low_stock_threshold INTEGER NOT NULL DEFAULT 2,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES FOR PRODUCTS
-- Public Read & Admin CMS Write Access
DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable write access for products" ON public.products;
CREATE POLICY "Enable write access for products" ON public.products
    FOR ALL USING (true) WITH CHECK (true);

-- 5. RLS POLICIES FOR ORDERS
-- Anyone can insert orders (public checkout)
DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
CREATE POLICY "Public insert orders" ON public.orders
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin select orders" ON public.orders;
CREATE POLICY "Admin select orders" ON public.orders
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin update orders" ON public.orders;
CREATE POLICY "Admin update orders" ON public.orders
    FOR UPDATE USING (true);

-- 6. INDEXES FOR FAST QUERYING & SEARCH
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 7. ENABLE REALTIME PUBLICATION FOR PRODUCTS
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
