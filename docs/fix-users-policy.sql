-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view all users" ON public.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;

-- Créer une nouvelle politique pour permettre la lecture
CREATE POLICY "Enable read access for all users" ON public.users
  FOR SELECT USING (true);

-- Vérifier que RLS est activé
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY; 