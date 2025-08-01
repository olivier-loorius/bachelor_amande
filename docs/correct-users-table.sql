-- Supprimer l'ancienne table users
DROP TABLE IF EXISTS public.users CASCADE;

-- Recréer la table users avec les bons champs
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Désactiver RLS
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY; 