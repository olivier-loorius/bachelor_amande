-- Script complet pour récupérer l'ID admin et créer le profil
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Récupérer l'ID du compte admin dans auth.users
-- Remplacez 'amande@gmail.com' par votre email admin
SELECT 
    id,
    email,
    created_at
FROM auth.users 
WHERE email = 'amande@gmail.com';

-- 2. Insérer ce compte dans public.users
-- Remplacez 'VOTRE_UUID_ADMIN' par l'ID récupéré ci-dessus
INSERT INTO public.users (id, email, name, role, created_at)
VALUES (
    'VOTRE_UUID_ADMIN',  -- Remplacez par l'ID de votre compte admin
    'amande@gmail.com',   -- Remplacez par votre email admin
    'Admin Amande',       -- Remplacez par votre nom
    'admin',
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    updated_at = NOW();

-- 3. Configurer les policies RLS pour les admins
-- Activer RLS (si pas déjà activé)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy pour que les admins puissent lire tous les profils
DROP POLICY IF EXISTS "Allow admins to select all users" ON public.users;
CREATE POLICY "Allow admins to select all users"
ON public.users
FOR SELECT
USING (
    auth.uid() = id OR 
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Policy pour que les admins puissent modifier les profils
DROP POLICY IF EXISTS "Allow admins to modify users" ON public.users;
CREATE POLICY "Allow admins to modify users"
ON public.users
FOR UPDATE
USING (
    auth.uid() = id OR 
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Policy pour permettre l'insertion
DROP POLICY IF EXISTS "Allow users to insert own data" ON public.users;
CREATE POLICY "Allow users to insert own data"
ON public.users
FOR INSERT
WITH CHECK (auth.uid() = id);

-- 4. Vérifier que tout fonctionne
SELECT * FROM public.users WHERE role = 'admin'; 