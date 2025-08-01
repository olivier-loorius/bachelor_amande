-- Script pour créer le profil admin dans public.users
-- À exécuter dans l'éditeur SQL de Supabase
-- Remplacez 'VOTRE_UUID_ADMIN' par l'ID récupéré de l'étape précédente

INSERT INTO public.users (id, email, name, role, created_at)
VALUES (
  'VOTRE_UUID_ADMIN',  -- Remplacez par l'ID de votre compte admin
  'admin@amande.fr',    -- Remplacez par votre email admin
  'Admin Amande',       -- Remplacez par votre nom
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