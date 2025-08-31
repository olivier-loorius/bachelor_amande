-- Script de debug pour Supabase
-- Copie-colle ceci dans l'éditeur SQL de Supabase

-- 1. Voir la structure de la table products
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'products';

-- 2. Voir TOUS les produits avec toutes les colonnes
SELECT * FROM products;

-- 3. Compter les produits par étape
SELECT step, COUNT(*) as nombre
FROM products 
GROUP BY step;

-- 4. Voir les produits avec product_index NULL
SELECT id, nom, step, product_index, images
FROM products 
WHERE product_index IS NULL;

-- 5. Voir les produits avec product_index défini
SELECT id, nom, step, product_index, images
FROM products 
WHERE product_index IS NOT NULL;

-- 6. Voir les produits avec des images vides
SELECT id, nom, step, images
FROM products 
WHERE images IS NULL OR images = '[]' OR images = '{}';

-- 7. Voir les produits avec des noms vides
SELECT id, nom, step, product_index
FROM products 
WHERE nom IS NULL OR nom = '';
