-- Script final : Créer le profil admin (gère updated_at existant)
-- À exécuter dans l'éditeur SQL de Supabase

-- Créer le profil admin (ignorer l'erreur si updated_at existe déjà)
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

-- Vérifier que l'insertion a fonctionné
SELECT * FROM public.users WHERE role = 'admin';

-- Vérifier la structure de la table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position; 