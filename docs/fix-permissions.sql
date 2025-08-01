-- 🔧 CORRECTION DES PERMISSIONS SUPABASE
-- Exécuter ce script dans l'éditeur SQL de Supabase

-- 1. Désactiver RLS temporairement pour simplifier
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 2. Donner les permissions nécessaires
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT INSERT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT UPDATE ON ALL TABLES IN SCHEMA public TO authenticated;

-- 3. Vérifier les permissions
SELECT table_name, grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND table_name = 'users'; 