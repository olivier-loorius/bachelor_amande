-- Script de nettoyage Supabase
-- Supprime toutes les tables inutiles et ne garde que la table users
-- À exécuter dans l'éditeur SQL de Supabase

-- Désactiver les triggers existants
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;

-- Supprimer les tables inutiles (ajoutez ici les noms de vos tables)
DROP TABLE IF EXISTS public.compositions CASCADE;
DROP TABLE IF EXISTS public.paniers CASCADE;
DROP TABLE IF EXISTS public.produits CASCADE;
DROP TABLE IF EXISTS public.commandes CASCADE;
DROP TABLE IF EXISTS public.details_commandes CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.actualites CASCADE;
DROP TABLE IF EXISTS public.contacts CASCADE;
DROP TABLE IF EXISTS public.favoris CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.promotions CASCADE;
DROP TABLE IF EXISTS public.stock CASCADE;
DROP TABLE IF EXISTS public.fournisseurs CASCADE;
DROP TABLE IF EXISTS public.ingredients CASCADE;
DROP TABLE IF EXISTS public.recettes CASCADE;

-- Supprimer les fonctions inutiles
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Supprimer les politiques RLS existantes sur users
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;

-- Recréer la table users proprement
DROP TABLE IF EXISTS public.users CASCADE;

CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Recréer les politiques RLS
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Recréer la fonction et le trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Message de confirmation
SELECT 'Nettoyage terminé ! Seule la table users reste.' as status; 