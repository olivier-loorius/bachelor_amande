-- Étape 1 : Ajouter la colonne updated_at
-- À exécuter dans l'éditeur SQL de Supabase

ALTER TABLE public.users
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Vérifier que la colonne a été ajoutée
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position; 