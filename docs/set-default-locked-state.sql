-- Script pour définir l'état verrouillé par défaut pour tous les produits
-- À exécuter directement dans l'interface Supabase SQL Editor

-- 1. Mettre à jour tous les produits existants pour qu'ils soient verrouillés
UPDATE public.product_config 
SET locked = true 
WHERE locked IS NULL OR locked = false;

-- 2. Vérifier que tous les produits sont maintenant verrouillés
SELECT config_type, product_index, nom, locked 
FROM public.product_config 
ORDER BY config_type, product_index;

-- 3. Compter les produits par état de verrouillage
SELECT 
  locked,
  COUNT(*) as nombre_produits
FROM public.product_config 
GROUP BY locked;

-- 4. Vérifier la structure de la table
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'product_config' 
ORDER BY ordinal_position;
