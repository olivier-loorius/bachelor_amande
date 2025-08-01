-- Script pour récupérer l'ID de l'utilisateur admin
-- À exécuter dans l'éditeur SQL de Supabase

-- Voir tous les utilisateurs dans auth.users
SELECT 
    id,
    email,
    created_at,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'admin@amande.fr'  -- Remplacez par votre email admin
ORDER BY created_at DESC;

-- Ou voir tous les utilisateurs pour identifier le vôtre
SELECT 
    id,
    email,
    created_at
FROM auth.users 
ORDER BY created_at DESC; 