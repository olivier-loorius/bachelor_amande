# Configuration Simple Supabase

## 1. Accéder à Supabase
- Allez sur https://supabase.com
- Connectez-vous à votre projet

## 2. Créer la table users
1. Dans votre dashboard Supabase, allez dans **SQL Editor**
2. Copiez et collez le contenu du fichier `supabase-users-table.sql`
3. Cliquez sur **Run** pour exécuter le script

## 3. Vérifier la configuration
1. Allez dans **Table Editor**
2. Vous devriez voir la table `users` créée
3. Vérifiez que les colonnes sont : `id`, `email`, `name`, `role`, `created_at`, `updated_at`

## 4. Tester la création d'utilisateur
1. Allez dans **Authentication > Users**
2. Créez un utilisateur de test
3. Vérifiez que l'utilisateur apparaît dans la table `users`

## 5. Configuration des variables d'environnement
Assurez-vous que votre fichier `.env` contient :
```
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_anon_supabase
```

## 6. Test de l'application
1. Démarrez votre application : `npm run dev`
2. Testez la création d'un compte
3. Testez la connexion
4. Vérifiez que l'utilisateur apparaît dans Supabase

## Problèmes courants
- **Erreur RLS** : Vérifiez que les politiques sont bien créées
- **Erreur de connexion** : Vérifiez vos variables d'environnement
- **Utilisateur non créé** : Vérifiez que la fonction `createUserInDatabase` est appelée 