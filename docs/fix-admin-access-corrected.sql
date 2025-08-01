-- Script corrigé pour créer le profil admin
-- À exécuter dans l'éditeur SQL de Supabase

-- ÉTAPE 1 : Récupérer votre UUID admin
-- Exécutez d'abord ceci pour voir votre UUID :
SELECT 
    id,
    email,
    created_at
FROM auth.users 
WHERE email = 'amande@gmail.com';  -- Remplacez par votre email

-- ÉTAPE 2 : Créer le profil admin (remplacez l'UUID)
-- Exemple avec un UUID valide (remplacez par le vôtre) :
INSERT INTO public.users (id, email, name, role, created_at)
VALUES (
    '12345678-1234-1234-1234-123456789abc',  -- REMPLACEZ par votre UUID réel
    'amande@gmail.com',                        -- REMPLACEZ par votre email
    'Admin Amande',                            -- REMPLACEZ par votre nom
    'admin',
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    updated_at = NOW();

-- ÉTAPE 3 : Vérifier que ça a fonctionné
SELECT * FROM public.users WHERE role = 'admin'; 