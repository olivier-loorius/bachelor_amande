-- Migration pour créer la table de configuration des produits fixes
-- Date: 2025-01-01

-- Créer la table de configuration des produits
CREATE TABLE IF NOT EXISTS public.product_config (
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

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_product_config_type ON public.product_config(config_type);
CREATE INDEX IF NOT EXISTS idx_product_config_created_by ON public.product_config(created_by);

-- Créer un trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_product_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS trigger_update_product_config_updated_at
    BEFORE UPDATE ON public.product_config
    FOR EACH ROW
    EXECUTE FUNCTION update_product_config_updated_at();

-- Activer RLS (Row Level Security)
ALTER TABLE public.product_config ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique de la configuration
CREATE POLICY IF NOT EXISTS "Product config is viewable by everyone" ON public.product_config
    FOR SELECT USING (true);

-- Politique pour permettre aux admins de modifier la configuration
CREATE POLICY IF NOT EXISTS "Admins can update product config" ON public.product_config
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Insérer la configuration par défaut
INSERT INTO public.product_config (config_type, product_index, nom, images) VALUES
    -- Étape 1: Fonds de base (3 produits)
    ('fonds', 0, 'Pâte sucrée vanille', '[]'),
    ('fonds', 1, 'Pâte sucrée chocolat', '[]'),
    ('fonds', 2, 'Pâte sucrée framboise', '[]'),
    
    -- Étape 2: Première couche de douceur (4 CTA/liens)
    ('premiere_couche_douceur', 0, 'Crème pâtissière vanille', '[]'),
    ('premiere_couche_douceur', 1, 'Crème pâtissière chocolat', '[]'),
    ('premiere_couche_douceur', 2, 'Crème pâtissière framboise', '[]'),
    ('premiere_couche_douceur', 3, 'Crème pâtissière fraise', '[]'),
    
    -- Étape 3: Seconde couche de douceur (4 CTA/liens)
    ('seconde_couche_douceur', 0, 'Ganache chocolat noir', '[]'),
    ('seconde_couche_douceur', 1, 'Mousse chocolat au lait', '[]'),
    ('seconde_couche_douceur', 2, 'Crème d\'amandes', '[]'),
    ('seconde_couche_douceur', 3, 'Fruit frais de saison', '[]'),
    
    -- Étape 4: La touche finale (4 CTA/liens)
    ('touche_finale', 0, 'Meringue italienne', '[]'),
    ('touche_finale', 1, 'Meringue chantilly', '[]'),
    ('touche_finale', 2, 'Glaçage miroir', '[]'),
    ('touche_finale', 3, 'Décors chocolat', '[]')
ON CONFLICT (config_type, product_index) DO NOTHING;

-- Commentaires sur la table
COMMENT ON TABLE public.product_config IS 'Configuration des produits fixes pour le composer de tartelettes (4 étapes)';
COMMENT ON COLUMN public.product_config.config_type IS 'Type de configuration (fonds, premiere_couche_douceur, seconde_couche_douceur, touche_finale)';
COMMENT ON COLUMN public.product_config.product_index IS 'Index du produit dans sa catégorie (0, 1, 2, 3)';
COMMENT ON COLUMN public.product_config.nom IS 'Nom du CTA/Lien ou du fond';
COMMENT ON COLUMN public.product_config.images IS 'Tableau des URLs d''images d''évolution (JSON)';
COMMENT ON COLUMN public.product_config.created_by IS 'ID de l''utilisateur qui a créé la configuration';
COMMENT ON COLUMN public.product_config.created_at IS 'Date de création de la configuration';
COMMENT ON COLUMN public.product_config.updated_at IS 'Date de dernière modification de la configuration';
