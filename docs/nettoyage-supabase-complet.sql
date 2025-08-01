-- 🧹 NETTOYAGE COMPLET SUPABASE
-- Exécuter ce script dans l'éditeur SQL de Supabase

-- 1. Supprimer toutes les tables existantes
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.admins CASCADE;
DROP TABLE IF EXISTS public.compositions CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.cart CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;

-- 2. Supprimer toutes les fonctions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- 3. Supprimer tous les triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_updated_at_column ON public.users;

-- 4. Vérifier que tout est propre
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name; 