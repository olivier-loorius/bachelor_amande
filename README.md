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

## 📚 Documentation

- [Guide Frontend](./docs/frontend.md)
- [Guide Backend](./docs/backend.md)
- [API Documentation](./docs/api.md)
- [Architecture](./docs/architecture.md)