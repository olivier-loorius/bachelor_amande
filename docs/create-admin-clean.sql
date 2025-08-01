-- Script propre : Créer le profil admin (sans mot de passe)
-- À exécuter dans l'éditeur SQL de Supabase

-- Créer le profil admin (mot de passe géré par auth.users)
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