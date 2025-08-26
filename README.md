# 🍰 Amande - L'art de la tartelette

Projet full-stack pour l'application Amande - L'art de la tartelette.

## 📁 Structure du projet

```
bachelor_amande-1/
├── 📂 frontend/           # Application Vue.js
│   ├── 📂 src/
│   │   ├── 📂 components/ # Composants réutilisables
│   │   ├── 📂 views/      # Pages de l'application
│   │   ├── 📂 stores/     # Gestion d'état (Pinia)
│   │   ├── 📂 services/   # Services API
│   │   ├── 📂 assets/     # Ressources statiques
│   │   └── 📂 router/     # Configuration des routes
│   └── 📂 public/         # Fichiers publics
├── 📂 backend/            # API Express + Supabase
│   ├── 📂 src/
│   │   ├── 📂 routes/     # Routes API
│   │   ├── 📂 controllers/# Contrôleurs
│   │   ├── 📂 middleware/ # Middlewares
│   │   ├── 📂 config/     # Configuration
│   │   └── 📂 utils/      # Utilitaires
│   └── 📂 docs/           # Documentation API
├── 📂 docs/               # Documentation générale
├── 📂 scripts/            # Scripts utilitaires
└── 📂 .github/            # Configuration GitHub (CI/CD)
```

## 🚀 Démarrage rapide

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

## 🛠️ Technologies

- **Frontend**: Vue.js 3 + Vite + TypeScript + Tailwind CSS
- **Backend**: Express.js + Supabase + Node.js
- **Base de données**: PostgreSQL (via Supabase)
- **Authentification**: Supabase Auth

## 📋 Fonctionnalités

- 🍰 Catalogue de tartelettes
- 🎨 Composer sa tartelette
- 🛒 Panier d'achat
- 👤 Authentification utilisateur
- 📱 Interface responsive

## 📝 Conventions de nommage

- **Fichiers**: kebab-case (`mon-fichier.vue`)
- **Composants**: PascalCase (`MonComposant.vue`)
- **Variables**: camelCase (`maVariable`)
- **Constantes**: UPPER_SNAKE_CASE (`MA_CONSTANTE`)
- **Dossiers**: kebab-case (`mon-dossier/`)

## 🔧 Scripts utiles

```bash
# Démarrer tout le projet
npm run dev:all

# Lancer les tests
npm run test

# Build de production
npm run build
```

## �️ Gestion du Backend (installation, SQL, Supabase, lancement)

### 1. Installation du backend

```bash
cd backend
npm install
```

### 2. Configuration Supabase

- Crée un projet sur https://supabase.com
- Récupère tes clés API (URL, ANON KEY, SERVICE ROLE KEY)
- Crée un fichier `.env` dans `backend/` :
  ```env
  SUPABASE_URL=...
  SUPABASE_ANON_KEY=...
  SUPABASE_SERVICE_ROLE_KEY=...
  PORT=3001
  FRONTEND_URL=http://localhost:5174
  NODE_ENV=development
  ```

### 3. Initialisation ou nettoyage de la base de données

- Ouvre l’éditeur SQL Supabase
- Copie le contenu du fichier `docs/sql/supabase-init.sql` (script unique)
- Exécute le script pour créer toutes les tables et nettoyer l’ancienne base

### 4. Lancement du backend

```bash
cd backend
npm run dev   # pour le développement
npm start     # pour la production
```

### 5. Vérification

- Accède à `http://localhost:3001/health` pour vérifier que l’API fonctionne
- Le backend est prêt à recevoir les requêtes du frontend

### 6. Conseils

- Un seul script SQL suffit pour tout réinitialiser
- Les anciennes migrations SQL peuvent être supprimées
- Documente bien tes variables d’environnement
