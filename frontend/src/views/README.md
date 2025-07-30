# Organisation des Vues

Cette structure organise les vues par domaine fonctionnel pour une meilleure maintenabilité et une navigation plus intuitive.

## Structure par Domaine

### 📦 `catalogue/`
Vues liées au catalogue et à la page d'accueil
- `HomeView.vue` - Page d'accueil avec présentation des produits
- `CatalogueView.vue` - Catalogue complet des tartelettes

### 🎨 `composer/`
Vues pour la personnalisation des desserts
- `ComposerView.vue` - Interface de composition personnalisée

### 🛒 `panier/`
Vues liées au panier d'achat
- `Panier.vue` - Gestion du panier et commande

### 🔐 `auth/`
Vues d'authentification et gestion des comptes
- `LoginView.vue` - Connexion utilisateur

### ℹ️ `info/`
Vues d'information et pages légales
- `ActualiteView.vue` - Actualités et blog
- `ContactView.vue` - Page de contact
- `CGVView.vue` - Conditions générales de vente
- `MentionsLegales.vue` - Mentions légales

### 🛠️ `utils/`
Vues utilitaires et pages d'erreur
- `ErrorView.vue` - Page d'erreur 404
- `ConstructionView.vue` - Page en construction

### 📁 Fichiers à la racine
- `EnConstructionView.vue` - Page générique pour sections en construction

## Avantages de cette Organisation

✅ **Séparation claire des responsabilités**
✅ **Navigation intuitive dans le code**
✅ **Facilite la maintenance**
✅ **Évolutivité pour de nouvelles fonctionnalités**
✅ **Structure scolaire et professionnelle**

## Conventions de Nommage

- **Dossiers** : nom en minuscules, descriptif du domaine
- **Fichiers** : PascalCase pour les composants Vue
- **Routes** : kebab-case pour les URLs

## Ajout de Nouvelles Vues

Pour ajouter une nouvelle vue :
1. Identifier le domaine approprié
2. Créer le fichier dans le bon dossier
3. Mettre à jour `router/index.ts` avec le bon import
4. Ajouter la route correspondante

Cette organisation facilite la croissance du projet tout en maintenant une structure claire et professionnelle ! 🎯 