# 📋 DOCUMENTATION TECHNIQUE - PROJET AMANDE

##  ARCHITECTURE TECHNIQUE
**📁 Fichiers concernés :** 
`package.json`,
`vite.config.ts`,
`tsconfig.json`,
`supabase/config.js`

**  Pourquoi cette architecture ?**
Architecture moderne et maintenable : Vue 3 pour la réactivité, TypeScript pour la sécurité des types, Pinia pour la gestion d'état centralisée, et Supabase pour une base de données robuste sans complexité d'infrastructure.

### **Stack Utilisé**
- **Frontend** : Vue 3 + TypeScript + Pinia + Vue Router
- **Backend** : Node.js + Express + Supabase
- **Base de données** : PostgreSQL (via Supabase)
- **Authentification** : JWT + RLS (Row Level Security)

### **Structure du Projet**
```
frontend/          → Application Vue.js
backend/           → API Express
supabase/          → Migrations et fonctions
docs/              → Documentation
```

---

##  CRUD PRODUITS
**📁 Fichiers concernés :** 
`supabase/migrations/20250101_create_robust_product_schema.sql`, 
`frontend/src/services/productConfigService.ts`, 
`frontend/src/stores/useProductStore.ts`, 
`frontend/src/components/admin/ProductStep.vue`

**  Pourquoi ce système CRUD ?**
Permet aux administrateurs de gérer facilement le catalogue de produits : ajouter/modifier/supprimer des fonds, garnitures et recouvrements avec leurs images, tout en maintenant la cohérence des données et la sécurité d'accès.

### **Structure de la Base**
```sql
products (id, nom, locked, step, created_at)
product_images (id, product_id, url, image_index)
```

### **Opérations CRUD**
1. **CREATE** : `upsertProduct()` → Insertion avec images multiples
2. **READ** : `getAllProducts()` → Récupération par étape
3. **UPDATE** : `updateProduct()` → Modification nom + images
4. **DELETE** : `deleteProduct()` → Suppression + nettoyage images

### **Gestion des Images**
- **Upload** : Glisser-déposer + validation format
- **Stockage** : Supabase Storage + URLs en base
- **Indexation** : Position 0,1,2 pour variantes de fond

---

##  CRUD UTILISATEURS
**📁 Fichiers concernés :** 
`frontend/src/services/authService.ts`, 
`frontend/src/stores/useAuthStore.ts`, 
`frontend/src/components/admin/UsersSection.vue`, 
`backend/src/routes/users.js`

** Pourquoi cette gestion des utilisateurs ?**
Système d'authentification sécurisé qui différencie les administrateurs (gestion complète) des utilisateurs clients (accès au composeur), avec protection des données personnelles et possibilité de désactiver des comptes problématiques.

### **Gestion des Rôles**
- **Admin** : Accès complet + gestion produits
- **User** : Accès composeur + panier

### **Fonctionnalités**
- **Inscription** : Validation email + hashage mot de passe
- **Connexion** : JWT token + session
- **Profil** : Modification nom/email
- **Suppression** : Désactivation (soft delete) via interface admin

### **Sécurité**
- **RLS** : Accès contrôlé par rôle
- **Validation** : Côté client + serveur
- **Sessions** : Gestion automatique Supabase

---

##  GESTION DU PANIER
**📁 Fichiers concernés :** 
`frontend/src/stores/panier.ts`, 
`frontend/src/components/cart/index.ts`, 
`frontend/src/views/panier/Panier.vue`, 
`backend/src/routes/cart.js`

**💡 Pourquoi cette gestion du panier ?**
Permet aux clients de sauvegarder leurs tartelettes personnalisées, de modifier les quantités, et de conserver leur sélection entre les sessions, tout en maintenant la séparation des paniers entre utilisateurs pour la confidentialité.

**🤔 Pourquoi stockage local et pas Supabase ?**
- **Performance** : Pas de requêtes base à chaque modification (ajout/suppression)
- **Réactivité** : Mise à jour instantanée de l'interface sans latence réseau
- **Hors ligne** : Le panier fonctionne même sans connexion internet
- **Coût** : Évite les appels répétés à Supabase (limites de quota)
- **UX** : L'utilisateur voit immédiatement ses modifications
- **Synchronisation** : Le panier est sauvegardé en base uniquement lors de la validation finale

### **Structure du Panier**
```typescript
interface PanierItem {
  id: string
  nom: string
  prix: number
  quantite: number
  composition: string
  user_id: string
}
```

### **Fonctionnalités**
- **Ajout** : Produit personnalisé + quantité
- **Modification** : Changement quantité
- **Suppression** : Retrait d'articles
- **Persistance** : Stockage local + synchronisation

### **Liaison Utilisateur**
- **Authentification** : Vérification avant ajout
- **Séparation** : Panier unique par utilisateur
- **Sauvegarde** : Persistance entre sessions

---

##  SÉCURITÉ ET AUTHENTIFICATION
**📁 Fichiers concernés :** 
`frontend/src/utils/authGuard.ts`, 
`backend/src/server.js`, `supabase/migrations/`, 
`frontend/src/stores/useAuthStore.ts`

**Pourquoi cette sécurité ?**
Protection multi-niveaux : JWT pour l'authentification sans stockage de mots de passe, RLS pour l'isolation automatique des données, et middleware pour contrôler l'accès aux routes sensibles, garantissant la confidentialité et l'intégrité des données.

### **JWT Tokens (JSON Web Tokens)**
**🎯 À quoi ça sert ?**
- **Carte d'identité numérique** : Comme un badge d'entreprise qui vous donne accès aux bonnes zones
- **Session sécurisée** : Garde l'utilisateur connecté sans stocker son mot de passe
- **Contrôle d'accès** : Vérifie que vous êtes bien admin pour accéder au dashboard

**🔧 Comment ça marche ?**
- **Connexion** : L'utilisateur tape son email/mot de passe
- **Vérification** : Supabase vérifie et génère un "ticket" (JWT)
- **Stockage** : Le ticket est sauvegardé dans le navigateur
- **Utilisation** : À chaque requête, le ticket est envoyé pour prouver l'identité
- **Expiration** : Le ticket expire automatiquement (sécurité)

**📱 Exemple concret**
- **Sans JWT** : L'utilisateur devrait retaper son mot de passe à chaque clic
- **Avec JWT** : L'utilisateur reste connecté et navigue librement
- **Sécurité** : Si quelqu'un vole le ticket, il expire automatiquement

**💡 Avantages**
- **Performance** : Pas de vérification en base à chaque requête
- **Sécurité** : Pas de mots de passe stockés côté client
- **Scalabilité** : Fonctionne même avec des milliers d'utilisateurs

### **Row Level Security (RLS)**
**🎯 À quoi ça sert ?**
- **Sécurité au niveau des données** : Chaque utilisateur ne voit que ses propres informations
- **Protection automatique** : Impossible d'accéder aux données d'autres utilisateurs
- **Sécurité par défaut** : Même si on oublie de vérifier dans le code, la base protège

**🔧 Exemple concret**
```sql
-- Politique : "Un utilisateur ne peut voir que ses propres données"
CREATE POLICY "Users can view own data" ON users
FOR SELECT USING (auth.uid() = id);

-- Résultat : 
-- User A connecté → Voit seulement ses données
-- User B connecté → Voit seulement ses données
-- Impossible de croiser les données entre utilisateurs
```

**💡 Pourquoi c'est important ?**
- **Sans RLS** : Un bug dans le code pourrait exposer toutes les données
- **Avec RLS** : Même avec un bug, la base protège automatiquement
- **Conformité** : Respect du RGPD et des bonnes pratiques de sécurité

### **Exemple JWT Concret**
```json
// Header (encodé en base64)
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload (encodé en base64)
{
  "sub": "user_123",
  "email": "user@amande.com",
  "role": "admin",
  "iat": 1640995200,
  "exp": 1641081600
}

// Signature
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

### **Protection des Routes**
- **Admin** : Middleware `requireAuth` + vérification rôle
- **User** : Vérification token + permissions

---

## 📱 INTERFACES UTILISATEUR
**📁 Fichiers concernés :** 
`frontend/src/views/admin/AdminHome.vue`, 
`frontend/src/components/admin/`, 
`frontend/src/views/composer/ComposerView.vue`, 
`frontend/src/components/composer/`

**💡 Pourquoi ces interfaces ?**
Interface admin intuitive pour gérer le catalogue et les utilisateurs, et composeur client guidé en 5 étapes pour créer des tartelettes personnalisées, offrant une expérience utilisateur fluide et professionnelle.

### **Admin Dashboard**
- **Gestion Produits** : CRUD complet + upload images
- **Gestion Users** : Liste + actions (désactiver)
- **Statistiques** : Compteurs + progression

### **Composeur Client**
- **5 Étapes** : Fond → G1 → G2 → G3 → Récapitulatif
- **Validation** : Impossible de continuer sans sélection
- **Prévisualisation** : Images en temps réel

---

## 🚀 DÉPLOIEMENT ET MAINTENANCE
**📁 Fichiers concernés :** 
`package.json`, 
`scripts/dev-all.js`, 
`vite.config.ts`, 
`.env`

**💡 Pourquoi ces outils ?**
Scripts automatisés pour le développement et la production, configuration Vite pour l'optimisation des builds, et gestion centralisée des variables d'environnement pour faciliter le déploiement et la maintenance du projet.

### **Scripts Disponibles**
```bash
npm run dev          # Développement
npm run build        # Production
npm run lint         # Qualité code
npm run test         # Tests
```

### **Variables d'Environnement**
```env
SUPABASE_URL=xxx
SUPABASE_ANON_KEY=xxx
JWT_SECRET=xxx
```

---

## ❓ QUESTIONS FRÉQUENTES DU JURY

### **Q: Pourquoi Vue 3 + TypeScript ?**
**R:** Vue 3 Composition API + sécurité des types + maintenance facilitée

### **Q: Pourquoi Supabase ?**
**R:** Alternative open-source à Firebase + PostgreSQL natif + authentification intégrée

### **Q: Comment gérez-vous la sécurité ?**
**R:** RLS + JWT + validation côté serveur + middleware d'authentification

### **Q: Quelle est la performance ?**
**R:** Lazy loading + mise en cache + code splitting + images optimisées

### **Q: Comment testez-vous ?**
**R:** Tests unitaires + ESLint + validation TypeScript + tests manuels

### **Q: Évolutivité du projet ?**
**R:** Architecture modulaire + base relationnelle + API RESTful + composants réutilisables

---

## 🔧 POINTS TECHNIQUES CLÉS
**📁 Fichiers concernés :** 
`frontend/src/stores/`, 
`frontend/src/router/`, 
`frontend/src/services/`, 
`frontend/src/components/`

**💡 Pourquoi ces composants ?**
Architecture modulaire avec stores Pinia pour la gestion d'état centralisée, router Vue pour la navigation sécurisée, services pour la logique métier, et composants réutilisables pour maintenir un code propre et maintenable.

### **Gestion d'État (Pinia)**
- **Stores** : Produits, Authentification, Panier
- **Réactivité** : Mise à jour automatique des composants
- **Persistance** : Synchronisation avec Supabase

### **Routing (Vue Router)**
- **Guards** : Protection des routes admin
- **Lazy Loading** : Chargement à la demande
- **Navigation** : Breadcrumbs + historique

### **Validation des Données**
- **Frontend** : VeeValidate + règles personnalisées
- **Backend** : Middleware + contraintes base
- **Base** : Contraintes SQL + triggers

---

## 📊 MÉTRIQUES ET MONITORING
**📁 Fichiers concernés :** 
`vite.config.ts`, 
`tailwind.config.js`, 
`frontend/src/assets/styles/`, 
`package.json`

**💡 Pourquoi ce monitoring ?**
Suivi des performances avec temps de chargement optimisé, compression des assets pour réduire la bande passante, et monitoring des erreurs pour maintenir une expérience utilisateur fluide et professionnelle.

### **Performance**
- **Temps de chargement** : < 2s sur 3G
- **Bundle size** : < 500KB gzippé
- **Images** : Compression automatique + formats WebP

### **Logs et Debugging**
- **Console** : Logs structurés + niveaux
- **Erreurs** : Capture + reporting
- **Monitoring** : Temps de réponse + erreurs

---

## 🔮 ÉVOLUTIONS FUTURES
**📁 Fichiers concernés :** 
`package.json`, 
`vite.config.ts`, 
`eslint.config.ts`, 
`vitest.config.ts`

**💡 Pourquoi ces évolutions ?**
Roadmap technique progressive : tests automatisés pour la qualité, PWA pour l'expérience mobile, et architecture microservices pour la scalabilité, permettant au projet de grandir avec les besoins de l'entreprise.

### **Court terme**
- Tests automatisés complets
- CI/CD pipeline
- Monitoring avancé

### **Moyen terme**
- PWA (Progressive Web App)
- API publique
- Analytics utilisateurs

### **Long terme**
- Microservices
- Cache Redis
- Load balancing

---

*Documentation technique concise - Projet Amande 2025*

