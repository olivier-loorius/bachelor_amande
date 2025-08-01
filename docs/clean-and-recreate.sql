-- 1. Nettoyer tout
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.admins CASCADE;
DROP TABLE IF EXISTS public.compositions CASCADE;

-- 2. Recréer le schéma propre
-- Table admins (pour la connexion admin)
CREATE TABLE public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table users (pour les utilisateurs normaux)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table compositions (pour les tartelettes personnalisées)
CREATE TABLE public.compositions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  name TEXT NOT NULL,
  fond TEXT NOT NULL,
  garniture1 TEXT,
  garniture2 TEXT,
  garniture3 TEXT,
  finition TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Insérer un admin par défaut
INSERT INTO public.admins (email, password, name) 
VALUES ('admin@amande.fr', 'admin123', 'Admin Amande');

-- 4. Désactiver RLS pour tout
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.compositions DISABLE ROW LEVEL SECURITY; 