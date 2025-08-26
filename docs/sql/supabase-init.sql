-- Suppression des tables existantes si besoin
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS products_with_images CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Table : users
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  deleted boolean DEFAULT false,
  deleted_at timestamp with time zone
);

-- Table : products
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  locked boolean DEFAULT false,
  step text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Table : product_images
CREATE TABLE product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  url text NOT NULL,
  image_index integer NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Table : products_with_images (vue ou table intermédiaire)
CREATE TABLE products_with_images (
  id uuid,
  nom text,
  locked boolean,
  step text,
  created_at timestamp with time zone,
  images json
);

-- Triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sécurité RLS (optionnel, à adapter selon tes besoins)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Politiques RLS de base (exemple)
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete own data" ON users
  FOR DELETE USING (true);

-- (Optionnel) Ajoute des index pour les performances
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_products_step ON products(step);

-- (Optionnel) Vue pour faciliter les jointures images/produits
-- À adapter selon tes besoins réels
-- CREATE OR REPLACE VIEW products_with_images AS
-- SELECT
--   p.id,
--   p.nom,
--   p.locked,
--   p.step,
--   p.created_at,
--   json_agg(pi.url ORDER BY pi.image_index) AS images
-- FROM products p
-- LEFT JOIN product_images pi ON pi.product_id = p.id
-- GROUP BY p.id;

-- Fin du script