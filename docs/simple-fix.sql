-- Ajouter une politique de lecture simple (sans supprimer les autres)
CREATE POLICY IF NOT EXISTS "Allow read for all" ON public.users
  FOR SELECT USING (true); 