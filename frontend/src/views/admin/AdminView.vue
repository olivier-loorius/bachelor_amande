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
        <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
          <td class="py-3 px-4 border-b">{{ user.name }}</td>
          <td class="py-3 px-4 border-b">{{ user.email }}</td>
          <td class="py-3 px-4 border-b">
            <span 
              :class="user.role === 'admin' ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'"
            >
              {{ user.role }}
            </span>
          </td>
          <td class="py-3 px-4 border-b">{{ new Date(user.created_at).toLocaleDateString() }}</td>
          <td class="py-3 px-4 border-b">
            <button 
              @click="deleteUser(user.id)" 
              class="text-sm text-red-600 hover:underline"
              :disabled="user.id === authStore.user.id"
              title="Supprimer cet utilisateur"
            >
              Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="isLoading" class="mt-4 text-center text-gray-600">Chargement des utilisateurs...</div>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '@/services/supabaseService'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const users = ref([])
const isLoading = ref(false)
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  if (!authStore.isAdmin) {
    router.push('/')
    return
  }
  await loadUsers()
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
  if (confirm('Confirmer la suppression de cet utilisateur ?')) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Erreur lors de la suppression')
      console.error(error)
    } else {
      // Recharger la liste après suppression
      await loadUsers()
    }
  }
}
</script>
