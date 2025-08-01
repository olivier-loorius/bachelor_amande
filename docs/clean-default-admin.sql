-- Supprimer l'admin par défaut
DELETE FROM public.admins;

-- Vérifier que les tables sont vides
SELECT * FROM public.admins;
SELECT * FROM public.users; 