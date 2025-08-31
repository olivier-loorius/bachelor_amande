-- CORRECTION COMPLÈTE - Exécute ceci dans Supabase SQL Editor

-- 1. Désactiver RLS temporairement
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- 2. Attribuer product_index automatiquement (0-based par step)
WITH ranked AS (
  SELECT
    id,
    step,
    (ROW_NUMBER() OVER (PARTITION BY step ORDER BY created_at ASC) - 1) AS rn0
  FROM products
)
UPDATE products p
SET product_index = r.rn0
FROM ranked r
WHERE p.id = r.id;

-- 3. Remplir les noms vides
UPDATE products
SET nom = CONCAT(
  CASE step
    WHEN 'fonds' THEN 'Fond'
    WHEN 'premiereCoucheDouceur' THEN 'Garniture 1'
    WHEN 'secondeCoucheDouceur' THEN 'Garniture 2'
    WHEN 'toucheFinale' THEN 'Garniture 3'
  END,
  ' ',
  (COALESCE(product_index, 0) + 1)
)
WHERE nom IS NULL OR btrim(nom) = '';

-- 4. Supprimer les doublons (garder le plus récent)
DELETE FROM products p
USING (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY step, nom ORDER BY created_at) AS rn
  FROM products
) d
WHERE p.id = d.id AND d.rn > 1;

-- 5. Vérifier le résultat
SELECT step, product_index, nom, created_at 
FROM products 
ORDER BY step, product_index;

-- 6. Donner les droits de lecture
GRANT SELECT ON public.products TO anon;
