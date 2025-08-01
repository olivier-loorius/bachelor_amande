import { createClient } from '@supabase/supabase-js'

// Configuration Supabase avec clé anon pour l'authentification
const supabaseUrl = 'https://dofpvppwvaladogvgozi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvZnB2cHB3dmFsYWRvZ3Znb3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3ODQ2ODksImV4cCI6MjA2OTM2MDY4OX0.34BUgPoNMk8CUyMaYJPc902Lc3qU6wby-PtwG3gVO8w'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Interface pour les compositions
export interface Composition {
  id?: string
  user_id: string
  name: string
  fond: string
  garniture1: string
  garniture2: string
  garniture3: string
  finition: string
  created_at?: string
  updated_at?: string
}

// Service simple pour les utilisateurs
export const userService = {
  // Récupérer tous les utilisateurs
  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Récupérer tous les admins
  async getAllAdmins() {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data, error }
  }
}

// Service pour les compositions
export const compositionsService = {
  // Récupérer toutes les compositions d'un utilisateur
  async getUserCompositions(userId: string): Promise<Composition[]> {
    try {
      const { data, error } = await supabase
        .from('compositions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erreur lors de la récupération des compositions:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des compositions:', error)
      return []
    }
  },

  // Créer une nouvelle composition
  async createComposition(composition: Omit<Composition, 'id' | 'created_at' | 'updated_at'>): Promise<Composition | null> {
    try {
      const { data, error } = await supabase
        .from('compositions')
        .insert({
          ...composition,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Erreur lors de la création de la composition:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Erreur lors de la création de la composition:', error)
      return null
    }
  },

  // Supprimer une composition
  async deleteComposition(compositionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('compositions')
        .delete()
        .eq('id', compositionId)

      if (error) {
        console.error('Erreur lors de la suppression de la composition:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Erreur lors de la suppression de la composition:', error)
      return false
    }
  }
} 