-- LuxePaws - Supabase Database Initialization Script
-- Copy and paste this script into your Supabase SQL Editor to set up the products table and load starter data.

-- 1. Drop existing table if it exists
DROP TABLE IF EXISTS products;

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

-- 4. Create a policy to allow public select/read access (necessary for client-side API requests)
CREATE POLICY "Allow public read access" ON products
  FOR SELECT
  TO public
  USING (true);

-- 5. Insert LuxePaws starter products
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
