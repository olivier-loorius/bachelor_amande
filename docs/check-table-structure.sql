-- Vérifier la structure actuelle de la table users
-- À exécuter dans l'éditeur SQL de Supabase

SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position; 