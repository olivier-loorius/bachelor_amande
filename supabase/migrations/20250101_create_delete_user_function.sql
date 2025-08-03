-- Fonction pour supprimer un utilisateur avec les permissions admin
CREATE OR REPLACE FUNCTION delete_user_profile(user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Supprimer le profil utilisateur de public.users
  DELETE FROM public.users WHERE id = user_id;
  
  -- Log de la suppression
  RAISE NOTICE 'Profil utilisateur % supprimé', user_id;
END;
$$;

-- Donner les permissions d'exécution
GRANT EXECUTE ON FUNCTION delete_user_profile(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION delete_user_profile(UUID) TO authenticated; 