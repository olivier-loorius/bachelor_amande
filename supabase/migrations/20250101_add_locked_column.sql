-- Ajouter une colonne locked à la table product_config
ALTER TABLE public.product_config 
ADD COLUMN IF NOT EXISTS locked BOOLEAN DEFAULT false;

-- Mettre à jour les enregistrements existants pour qu'ils soient déverrouillés par défaut
UPDATE public.product_config 
SET locked = false 
WHERE locked IS NULL;

-- Créer un index sur la colonne locked pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_product_config_locked 
ON public.product_config(locked);

-- Vérifier la structure mise à jour
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'product_config' 
ORDER BY ordinal_position;
