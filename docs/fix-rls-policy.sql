-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Users can view all users" ON public.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;

-- Désactiver RLS temporairement pour tester
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Ou si vous voulez garder RLS, créer une politique simple
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all operations for authenticated users" ON public.users
--   FOR ALL USING (auth.role() = 'authenticated'); 