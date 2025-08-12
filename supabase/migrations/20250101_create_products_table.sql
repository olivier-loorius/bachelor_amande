-- Migration pour créer la table products
-- Date: 2025-01-01

-- Créer la table products si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    category VARCHAR NOT NULL,
    image_url VARCHAR,
    ingredients JSONB DEFAULT '[]',
    is_available BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_by ON public.products(created_by);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON public.products(is_available);

-- Créer un trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS trigger_update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_products_updated_at();

-- Activer RLS (Row Level Security)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique des produits disponibles
CREATE POLICY IF NOT EXISTS "Products are viewable by everyone" ON public.products
    FOR SELECT USING (is_available = true);

-- Politique pour permettre aux admins de créer des produits
CREATE POLICY IF NOT EXISTS "Admins can create products" ON public.products
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Politique pour permettre aux admins de modifier leurs produits
CREATE POLICY IF NOT EXISTS "Admins can update products" ON public.products
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Politique pour permettre aux admins de supprimer leurs produits
CREATE POLICY IF NOT EXISTS "Admins can delete products" ON public.products
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Insérer quelques produits d'exemple (optionnel)
INSERT INTO public.products (name, description, price, category, image_url, ingredients) VALUES
    ('Tarte au citron meringuée', 'Délicieuse tarte au citron avec meringue italienne', 6.00, 'tartelettes', '/images/TCitron.png', '["Pâte sucrée", "Citron", "Sucre", "Œufs", "Beurre"]'),
    ('Tarte aux fraises', 'Tarte aux fraises fraîches avec crème pâtissière', 6.00, 'tartelettes', '/images/TFraise.jpg', '["Pâte sablée", "Fraise", "Crème pâtissière", "Vanille"]'),
    ('Tarte au chocolat', 'Tarte au chocolat noir avec ganache et mousse', 6.00, 'tartelettes', '/images/TChocolat.jpg', '["Pâte sablée", "Chocolat noir", "Crème", "Beurre"]'),
    ('Tarte aux poires', 'Tarte aux poires Williams avec amandes', 6.00, 'tartelettes', '/images/Tpoire.jpg', '["Pâte brisée", "Poire", "Amandes", "Sucre"]')
ON CONFLICT (name) DO NOTHING;

-- Commentaires sur la table
COMMENT ON TABLE public.products IS 'Table des produits de pâtisserie disponibles à la vente';
COMMENT ON COLUMN public.products.id IS 'Identifiant unique du produit';
COMMENT ON COLUMN public.products.name IS 'Nom du produit';
COMMENT ON COLUMN public.products.description IS 'Description détaillée du produit';
COMMENT ON COLUMN public.products.price IS 'Prix du produit en euros';
COMMENT ON COLUMN public.products.category IS 'Catégorie du produit (tartelettes, gateaux, etc.)';
COMMENT ON COLUMN public.products.image_url IS 'URL de l''image du produit';
COMMENT ON COLUMN public.products.ingredients IS 'Liste des ingrédients au format JSON';
COMMENT ON COLUMN public.products.is_available IS 'Indique si le produit est disponible à la vente';
COMMENT ON COLUMN public.products.created_by IS 'ID de l''utilisateur qui a créé le produit';
COMMENT ON COLUMN public.products.created_at IS 'Date de création du produit';
COMMENT ON COLUMN public.products.updated_at IS 'Date de dernière modification du produit';
