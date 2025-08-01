-- Script pour récupérer l'UUID de votre compte admin
-- À exécuter dans l'éditeur SQL de Supabase

-- Remplacez 'amande@gmail.com' par votre email admin
SELECT 
    id,
    email,
    created_at
FROM auth.users 
WHERE email = 'amande@gmail.com';

-- Si vous ne connaissez pas l'email exact, voyez tous les utilisateurs :
-- SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC; 