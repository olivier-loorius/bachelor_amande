-- Script de vérification et correction de la table product_config
-- Date: 2025-01-01

-- 1. Vérifier la structure actuelle de la table
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'product_config' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Vérifier les contraintes de vérification
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.product_config'::regclass 
AND contype = 'c';

-- 3. Supprimer la table si elle existe (pour la recréer proprement)
DROP TABLE IF EXISTS public.product_config CASCADE;

-- 4. Recréer la table avec la bonne structure
CREATE TABLE public.product_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_type VARCHAR NOT NULL CHECK (config_type IN ('fonds', 'premiere_couche_douceur', 'seconde_couche_douceur', 'touche_finale')),
    product_index INTEGER NOT NULL CHECK (product_index >= 0),
    nom VARCHAR NOT NULL,
    images JSONB DEFAULT '[]',
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(config_type, product_index)
);

-- 5. Créer des index pour améliorer les performances
CREATE INDEX idx_product_config_type ON public.product_config(config_type);
CREATE INDEX idx_product_config_created_by ON public.product_config(created_by);

-- 6. Créer un trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_product_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_config_updated_at
    BEFORE UPDATE ON public.product_config
    FOR EACH ROW
    EXECUTE FUNCTION update_product_config_updated_at();

-- 7. Activer RLS (Row Level Security)
ALTER TABLE public.product_config ENABLE ROW LEVEL SECURITY;

-- 8. Politique pour permettre la lecture publique de la configuration
CREATE POLICY "Product config is viewable by everyone" ON public.product_config
    FOR SELECT USING (true);

-- 9. Politique pour permettre aux admins de modifier la configuration
CREATE POLICY "Admins can update product config" ON public.product_config
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- 10. Vérifier que la table est vide et prête
SELECT COUNT(*) as total_records FROM public.product_config;

-- Commentaire : La table est maintenant recréée avec la bonne structure
-- et prête à recevoir la configuration depuis le dashboard admin
