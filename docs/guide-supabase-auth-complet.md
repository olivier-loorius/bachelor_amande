# 🚀 Guide Complet - Supabase Auth + Table Users

## 📋 **Étapes à suivre (dans l'ordre)**

### 🟢 **1. Créer un compte utilisateur dans Supabase**

**Option recommandée : Supabase Auth + table users**

- **Supabase Auth** gère : `email`, `password` → dans `auth.users`
- **Table `public.users`** contient : `name`, `role`, etc.

#### **🧱 Dans Supabase : Créer le trigger**

```sql
-- Fonction pour gérer les nouveaux utilisateurs
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Vérifier s'il y a déjà des utilisateurs pour attribuer le rôle
  DECLARE
    user_count INTEGER;
  BEGIN
    SELECT COUNT(*) INTO user_count FROM public.users;
    
    -- Insérer dans public.users avec le bon rôle
    INSERT INTO public.users (id, email, name, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', 'Utilisateur'),
      CASE WHEN user_count = 0 THEN 'admin' ELSE 'user' END
    );
    
    RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sur auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 🟢 **2. Service d'authentification**

```typescript
// src/services/authService.ts
import { supabase } from './supabaseService'

export async function registerUser({ email, password, name }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name
      }
    }
  });

  if (error) throw error;

  return data.user;
}

export async function loginUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data.user;
}

export async function getUserInfos(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
```

### 🟢 **3. Store d'authentification mis à jour**

```typescript
// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/services/supabaseService'
import { registerUser, loginUser, getUserInfos, logoutUser } from '@/services/authService'

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  created_at: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)

  const isLoggedIn = computed(() => !!user.value)
  const isAuthenticated = computed(() => !!user.value)
  const currentUser = computed(() => user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Inscription
  const register = async (nom: string, email: string, password: string) => {
    isLoading.value = true
    
    try {
      const authUser = await registerUser({ email, password, name: nom })
      
      // Le trigger créera automatiquement l'utilisateur dans public.users
      // On récupère les infos utilisateur
      const userInfos = await getUserInfos(authUser.id)
      
      user.value = {
        id: userInfos.id,
        email: userInfos.email,
        name: userInfos.name,
        role: userInfos.role,
        created_at: userInfos.created_at
      }
      
      return { 
        success: true, 
        message: userInfos.role === 'admin' ? 'Compte admin créé avec succès' : 'Compte créé avec succès' 
      }
    } catch (error) {
      console.error('Erreur register:', error)
      return { success: false, message: error.message }
    } finally {
      isLoading.value = false
    }
  }

  // Connexion
  const login = async (credentials: { email: string; password: string }) => {
    isLoading.value = true
    
    try {
      const authUser = await loginUser(credentials)
      const userInfos = await getUserInfos(authUser.id)
      
      user.value = {
        id: userInfos.id,
        email: userInfos.email,
        name: userInfos.name,
        role: userInfos.role,
        created_at: userInfos.created_at
      }
      
      return { 
        success: true, 
        message: userInfos.role === 'admin' ? 'Connexion admin réussie' : 'Connexion réussie' 
      }
    } catch (error) {
      return { success: false, message: error.message }
    } finally {
      isLoading.value = false
    }
  }

  // Déconnexion
  const logout = async (router?: any) => {
    try {
      await logoutUser()
      user.value = null
      if (router) {
        router.push('/')
      }
    } catch (error) {
      console.error('Erreur logout:', error)
    }
  }

  // Initialiser la session
  const initialize = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const userInfos = await getUserInfos(session.user.id)
        user.value = {
          id: userInfos.id,
          email: userInfos.email,
          name: userInfos.name,
          role: userInfos.role,
          created_at: userInfos.created_at
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error)
    }
  }

  // Initialiser au démarrage
  initialize()

  return {
    user,
    isLoading,
    isLoggedIn,
    isAuthenticated,
    currentUser,
    isAdmin,
    login,
    register,
    logout
  }
})
```

### 🟢 **4. Dashboard Admin**

```vue
<!-- src/views/admin/AdminView.vue -->
<script setup lang="ts">
import { supabase } from '@/services/supabaseService'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const users = ref([])
const isLoading = ref(true)
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  // Vérifier si l'utilisateur est admin
  if (!authStore.isAdmin) {
    router.push('/')
    return
  }

  await loadUsers()

  // Temps réel (optionnel)
  supabase
    .channel('realtime-users')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'users',
    }, payload => {
      console.log('🔄 Changement utilisateurs', payload)
      loadUsers()
    })
    .subscribe()
})

const loadUsers = async () => {
  try {
    isLoading.value = true
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur:', error)
      return
    }

    users.value = data || []
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p class="mt-2 text-gray-600">Gestion des utilisateurs</p>
      </div>

      <!-- Bouton Rafraîchir -->
      <div class="mb-6">
        <button 
          @click="loadUsers"
          :disabled="isLoading"
          class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <svg v-if="isLoading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isLoading ? 'Chargement...' : 'Rafraîchir' }}
        </button>
      </div>

      <!-- Liste des utilisateurs -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Utilisateurs ({{ users.length }})</h2>
        </div>
        
        <div v-if="isLoading" class="p-8 text-center">
          <div class="animate-spin h-8 w-8 mx-auto border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <p class="mt-2 text-gray-600">Chargement des utilisateurs...</p>
        </div>

        <div v-else-if="users.length === 0" class="p-8 text-center">
          <p class="text-gray-500">Aucun utilisateur trouvé</p>
        </div>

        <ul v-else class="divide-y divide-gray-200">
          <li v-for="user in users" :key="user.id" class="px-6 py-4 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span class="text-sm font-medium text-gray-700">
                      {{ user.name.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
                  <p class="text-sm text-gray-500">{{ user.email }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span 
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    user.role === 'admin' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  ]"
                >
                  {{ user.role }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ new Date(user.created_at).toLocaleDateString() }}
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
```

### 🟢 **5. Protection des routes admin**

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ... autres routes
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/AdminView.vue'),
      meta: { requiresAdmin: true }
    }
  ]
})

// Guard pour protéger les routes admin
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/')
  } else {
    next()
  }
})

export default router
```

## 🔁 **Résumé des étapes**

| Étape | Action | Statut |
|-------|--------|--------|
| ✅ | BDD `users` avec `role` | Fait |
| 🟩 | Supabase Auth + Trigger | À faire |
| 🟩 | Service d'authentification | À faire |
| 🟩 | Store mis à jour | À faire |
| 🟩 | Dashboard admin | À faire |
| 🟩 | Protection des routes | À faire |

## 🎯 **Avantages de cette approche**

- ✅ **Sécurité native** avec Supabase Auth
- ✅ **Gestion des sessions** automatique
- ✅ **Email de confirmation** géré par Supabase
- ✅ **Récupération de mot de passe** intégrée
- ✅ **Temps réel** avec les channels
- ✅ **Professionnel** et scalable

**Voulez-vous que je commence par implémenter une étape spécifique ?** 