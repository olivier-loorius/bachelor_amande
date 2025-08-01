-- Script pour gérer la contrainte password NOT NULL
-- À exécuter dans l'éditeur SQL de Supabase

-- Option 1 : Rendre password nullable (recommandé)
ALTER TABLE public.users ALTER COLUMN password DROP NOT NULL;

-- Option 2 : Ou ajouter un mot de passe temporaire (moins recommandé)
-- INSERT INTO public.users (id, email, name, password, role, created_at)
-- VALUES (
--     'da792e85-2e02-436a-ad5f-5b8da643d8c8',
--     'amande@gmail.com',
--     'Admin Amande',
--     'temp_password',  -- Mot de passe temporaire
--     'admin',
--     NOW()
-- )
-- ON CONFLICT (id) DO UPDATE SET
--     email = EXCLUDED.email,
--     name = EXCLUDED.name,
--     role = EXCLUDED.role,
--     updated_at = NOW();

-- Vérifier la structure après modification
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position; 