-- Script pour vider et recréer la configuration des produits
-- Date: 2025-01-01
-- Objectif: Nettoyer la table et insérer une configuration de base cohérente

-- 1. Vider la table existante
TRUNCATE TABLE public.product_config RESTART IDENTITY CASCADE;

-- 2. Insérer la configuration de base cohérente
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
    ('touche_finale', 3, 'Décors chocolat', '[]');

-- 3. Vérifier l'insertion
SELECT 
    config_type,
    product_index,
    nom,
    images,
    created_at
FROM public.product_config 
ORDER BY config_type, product_index;

-- 4. Compter le nombre total de produits configurés
SELECT 
    config_type,
    COUNT(*) as total
FROM public.product_config 
GROUP BY config_type
ORDER BY config_type;
