-- Migration pour créer la table product_config
-- Cette table stocke la configuration des produits fixes du site

-- Créer la table product_config
CREATE TABLE IF NOT EXISTS public.product_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  config_type TEXT NOT NULL CHECK (config_type IN ('fond', 'premiere_couche', 'seconde_couche', 'touche_finale')),
  product_index INTEGER NOT NULL,
  nom TEXT NOT NULL,
  images JSONB DEFAULT '[]',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(config_type, product_index)
);

-- Créer les index pour optimiser les performances
DROP INDEX IF EXISTS idx_product_config_type;
CREATE INDEX idx_product_config_type ON public.product_config(config_type);
DROP INDEX IF EXISTS idx_product_config_created_by;
CREATE INDEX idx_product_config_created_by ON public.product_config(created_by);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_product_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Déclencheur pour updated_at
DROP TRIGGER IF EXISTS trigger_update_product_config_updated_at ON public.product_config;
CREATE TRIGGER trigger_update_product_config_updated_at
  BEFORE UPDATE ON public.product_config
  FOR EACH ROW
  EXECUTE FUNCTION update_product_config_updated_at();

-- Activer RLS (Row Level Security)
ALTER TABLE public.product_config ENABLE ROW LEVEL SECURITY;

-- Politique : Tout le monde peut voir la configuration des produits
DROP POLICY IF EXISTS "Product config is viewable by everyone" ON public.product_config;
CREATE POLICY "Product config is viewable by everyone"
  ON public.product_config
  FOR SELECT
  USING (true);

-- Politique : Seuls les admins peuvent modifier la configuration
DROP POLICY IF EXISTS "Admins can update product config" ON public.product_config;
CREATE POLICY "Admins can update product config"
  ON public.product_config
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
      AND users.deleted IS NOT TRUE
    )
  );

-- Insérer les données par défaut
INSERT INTO public.product_config (config_type, product_index, nom, images, created_by) VALUES
-- Fonds (3 produits)
('fond', 0, 'Pâte sucrée vanille', '[]', NULL),
('fond', 1, 'Pâte sucrée chocolat', '[]', NULL),
('fond', 2, 'Pâte sucrée framboise', '[]', NULL),

-- Première couche de douceur (4 produits)
('premiere_couche', 0, 'Crème pâtissière vanille', '[]', NULL),
('premiere_couche', 1, 'Crème pâtissière chocolat', '[]', NULL),
('premiere_couche', 2, 'Crème pâtissière framboise', '[]', NULL),
('premiere_couche', 3, 'Crème pâtissière fraise', '[]', NULL),

-- Seconde couche de douceur (4 produits)
('seconde_couche', 0, 'Crème pâtissière vanille', '[]', NULL),
('seconde_couche', 1, 'Crème pâtissière chocolat', '[]', NULL),
('seconde_couche', 2, 'Crème pâtissière framboise', '[]', NULL),
('seconde_couche', 3, 'Crème pâtissière fraise', '[]', NULL),

-- Touche finale (4 produits)
('touche_finale', 0, 'Meringue italienne', '[]', NULL),
('touche_finale', 1, 'Meringue chantilly', '[]', NULL),
('touche_finale', 2, 'Glaçage miroir', '[]', NULL),
('touche_finale', 3, 'Décors chocolat', '[]', NULL)
ON CONFLICT (config_type, product_index) DO NOTHING;

-- Commentaires pour la documentation
COMMENT ON TABLE public.product_config IS 'Configuration des produits fixes du site (fonds, douceurs, finitions)';
COMMENT ON COLUMN public.product_config.config_type IS 'Type de configuration: fond, premiere_couche, seconde_couche, touche_finale';
COMMENT ON COLUMN public.product_config.product_index IS 'Index du produit dans sa catégorie (0, 1, 2, 3)';
COMMENT ON COLUMN public.product_config.nom IS 'Nom du produit/CTA';
COMMENT ON COLUMN public.product_config.images IS 'Tableau JSON des URLs des images';
COMMENT ON COLUMN public.product_config.created_by IS 'ID de l''utilisateur qui a créé cette configuration';
