# 📚 Documentation du Projet Amande Pâtisserie

## 🗂️ Structure de la Documentation

Ce dossier contient la documentation technique essentielle du projet, organisée de manière claire et concise.

## 🗄️ Fichiers SQL (dossier `sql/`)

### **Migration et Setup Supabase**
- **`sql/supabase-migration.sql`** - Script de migration complet vers Supabase (11KB)
- **`sql/supabase-migration-simple.sql`** - Version simplifiée de la migration (9.4KB)
- **`supabase-setup.md`** - Guide de configuration Supabase (5.1KB)

### **Gestion des Utilisateurs**
- **`sql/create-users-table.sql`** - Création de la table utilisateurs (1.3KB)
- **`sql/supabase-users-table.sql`** - Structure utilisateurs pour Supabase (1.7KB)
- **`systeme-gestion-utilisateurs.md`** - Documentation complète du système utilisateurs (8.6KB)

### **Authentification et Sécurité**
- **`guide-supabase-auth-complet.md`** - Guide complet de l'authentification Supabase (12KB)

## 📋 Documentation Technique

### **Scripts SQL**
- **`SCRIPTS-SQL.md`** - Documentation technique détaillée de tous les scripts SQL (3.6KB)

## 🎯 Utilisation

### **Pour les Développeurs**
1. Commencer par `supabase-setup.md` pour la configuration
2. Consulter `SCRIPTS-SQL.md` pour comprendre les scripts disponibles
3. Utiliser les scripts SQL depuis le dossier `sql/`

### **Pour les Administrateurs**
1. Lire `systeme-gestion-utilisateurs.md`
2. Suivre `guide-supabase-auth-complet.md`
3. Consulter `supabase-setup.md` pour la configuration

### **Pour la Maintenance**
1. `SCRIPTS-SQL.md` pour la documentation des scripts
2. Scripts SQL dans `sql/` pour les corrections de base de données
3. Documentation technique pour le débogage

## 📊 Statistiques
- **Total fichiers** : 10
- **Documentation** : 2 fichiers Markdown
- **Scripts SQL** : 4 fichiers (dans `sql/`)
- **Taille totale** : ~50KB

## 🔄 Mise à Jour
Cette documentation est maintenue à jour avec chaque modification du projet.
Les scripts SQL sont testés et validés avant d'être inclus.

## 🧹 Nettoyage Effectué
- Supprimé 8 fichiers Markdown obsolètes et redondants
- Conservé seulement la documentation essentielle
- Structure simplifiée et plus maintenable
- **Backend nettoyé** : Supprimé tous les commentaires et dossiers vides
- **SQL organisé** : Tous les scripts SQL dans le dossier `sql/`
