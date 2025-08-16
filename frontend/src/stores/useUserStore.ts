import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/services/supabaseService'

// COPIE EXACTE des interfaces d'AdminView.vue
interface User {
  id: string
  name: string
  email: string
  role: string
  created_at: string
  updated_at?: string
  deleted?: boolean
  deleted_at?: string
}

export const useUserStore = defineStore('users', () => {
  // COPIE EXACTE de l'état des utilisateurs
  const users = ref<User[]>([])
  const isLoading = ref(false)
  const isUsersSectionOpen = ref(false)
  const searchQuery = ref('')

  // COPIE EXACTE des computed properties
  const activeUsers = computed(() => users.value.filter(user => !user.deleted).length)
  const deletedUsers = computed(() => users.value.filter(user => user.deleted).length)

  const filteredUsers = computed(() => {
    if (!searchQuery.value) return users.value
    
    const query = searchQuery.value.toLowerCase()
    return users.value.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  })

  // COPIE EXACTE des fonctions de gestion des utilisateurs
  const loadUsers = async () => {
    try {
      isLoading.value = true
      console.log('🔄 Chargement des utilisateurs...')
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('❌ Erreur lors du chargement des utilisateurs:', error)
        return
      }
      
      users.value = data || []
      console.log(`✅ ${users.value.length} utilisateurs chargés`)
    } catch (error) {
      console.error('❌ Erreur lors du chargement des utilisateurs:', error)
    } finally {
      isLoading.value = false
    }
  }

  const toggleUsersSection = () => {
    isUsersSectionOpen.value = !isUsersSectionOpen.value
  }

  const updateSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  // COPIE EXACTE de la fonction de suppression d'utilisateur
  const deleteUser = async (userId: string) => {
    try {
      console.log(`🗑️ Tentative de suppression de l'utilisateur ${userId}...`)
      
      const { error } = await supabase
        .from('users')
        .update({ 
          deleted: true, 
          deleted_at: new Date().toISOString() 
        })
        .eq('id', userId)
      
      if (error) {
        console.error('❌ Erreur lors de la suppression:', error)
        return false
      }
      
      // Mettre à jour l'état local
      const userIndex = users.value.findIndex(u => u.id === userId)
      if (userIndex !== -1) {
        users.value[userIndex].deleted = true
        users.value[userIndex].deleted_at = new Date().toISOString()
      }
      
      console.log(`✅ Utilisateur ${userId} supprimé avec succès`)
      return true
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error)
      return false
    }
  }

  return {
    // État
    users,
    isLoading,
    isUsersSectionOpen,
    searchQuery,
    
    // Computed properties
    activeUsers,
    deletedUsers,
    filteredUsers,
    
    // Actions
    loadUsers,
    toggleUsersSection,
    updateSearchQuery,
    deleteUser
  }
})
