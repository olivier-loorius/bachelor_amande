-- Script complet pour corriger tous les problèmes RLS
-- Exécute ceci dans l'éditeur SQL de Supabase

-- 1. Désactiver RLS sur toutes les tables concernées
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_images DISABLE ROW LEVEL SECURITY;

-- 2. Vérifier que RLS est désactivé
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('products', 'product_images');

-- 3. Vérifier que la colonne images existe dans products
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'images';

-- 4. Tester l'insertion (optionnel)
-- INSERT INTO products (nom, step, locked, product_index, images) 
-- VALUES ('Test', 'fonds', false, 0, '{}');
