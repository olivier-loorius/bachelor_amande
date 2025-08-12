-- Script pour ajouter la colonne locked à la table product_config
-- À exécuter directement dans l'interface Supabase SQL Editor

-- 1. Ajouter la colonne locked
ALTER TABLE public.product_config 
ADD COLUMN IF NOT EXISTS locked BOOLEAN DEFAULT false;

-- 2. Mettre à jour les enregistrements existants
UPDATE public.product_config 
SET locked = false 
WHERE locked IS NULL;

-- 3. Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_product_config_locked 
ON public.product_config(locked);

-- 4. Vérifier la structure mise à jour
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'product_config' 
ORDER BY ordinal_position;

-- 5. Vérifier que la colonne est bien ajoutée
SELECT * FROM public.product_config LIMIT 3;
