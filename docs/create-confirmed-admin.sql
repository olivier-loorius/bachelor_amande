-- Créer un admin avec email confirmé
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'amande@gmail.com',
  crypt('amande', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"name": "Admin Amande"}'
);

-- Insérer dans public.users
INSERT INTO public.users (id, email, name, role, created_at)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', 'Admin Amande'),
  'admin',
  created_at
FROM auth.users 
WHERE email = 'amande@gmail.com'
ON CONFLICT (id) DO NOTHING; 