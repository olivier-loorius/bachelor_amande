# 🧹 Guide de Nettoyage Supabase

## Pourquoi nettoyer ?
- Supprimer toutes les tables inutiles
- Ne garder que la table `users` essentielle
- Simplifier la base de données
- Éviter la confusion

## Étapes de nettoyage

### 1. Sauvegarder (optionnel)
Si vous voulez sauvegarder des données importantes :
1. Allez dans **Table Editor**
2. Notez les tables qui contiennent des données importantes
3. Exportez-les si nécessaire

### 2. Exécuter le script de nettoyage
1. Allez dans **SQL Editor** dans Supabase
2. Copiez le contenu de `docs/supabase-cleanup.sql`
3. Collez dans l'éditeur SQL
4. Cliquez sur **Run**

### 3. Vérifier le résultat
1. Allez dans **Table Editor**
2. Vous devriez voir **seulement** la table `users`
3. Vérifiez que la table `users` a les bonnes colonnes :
   - `id` (UUID, Primary Key)
   - `email` (TEXT)
   - `name` (TEXT)
   - `role` (TEXT, 'user' ou 'admin')
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

### 4. Tester l'application
1. Redémarrez votre application : `npm run dev`
2. Testez la création d'un compte
3. Vérifiez que l'utilisateur apparaît dans la table `users`

## Tables supprimées
Le script supprime ces tables (et d'autres) :
- `compositions`
- `paniers`
- `produits`
- `commandes`
- `categories`
- `actualites`
- `contacts`
- `favoris`
- `reviews`
- `promotions`
- `stock`
- `fournisseurs`
- `ingredients`
- `recettes`

## Résultat attendu
✅ **Seule la table `users` reste**
✅ **Gestion d'utilisateurs simple**
✅ **Base de données propre**
✅ **Application fonctionnelle**

## En cas de problème
Si quelque chose ne fonctionne plus :
1. Vérifiez que la table `users` existe
2. Vérifiez les politiques RLS
3. Redémarrez l'application
4. Testez la création d'un compte 