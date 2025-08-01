-- Créer un utilisateur admin directement
INSERT INTO public.users (id, email, name, role, created_at)
VALUES (
  gen_random_uuid(),
  'admin@amande.fr',
  'Admin Amande',
  'admin',
  NOW()
)
ON CONFLICT (email) DO NOTHING; 