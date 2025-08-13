-- Script simple pour créer la table users dans Supabase
-- À exécuter dans l'éditeur SQL de Supabase

-- Créer la table users
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leurs propres données
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Politique pour permettre aux utilisateurs de modifier leurs propres données
CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Politique pour permettre l'insertion de nouvelles données utilisateur
CREATE POLICY "Users can insert own data" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insérer un utilisateur admin de test (optionnel)
-- INSERT INTO public.users (id, email, name, role) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 'admin@amande.fr', 'Admin Amande', 'admin')
-- ON CONFLICT (id) DO NOTHING; 