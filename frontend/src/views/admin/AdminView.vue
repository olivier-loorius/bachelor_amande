<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Dashboard Admin - Gestion des utilisateurs</h1>

    <button 
      @click="loadUsers"
      :disabled="isLoading"
      class="mb-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded"
    >
      {{ isLoading ? 'Chargement...' : 'Rafraîchir' }}
    </button>

    <table class="min-w-full bg-white shadow rounded">
      <thead>
        <tr class="bg-gray-100 text-left">
          <th class="py-3 px-4 border-b">Nom</th>
          <th class="py-3 px-4 border-b">Email</th>
          <th class="py-3 px-4 border-b">Rôle</th>
          <th class="py-3 px-4 border-b">Créé le</th>
          <th class="py-3 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="users.length === 0 && !isLoading">
          <td colspan="5" class="text-center py-4 text-gray-500">Aucun utilisateur trouvé</td>
        </tr>
        <tr v-for="user in users" :key="user.id" :class="user.deleted ? 'bg-gray-100 opacity-60' : 'hover:bg-gray-50'">
          <td class="py-3 px-4 border-b">
            <span :class="user.deleted ? 'text-gray-500 line-through' : ''">
              {{ user.name }}
            </span>
            <span v-if="user.deleted" class="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
              🗑️ Supprimé
            </span>
          </td>
          <td class="py-3 px-4 border-b">
            <span :class="user.deleted ? 'text-gray-500' : ''">
              {{ user.email }}
            </span>
          </td>
          <td class="py-3 px-4 border-b">
            <span 
              :class="user.role === 'admin' ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'"
            >
              {{ user.role }}
            </span>
          </td>
          <td class="py-3 px-4 border-b">
            <span :class="user.deleted ? 'text-gray-500' : ''">
              {{ new Date(user.created_at).toLocaleDateString() }}
            </span>
            <div v-if="user.deleted_at" class="text-xs text-gray-400">
              Supprimé le {{ new Date(user.deleted_at).toLocaleDateString() }}
            </div>
          </td>
          <td class="py-3 px-4 border-b">
            <button 
              v-if="!user.deleted"
              @click="deleteUser(user.id)" 
              class="text-sm text-red-600 hover:underline"
              :disabled="user.id === authStore.user?.id"
              title="Marquer comme supprimé"
            >
              Marquer supprimé
            </button>
            <span v-else class="text-xs text-gray-500">
              Déjà supprimé
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="isLoading" class="mt-4 text-center text-gray-600">Chargement des utilisateurs...</div>
    
    <!-- Bouton de déconnexion -->
    <div class="mt-8 text-center">
      <button 
        @click="logout" 
        class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
      >
        <i class="fas fa-sign-out-alt mr-2"></i>
        Se déconnecter
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '@/services/supabaseService'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

interface User {
  id: string
  name: string
  email: string
  role: string
  created_at: string
  deleted?: boolean
  deleted_at?: string
}

const users = ref<User[]>([])
const isLoading = ref(false)
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  // Vérifier si l'utilisateur est connecté et admin
  if (!authStore.user || !authStore.isAdmin) {
    console.log('❌ Accès refusé: utilisateur non connecté ou non admin')
    router.push('/')
    return
  }
  
  console.log('✅ Accès admin autorisé')
  await loadUsers()
  
  // Auto-refresh toutes les 10 secondes
  setInterval(async () => {
    await loadUsers()
  }, 10000)
})

const loadUsers = async () => {
  isLoading.value = true
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
  } else {
    users.value = data || []
  }
  isLoading.value = false
}

const deleteUser = async (id: string) => {
  if (confirm('Confirmer la désactivation de cet utilisateur ?')) {
    const { error } = await supabase
      .from('users')
      .update({ deleted: true })
      .eq('id', id)

    if (error) {
      alert('Erreur lors de la désactivation')
      console.error(error)
    } else {
      // Recharger la liste après désactivation
      await loadUsers()
    }
  }
}

const logout = async () => {
  try {
    await authStore.logout()
    router.push('/')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}
</script>
