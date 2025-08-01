# Résumé Système - Amande

## Besoins
- Premier compte créé = Admin automatiquement
- Comptes suivants = Utilisateurs normaux  
- Dashboard admin avec liste des utilisateurs en temps réel
- Pas de données en dur dans le frontend
- Base de données propre dans Supabase

## Codes Utilisés

### Frontend
- **Vue.js 3** + TypeScript + Vite
- **Pinia** pour state management
- **Tailwind CSS** + SCSS pour le style
- **Vue Router** pour la navigation

### Backend  
- **Express.js** + Node.js
- **Supabase** comme base de données PostgreSQL

## Méthodes

### Authentification
- Tables personnalisées `admins` et `users` dans Supabase
- Pas d'email de confirmation (système direct)
- Vérification dans les tables lors de la connexion

### Logique Métier
```typescript
// Premier utilisateur = Admin
if (isFirstUser) {
  INSERT INTO public.admins (email, password, name)
} else {
  INSERT INTO public.users (email, name, password)  
}
```

## Chemins des Fichiers

### Frontend
- `frontend/src/stores/auth.ts` - Gestion authentification
- `frontend/src/services/supabaseService.ts` - Interface Supabase
- `frontend/src/components/auth/LoginPanel.vue` - Formulaire connexion/inscription
- `frontend/src/views/admin/AdminView.vue` - Dashboard admin
- `frontend/src/components/layout/Navbar.vue` - Navigation avec CTA admin

### Backend
- `backend/src/config/supabase.js` - Configuration Supabase
- `backend/src/routes/users.js` - API REST utilisateurs

### Base de Données
- Tables : `public.admins`, `public.users`, `public.compositions`
- RLS désactivé pour simplifier
- Clé anon pour l'authentification frontend 