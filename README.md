# Amande - L'art de la tartelette

Projet full-stack pour l'application Amande - L'art de la tartelette.

## Structure du projet

```
bachelor_amande-1/
├── frontend/           # Application Vue.js
│   ├── src/
│   │   ├── components/ # Composants réutilisables
│   │   ├── views/      # Pages de l'application
│   │   ├── stores/     # Gestion d'état (Pinia)
│   │   ├── services/   # Services API
│   │   ├── assets/     # Ressources statiques
│   │   └── router/     # Configuration des routes
│   └── public/         # Fichiers publics
├── backend/            # API Express + Supabase
│   ├── src/
│   │   ├── routes/     # Routes API
│   │   ├── controllers/# Contrôleurs
│   │   ├── middleware/ # Middlewares
│   │   ├── config/     # Configuration
│   │   └── utils/      # Utilitaires
│   └── docs/           # Documentation API
├── docs/               # Documentation générale
├── scripts/            # Scripts utilitaires
└── supabase/           # Migrations et fonctions Supabase
```

## Démarrage rapide

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Démarrage complet

```bash
# Script pour démarrer frontend + backend
npm run dev:all
```

## Technologies

- **Frontend**: Vue.js 3 + Vite + TypeScript + Tailwind CSS + Pinia
- **Backend**: Express.js + Supabase + Node.js
- **Base de données**: PostgreSQL (via Supabase)
- **Authentification**: JWT + RLS (Row Level Security)

## Fonctionnalités principales

### Client
- Catalogue de tartelettes (Fonds, Garnitures, Recouvrements)
- Composeur de tartelette en 5 étapes
- Panier d'achat personnalisé
- Authentification et gestion de profil

### Administration
- Gestion du catalogue de produits
- Upload et gestion des images
- Gestion des utilisateurs
- Statistiques et monitoring

## Architecture technique

### CRUD Produits
- Structure : 4 types de produits avec quotas définis
- Images multiples par produit
- Système de verrouillage et déverrouillage
- Gestion des étapes (Fond, G1, G2, G3)

### CRUD Utilisateurs
- Rôles Admin/User avec permissions
- Authentification JWT sécurisée
- Soft delete pour la désactivation
- Protection RLS des données

### Gestion du Panier
- Stockage local pour la performance
- Synchronisation avec Supabase
- Panier unique par utilisateur
- Persistance entre sessions

## Sécurité

- **JWT Tokens** : Authentification sans stockage de mots de passe
- **RLS** : Isolation automatique des données par utilisateur
- **Middleware** : Protection des routes sensibles
- **Validation** : Côté client et serveur

## Scripts utiles

```bash
# Développement
npm run dev          # Frontend uniquement
npm run dev:all      # Frontend + Backend

# Production
npm run build        # Build frontend
npm run lint         # Vérification code
npm run test         # Tests unitaires
```

## Configuration

### Variables d'environnement

Créer un fichier `.env` dans le dossier `backend/` :

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
```

### Base de données

Les migrations Supabase se trouvent dans `supabase/migrations/` :
- Schéma des produits et images
- Politiques RLS
- Fonctions de base

## Documentation

- `docs/DOCUMENTATION_TECHNIQUE.md` : Documentation technique complète
- `docs/PRESENTATION_JURY.md` : Présentation pour le jury
- `docs/GUIDE_DEMONSTRATION.md` : Guide de démonstration

## Conventions de nommage

- **Fichiers**: kebab-case (`mon-fichier.vue`)
- **Composants**: PascalCase (`MonComposant.vue`)
- **Variables**: camelCase (`maVariable`)
- **Constantes**: UPPER_SNAKE_CASE (`MA_CONSTANTE`)
- **Dossiers**: kebab-case (`mon-dossier/`)

## Déploiement

1. Build du frontend : `npm run build`
2. Configuration des variables d'environnement
3. Déploiement du backend sur votre serveur
4. Configuration de Supabase en production

## Support

Pour toute question technique, consulter la documentation dans le dossier `docs/`.
