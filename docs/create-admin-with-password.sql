-- Script pour créer l'admin avec mot de passe temporaire
-- À exécuter dans l'éditeur SQL de Supabase

-- Créer le profil admin avec mot de passe temporaire
INSERT INTO public.users (id, email, name, password, role, created_at)
VALUES (
    'da792e85-2e02-436a-ad5f-5b8da643d8c8',
    'amande@gmail.com',
    'Admin Amande',
    'temp_password_123',  -- Mot de passe temporaire
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