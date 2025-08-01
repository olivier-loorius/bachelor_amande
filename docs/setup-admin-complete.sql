-- Script complet : Setup Admin avec updated_at
-- À exécuter dans l'éditeur SQL de Supabase

-- Étape 1 : Ajouter la colonne updated_at
ALTER TABLE public.users
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Étape 2 : Créer le profil admin
INSERT INTO public.users (id, email, name, role, created_at)
VALUES (
    'da792e85-2e02-436a-ad5f-5b8da643d8c8',
    'amande@gmail.com',
    'Admin Amande',
    'admin',
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    updated_at = NOW();

-- Étape 3 : Vérifier le résultat
SELECT * FROM public.users WHERE role = 'admin';

-- Étape 4 : Vérifier la structure de la table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position; 