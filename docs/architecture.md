# 🏗️ Architecture du projet

## 📋 Vue d'ensemble

Le projet Amande suit une architecture **full-stack moderne** avec séparation claire des responsabilités :

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Supabase      │
│   (Vue.js)      │◄──►│   (Express)     │◄──►│   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Principes d'architecture

### 1. **Séparation des préoccupations**
- **Frontend** : Interface utilisateur et logique métier côté client
- **Backend** : API REST et logique métier côté serveur
- **Base de données** : Stockage et gestion des données

### 2. **Modularité**
- Composants réutilisables
- Services spécialisés
- Middlewares configurables
- Routes organisées par domaine

### 3. **Scalabilité**
- Architecture extensible
- Code maintenable
- Tests automatisés
- Documentation complète

## 📁 Organisation des dossiers

### Structure recommandée

```
bachelor_amande-1/
├── 📂 frontend/                 # Application Vue.js
│   ├── 📂 src/
│   │   ├── 📂 components/      # Composants réutilisables
│   │   │   ├── 📂 auth/        # Composants d'authentification
│   │   │   ├── 📂 cart/        # Composants du panier
│   │   │   ├── 📂 layout/      # Composants de mise en page
│   │   │   └── 📂 ui/          # Composants UI génériques
│   │   ├── 📂 views/           # Pages de l'application
│   │   ├── 📂 stores/          # Gestion d'état (Pinia)
│   │   ├── 📂 services/        # Services API
│   │   ├── 📂 assets/          # Ressources statiques
│   │   └── 📂 router/          # Configuration des routes
│   └── 📂 public/              # Fichiers publics
├── 📂 backend/                  # API Express + Supabase
│   ├── 📂 src/
│   │   ├── 📂 routes/          # Routes API
│   │   ├── 📂 controllers/     # Contrôleurs métier
│   │   ├── 📂 middleware/      # Middlewares
│   │   ├── 📂 config/          # Configuration
│   │   └── 📂 utils/           # Utilitaires
│   └── 📂 docs/                # Documentation API
├── 📂 docs/                    # Documentation générale
├── 📂 scripts/                 # Scripts utilitaires
└── 📂 .github/                 # Configuration GitHub
```

## 🔄 Flux de données

### 1. **Authentification**
```
User → Frontend → Backend → Supabase Auth → JWT Token
```

### 2. **Gestion des produits**
```
Frontend → Backend API → Supabase DB → Response → Frontend
```

### 3. **Gestion du panier**
```
Frontend Store → Backend API → Supabase DB → Frontend Store
```

## 🛠️ Technologies par couche

### **Frontend (Vue.js 3)**
- **Framework** : Vue.js 3 avec Composition API
- **Build Tool** : Vite
- **Language** : TypeScript
- **Styling** : SCSS + Tailwind CSS
- **State Management** : Pinia
- **Routing** : Vue Router
- **HTTP Client** : Axios

### **Backend (Express.js)**
- **Framework** : Express.js
- **Language** : JavaScript/Node.js
- **Database** : Supabase (PostgreSQL)
- **Authentication** : Supabase Auth + JWT
- **Validation** : Joi ou express-validator
- **Documentation** : Swagger/OpenAPI

### **Base de données (Supabase)**
- **Database** : PostgreSQL
- **Authentication** : Supabase Auth
- **Storage** : Supabase Storage
- **Real-time** : Supabase Realtime
- **Edge Functions** : Supabase Edge Functions

## 🔐 Sécurité

### **Frontend**
- Validation côté client
- Sanitisation des inputs
- Protection XSS
- HTTPS obligatoire

### **Backend**
- Validation côté serveur
- Authentification JWT
- Rate limiting
- CORS configuré
- Headers de sécurité

### **Base de données**
- RLS (Row Level Security)
- Chiffrement des données sensibles
- Sauvegarde automatique
- Audit logs

## 📊 Performance

### **Frontend**
- Lazy loading des composants
- Code splitting
- Optimisation des images
- Cache des ressources
- Service Worker (PWA)

### **Backend**
- Compression gzip
- Cache Redis (optionnel)
- Optimisation des requêtes DB
- Pagination des résultats
- Rate limiting

### **Base de données**
- Index optimisés
- Requêtes optimisées
- Connection pooling
- Monitoring des performances

## 🧪 Tests

### **Frontend**
- Tests unitaires (Vitest)
- Tests d'intégration
- Tests E2E (Cypress)
- Tests de composants

### **Backend**
- Tests unitaires (Jest)
- Tests d'intégration
- Tests d'API
- Tests de base de données

## 📚 Documentation

### **Code**
- JSDoc pour les fonctions
- Commentaires explicatifs
- README par dossier
- Conventions de nommage

### **API**
- Swagger/OpenAPI
- Postman Collection
- Exemples de requêtes
- Schémas de validation

### **Architecture**
- Diagrammes d'architecture
- Flux de données
- Guide de déploiement
- Troubleshooting

## 🚀 Déploiement

### **Environnements**
- **Development** : Local
- **Staging** : Vercel/Netlify + Railway
- **Production** : Vercel/Netlify + Railway

### **CI/CD**
- GitHub Actions
- Tests automatiques
- Build automatique
- Déploiement automatique

## 📈 Monitoring

### **Frontend**
- Error tracking (Sentry)
- Performance monitoring
- User analytics
- A/B testing

### **Backend**
- Logs structurés
- Monitoring des performances
- Alertes automatiques
- Métriques métier

## 🔄 Évolution

### **Phase 1** : MVP
- Authentification basique
- Catalogue de produits
- Panier simple
- Interface responsive

### **Phase 2** : Fonctionnalités avancées
- Composition de tartelettes
- Système de commandes
- Notifications
- Paiements

### **Phase 3** : Optimisation
- Performance
- SEO
- PWA
- Analytics avancés 