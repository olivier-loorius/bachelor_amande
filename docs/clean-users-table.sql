-- Script pour nettoyer la table users (supprimer password)
-- À exécuter dans l'éditeur SQL de Supabase

-- Étape 1 : Vérifier la structure actuelle
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Étape 2 : Supprimer la colonne password (recommandé)
ALTER TABLE public.users DROP COLUMN password;

-- Étape 3 : Vérifier la structure après nettoyage
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position; 