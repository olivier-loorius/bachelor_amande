-- Configuration Supabase pour Amande
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Créer le bucket de stockage pour les images des produits
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Créer la table product_config
CREATE TABLE IF NOT EXISTS product_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  config_type TEXT NOT NULL CHECK (config_type IN ('fonds', 'premiere_couche_douceur', 'seconde_couche_douceur', 'touche_finale')),
  product_index INTEGER NOT NULL,
  nom TEXT NOT NULL DEFAULT '',
  images TEXT[] DEFAULT '{}',
  locked BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contrainte d'unicité
  UNIQUE(config_type, product_index)
);

-- 3. Activer RLS (Row Level Security)
ALTER TABLE product_config ENABLE ROW LEVEL SECURITY;

-- 4. Politique de lecture publique (pour le Composer)
CREATE POLICY "product_config_read_public" ON product_config
  FOR SELECT USING (true);

-- 5. Politique d'écriture pour les admins uniquement
CREATE POLICY "product_config_write_admin" ON product_config
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.role = 'admin'
    )
  );

-- 6. Politique de mise à jour pour les admins
CREATE POLICY "product_config_update_admin" ON product_config
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.role = 'admin'
    )
  );

-- 7. Politique d'insertion pour les admins
CREATE POLICY "product_config_insert_admin" ON product_config
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.role = 'admin'
    )
  );

-- 8. Politique de suppression pour les admins
CREATE POLICY "product_config_delete_admin" ON product_config
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.role = 'admin'
    )
  );

-- 9. Politique de stockage pour les images
CREATE POLICY "product_images_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "product_images_admin_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.role = 'admin'
    )
  );

CREATE POLICY "product_images_admin_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.role = 'admin'
    )
  );

-- 10. Initialiser la configuration par défaut
INSERT INTO product_config (config_type, product_index, nom, images, locked) VALUES
  ('fonds', 0, '', '{}', true),
  ('fonds', 1, '', '{}', true),
  ('fonds', 2, '', '{}', true),
  
  ('premiere_couche_douceur', 0, '', '{}', true),
  ('premiere_couche_douceur', 1, '', '{}', true),
  ('premiere_couche_douceur', 2, '', '{}', true),
  ('premiere_couche_douceur', 3, '', '{}', true),
  
  ('seconde_couche_douceur', 0, '', '{}', true),
  ('seconde_couche_douceur', 1, '', '{}', true),
  ('seconde_couche_douceur', 2, '', '{}', true),
  ('seconde_couche_douceur', 3, '', '{}', true),
  
  ('touche_finale', 0, '', '{}', true),
  ('touche_finale', 1, '', '{}', true),
  ('touche_finale', 2, '', '{}', true),
  ('touche_finale', 3, '', '{}', true)
ON CONFLICT (config_type, product_index) DO NOTHING;

-- 11. Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_product_config_type_index ON product_config(config_type, product_index);

-- 12. Créer une fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 13. Créer le trigger pour updated_at
CREATE TRIGGER update_product_config_updated_at 
  BEFORE UPDATE ON product_config 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Vérification
SELECT 'Configuration Supabase terminée' as status;
SELECT COUNT(*) as total_configs FROM product_config;
SELECT config_type, COUNT(*) as count FROM product_config GROUP BY config_type;
