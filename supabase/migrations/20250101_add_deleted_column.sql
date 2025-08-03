-- Ajouter les colonnes deleted et deleted_at à la table users
ALTER TABLE public.users 
ADD COLUMN deleted BOOLEAN DEFAULT FALSE;

ALTER TABLE public.users 
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

-- Ajouter un index pour optimiser les requêtes
CREATE INDEX idx_users_deleted ON public.users(deleted);

-- Ajouter un index pour les requêtes de recherche par email supprimé
CREATE INDEX idx_users_email_deleted ON public.users(email, deleted);

-- Politique RLS pour empêcher l'accès aux comptes supprimés
-- (optionnel, pour la demo on peut le faire côté application)
CREATE POLICY "Prevent access to deleted accounts" ON public.users
FOR ALL TO authenticated
USING (deleted = false OR deleted IS NULL); 