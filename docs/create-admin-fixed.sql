-- Script corrigé pour créer le profil admin (sans updated_at)
-- À exécuter dans l'éditeur SQL de Supabase

INSERT INTO public.users (id, email, name, role, created_at)
VALUES (
    'da792e85-2e02-436a-ad5f-5b8da643d8c8',  -- Votre UUID admin
    'amande@gmail.com',                         -- Votre email
    'Admin Amande',                             -- Votre nom
    'admin',
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role;

-- Vérifier que l'insertion a fonctionné
SELECT * FROM public.users WHERE role = 'admin'; 