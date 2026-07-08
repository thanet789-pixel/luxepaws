-- LuxePaws - Supabase Database Initialization Script (Version 2 - Professional Backend)
-- Copy and paste this script into your Supabase SQL Editor to set up the products and orders tables,
-- enable security RLS policies, and load starter product catalog data.

-- 1. Drop existing tables if they exist
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;

-- =========================================================================
-- PRODUCTS TABLE SETUP
-- =========================================================================

-- 2. Create the products table
CREATE TABLE products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title_en TEXT NOT NULL,
  title_th TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  category_en TEXT NOT NULL,
  category_th TEXT NOT NULL,
  badge_en TEXT NULL,
  badge_th TEXT NULL,
  swatches JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 3. Enable Row Level Security (RLS) to protect data
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 4. Create policies for the products table
-- A. Allow anyone (including anonymous customers) to view/read products
CREATE POLICY "Allow public read access" ON products
  FOR SELECT
  TO public
  USING (true);

-- B. Allow only authenticated admin users (logged in) to perform CRUD (write, edit, delete)
CREATE POLICY "Allow authenticated admin write access" ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Insert LuxePaws starter product catalog data
INSERT INTO products (title_en, title_th, price, image_url, category, category_en, category_th, badge_en, badge_th, swatches)
VALUES
(
  'Nido Felt Dog Bed', 
  'ที่นอนสุนัขใยสักหลาด Nido', 
  189.00, 
  'assets/dog_bed.png', 
  'dog', 
  'Beds & Cushions', 
  'ที่นอนและเบาะหนุน', 
  'Bestseller', 
  'ขายดีที่สุด', 
  '["Grey", "Cream", "Charcoal"]'::jsonb
),
(
  'Desco Oak Bowl Stand', 
  'ที่วางชามข้าว Desco ไม้โอ๊ค', 
  99.00, 
  'assets/pet_bowl.png', 
  'accessories', 
  'Feeding & Care', 
  'การกินและการดูแล', 
  NULL, 
  NULL, 
  '["Oak", "Ash Black"]'::jsonb
),
(
  'Torre Cat Scratcher Tower', 
  'คอนโดที่ฝนเล็บแมวรุ่น Torre', 
  249.00, 
  'assets/cat_scratch.png', 
  'cat', 
  'Scratchers & Climbing', 
  'ที่ฝนเล็บและการปีนป่าย', 
  'New', 
  'มาใหม่', 
  '["Cream", "Grey"]'::jsonb
);

-- =========================================================================
-- ORDERS TABLE SETUP
-- =========================================================================

-- 6. Create the orders table
CREATE TABLE orders (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  items JSONB NOT NULL, -- Array of items bought: [{id, title, qty, price, color}]
  total_price NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' -- 'pending', 'shipped', 'completed'
);

-- 7. Enable Row Level Security (RLS) for the orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 8. Create policies for the orders table
-- A. Allow anyone (public customers checking out) to submit/insert a new order
CREATE POLICY "Allow public order insertion" ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

-- B. Allow only authenticated admin users to view, edit, or delete customer orders
CREATE POLICY "Allow authenticated admin read/write access" ON orders
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
