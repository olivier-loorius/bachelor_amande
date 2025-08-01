# 🎯 Guide : Accès Admin - Résolution Complète

## 🚨 **Problème Identifié**
Votre compte admin existe dans `auth.users` (Supabase Auth) mais pas dans `public.users` (votre table personnalisée).

## ✅ **Solution Étape par Étape**

### **Étape 1 : Récupérer l'ID de votre compte admin**

1. **Allez dans Supabase Dashboard**
   - Connectez-vous à https://supabase.com
   - Sélectionnez votre projet

2. **Exécutez ce script dans l'éditeur SQL :**
```sql
SELECT 
    id,
    email,
    created_at
FROM auth.users 
WHERE email = 'amande@gmail.com';  -- Remplacez par votre email
```

3. **Copiez l'UUID retourné** (exemple : `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### **Étape 2 : Créer le profil admin dans public.users**

1. **Exécutez ce script en remplaçant les valeurs :**
```sql
INSERT INTO public.users (id, email, name, role, created_at)
VALUES (
    'VOTRE_UUID_ADMIN',  -- Remplacez par l'ID copié
    'amande@gmail.com',   -- Votre email
    'Admin Amande',       -- Votre nom
    'admin',
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    updated_at = NOW();
```

### **Étape 3 : Configurer les policies RLS**

1. **Exécutez ce script pour les permissions admin :**
```sql
-- Activer RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy pour que les admins puissent lire tous les profils
DROP POLICY IF EXISTS "Allow admins to select all users" ON public.users;
CREATE POLICY "Allow admins to select all users"
ON public.users
FOR SELECT
USING (
    auth.uid() = id OR 
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Policy pour que les admins puissent modifier les profils
DROP POLICY IF EXISTS "Allow admins to modify users" ON public.users;
CREATE POLICY "Allow admins to modify users"
ON public.users
FOR UPDATE
USING (
    auth.uid() = id OR 
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Policy pour permettre l'insertion
DROP POLICY IF EXISTS "Allow users to insert own data" ON public.users;
CREATE POLICY "Allow users to insert own data"
ON public.users
FOR INSERT
WITH CHECK (auth.uid() = id);
```

### **Étape 4 : Vérifier que tout fonctionne**

1. **Exécutez ce script pour vérifier :**
```sql
SELECT * FROM public.users WHERE role = 'admin';
```

2. **Vous devriez voir votre profil admin dans la liste**

### **Étape 5 : Tester dans votre application**

1. **Redémarrez votre application frontend :**
```bash
cd frontend
npm run dev
```

2. **Connectez-vous avec votre compte admin**

3. **Vérifiez dans la console du navigateur** que vous voyez :
   - `🔍 getUserInfos - userId: [votre-uuid]`
   - `✅ getUserInfos - data: {id: ..., email: ..., role: 'admin', ...}`

4. **Le CTA "Admin" devrait apparaître dans la navbar**

5. **Cliquez sur "Admin" pour accéder au dashboard**

## 🔧 **Script Complet (Alternative)**

Si vous préférez tout faire en une fois, utilisez le fichier `docs/fix-admin-access-complete.sql` qui contient tout le script.

## 🐛 **Dépannage**

### **Problème : "User not found"**
- Vérifiez que l'UUID est correct
- Vérifiez que l'email correspond

### **Problème : "Permission denied"**
- Vérifiez que les policies RLS sont bien créées
- Vérifiez que votre compte a bien le rôle 'admin'

### **Problème : CTA Admin ne s'affiche pas**
- Vérifiez dans la console que `role === 'admin'`
- Vérifiez que `isAdmin` est bien `true` dans le store

## 📞 **Aide**

Si vous avez des erreurs, partagez :
1. Le message d'erreur exact
2. Le résultat de `SELECT * FROM public.users WHERE role = 'admin';`
3. Les logs de la console du navigateur 