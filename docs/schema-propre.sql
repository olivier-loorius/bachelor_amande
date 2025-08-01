-- 🏗️ SCHÉMA PROPRE POUR AMANDE
-- Exécuter ce script après le nettoyage

-- 1. Table des administrateurs
CREATE TABLE public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table des utilisateurs
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table des compositions (tartelettes personnalisées)
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

-- 4. Désactiver RLS pour simplifier
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.compositions DISABLE ROW LEVEL SECURITY;

-- 5. Vérifier les tables créées
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name; 