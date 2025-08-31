-- Script pour corriger le problème RLS
-- Exécute ceci dans l'éditeur SQL de Supabase

-- 1. Désactiver RLS temporairement sur la table products
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- 2. Vérifier que RLS est désactivé
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'products';

-- 3. Tester l'insertion (optionnel)
-- INSERT INTO products (nom, step, locked, product_index, images) 
-- VALUES ('Test', 'fonds', false, 0, '{}');
