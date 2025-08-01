# 🏗️ Système de Gestion d'Utilisateurs - Amande

## 📋 **Besoins et Objectifs**

### **Objectif Principal**
Créer un système de gestion d'utilisateurs "scolaire et simple" pour l'application "Amande - L'art de la tartelette" avec :
- **Premier compte créé** = Admin automatiquement
- **Comptes suivants** = Utilisateurs normaux
- **Dashboard admin** affichant tous les utilisateurs en temps réel
- **Aucune donnée en dur** dans le frontend
- **Base de données propre** dans Supabase

### **Fonctionnalités Requises**
1. ✅ Inscription utilisateur via formulaire frontend
2. ✅ Attribution automatique du rôle (admin/user)
3. ✅ Connexion admin et utilisateur
4. ✅ Affichage CTA admin dans la navbar
5. ✅ Dashboard admin avec liste des utilisateurs
6. ✅ Stockage en base de données Supabase
7. ✅ Pas d'email de confirmation (système direct)

---

## 🗄️ **Architecture Base de Données**

### **Tables Supabase**

#### **Table `public.admins`**
```sql
CREATE TABLE public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Table `public.users`**
```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Table `public.compositions`**
```sql
CREATE TABLE public.compositions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  name TEXT NOT NULL,
  fond TEXT NOT NULL,
  garniture1 TEXT,
  garniture2 TEXT,
  garniture3 TEXT,
  finition TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Configuration RLS**
```sql
-- Désactiver RLS pour toutes les tables
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.compositions DISABLE ROW LEVEL SECURITY;
```

---

## 🎯 **Logique Métier**

### **1. Inscription Utilisateur**
```typescript
// Vérifier si c'est le premier utilisateur
const isFirstUser = (!existingUsers || existingUsers.length === 0) && 
                   (!existingAdmins || existingAdmins.length === 0)

if (isFirstUser) {
  // Premier utilisateur = Admin
  INSERT INTO public.admins (email, password, name)
} else {
  // Autres utilisateurs = User
  INSERT INTO public.users (email, name, password)
}
```

### **2. Connexion Utilisateur**
```typescript
// 1. Vérifier dans la table admins
SELECT * FROM public.admins WHERE email = ? AND password = ?

// 2. Si pas admin, vérifier dans users
SELECT * FROM public.users WHERE email = ? AND password = ?
```

### **3. Dashboard Admin**
```typescript
// Récupérer tous les utilisateurs
const { data: users } = await supabase
  .from('users')
  .select('*')
  .order('created_at', { ascending: false })
```

---

## 📁 **Structure des Fichiers**

### **Frontend (Vue.js 3 + TypeScript)**

#### **Store d'Authentification**
- **Fichier** : `frontend/src/stores/auth.ts`
- **Responsabilité** : Gestion de l'état d'authentification
- **Fonctions** :
  - `login()` : Connexion admin/user
  - `register()` : Inscription avec attribution de rôle
  - `logout()` : Déconnexion
  - `isLoggedIn`, `isAuthenticated`, `currentUser` : Computed properties

#### **Service Supabase**
- **Fichier** : `frontend/src/services/supabaseService.ts`
- **Responsabilité** : Interface avec Supabase
- **Fonctions** :
  - `userService.getAllUsers()` : Récupérer tous les utilisateurs
  - `userService.getAllAdmins()` : Récupérer tous les admins
  - `compositionsService.*` : Gestion des compositions

#### **Composants d'Interface**
- **Fichier** : `frontend/src/components/auth/LoginPanel.vue`
- **Responsabilité** : Formulaire de connexion/inscription
- **Fonctionnalités** :
  - Formulaire de connexion
  - Formulaire d'inscription
  - Gestion des erreurs
  - Messages de succès

#### **Dashboard Admin**
- **Fichier** : `frontend/src/views/admin/AdminView.vue`
- **Responsabilité** : Interface d'administration
- **Fonctionnalités** :
  - Liste des utilisateurs en temps réel
  - Bouton de rafraîchissement
  - Affichage des données utilisateur

#### **Navigation**
- **Fichier** : `frontend/src/components/layout/Navbar.vue`
- **Responsabilité** : Barre de navigation
- **Fonctionnalités** :
  - Affichage CTA admin si connecté en tant qu'admin
  - Menu utilisateur
  - Bouton de déconnexion

### **Backend (Express.js)**

#### **Configuration**
- **Fichier** : `backend/src/config/supabase.js`
- **Responsabilité** : Configuration Supabase pour le backend

#### **Routes**
- **Fichier** : `backend/src/routes/users.js`
- **Responsabilité** : API REST pour la gestion des utilisateurs

---

## 🔧 **Configuration Environnement**

### **Variables d'Environnement Frontend**
```env
# frontend/.env
VITE_SUPABASE_URL=https://dofpvppwvaladogvgozi.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Variables d'Environnement Backend**
```env
# backend/.env
SUPABASE_URL=https://dofpvppwvaladogvgozi.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🚀 **Flux d'Utilisation**

### **1. Première Utilisation**
1. L'utilisateur accède au site
2. Clique sur "Se connecter" dans la navbar
3. Clique sur "Créer un compte"
4. Remplit le formulaire (nom, email, mot de passe)
5. **Le premier compte est automatiquement créé comme admin**
6. L'utilisateur est connecté et voit le CTA admin

### **2. Connexion Admin**
1. L'admin clique sur "Se connecter"
2. Saisit ses identifiants (email, mot de passe)
3. Le système vérifie dans `public.admins`
4. Si trouvé, l'admin est connecté
5. Le CTA admin apparaît dans la navbar

### **3. Dashboard Admin**
1. L'admin clique sur le CTA admin
2. Accède au dashboard `/admin`
3. Voir la liste de tous les utilisateurs
4. Possibilité de rafraîchir les données

### **4. Création d'Utilisateurs Normaux**
1. Nouveaux utilisateurs s'inscrivent via le formulaire
2. Le système vérifie s'il y a déjà des utilisateurs
3. Si oui, le nouveau compte est créé dans `public.users`
4. Le compte a le rôle 'user'

---

## 🛠️ **Méthodes et Technologies**

### **Frontend**
- **Framework** : Vue.js 3 avec Composition API
- **State Management** : Pinia
- **Routing** : Vue Router
- **Styling** : Tailwind CSS + SCSS
- **Build Tool** : Vite
- **Language** : TypeScript

### **Backend**
- **Framework** : Express.js
- **Database** : Supabase (PostgreSQL)
- **Authentication** : Custom (pas Supabase Auth)
- **API** : REST

### **Base de Données**
- **Provider** : Supabase
- **Database** : PostgreSQL
- **RLS** : Désactivé pour simplifier
- **Tables** : `admins`, `users`, `compositions`

---

## 🔍 **Points Clés du Système**

### **1. Simplicité**
- Pas d'email de confirmation
- Pas de Supabase Auth complexe
- Tables personnalisées simples
- Logique directe

### **2. Sécurité**
- Mots de passe en clair (pour la démo)
- RLS désactivé (pour la simplicité)
- Authentification basique

### **3. Scalabilité**
- Structure extensible
- Séparation admin/user
- API REST standard

### **4. Maintenance**
- Code TypeScript typé
- Structure modulaire
- Documentation complète

---

## 📊 **État Actuel**

### **✅ Fonctionnel**
- [x] Inscription utilisateur
- [x] Attribution automatique des rôles
- [x] Connexion admin/user
- [x] Dashboard admin
- [x] Affichage CTA admin
- [x] Stockage en base de données

### **🔄 En Cours**
- [ ] Tests complets
- [ ] Gestion des erreurs avancée
- [ ] Validation des données

### **📝 À Améliorer**
- [ ] Hashage des mots de passe
- [ ] RLS activé avec politiques
- [ ] Gestion des sessions
- [ ] Logs d'audit

---

## 🎯 **Utilisation pour Démo Jury**

### **Scénario de Démonstration**
1. **Création du premier compte** → Devient admin automatiquement
2. **Connexion admin** → Accès au dashboard
3. **Création d'utilisateurs** → Visibles en temps réel
4. **Fonctionnalités avancées** → Compositions, panier, etc.

### **Points à Montrer**
- ✅ Système d'authentification fonctionnel
- ✅ Gestion des rôles automatique
- ✅ Dashboard admin avec données temps réel
- ✅ Interface utilisateur moderne
- ✅ Architecture full-stack propre

---

*Document créé le : $(date)*
*Version : 1.0*
*Statut : Fonctionnel* 