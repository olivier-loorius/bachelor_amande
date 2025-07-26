import { ref, reactive } from 'vue'

interface User {
  id: string
  email: string
  nom: string
  prenom: string
  telephone: string
  dateNaissance: string
  password: string
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  nom: string
  prenom: string
  email: string
  telephone: string
  dateNaissance: string
  password: string
}

export function useAuth() {
  const currentUser = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const users = ref<User[]>([])

  // Initialiser depuis localStorage
  const initAuth = () => {
    try {
      console.log('Initialisation de l\'auth...')
      const storedUsers = localStorage.getItem('users')
      console.log('Utilisateurs stockés:', storedUsers)
      if (storedUsers) {
        users.value = JSON.parse(storedUsers)
        console.log('Utilisateurs chargés:', users.value.length)
      }
      
      const storedUser = localStorage.getItem('currentUser')
      console.log('Utilisateur courant stocké:', storedUser)
      if (storedUser) {
        currentUser.value = JSON.parse(storedUser)
        isAuthenticated.value = true
        console.log('Utilisateur connecté:', currentUser.value)
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'auth:', error)
    }
  }

  // Sauvegarder les utilisateurs
  const saveUsers = () => {
    try {
      const usersData = JSON.stringify(users.value)
      console.log('Données à sauvegarder:', usersData)
      localStorage.setItem('users', usersData)
      console.log('Utilisateurs sauvegardés dans localStorage')
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des utilisateurs:', error)
    }
  }

  // Sauvegarder l'utilisateur courant
  const saveCurrentUser = () => {
    try {
      if (currentUser.value) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
      } else {
        localStorage.removeItem('currentUser')
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error)
    }
  }

  // Inscription
  const register = (userData: RegisterData): { success: boolean; message: string } => {
    try {
      console.log('Tentative d\'inscription avec:', userData)
      
      // Vérifier si l'email existe déjà
      const existingUser = users.value.find(user => user.email === userData.email)
      if (existingUser) {
        console.log('Email déjà utilisé:', userData.email)
        return { success: false, message: 'Un compte avec cet email existe déjà. Veuillez vous connecter.' }
      }

      // Créer le nouvel utilisateur
      const newUser: User = {
        id: Date.now().toString(),
        ...userData
      }

      console.log('Nouvel utilisateur créé:', newUser)
      users.value.push(newUser)
      
      console.log('Sauvegarde des utilisateurs...')
      saveUsers()
      console.log('Utilisateurs sauvegardés. Total:', users.value.length)

      return { success: true, message: 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.' }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      return { success: false, message: 'Erreur lors de la création du compte.' }
    }
  }

  // Connexion
  const login = (credentials: LoginCredentials): { success: boolean; message: string } => {
    try {
      const user = users.value.find(u => u.email === credentials.email)
      
      if (!user) {
        return { success: false, message: 'Aucun compte trouvé avec cet email. Veuillez créer un compte.' }
      }

      if (user.password !== credentials.password) {
        return { success: false, message: 'Mot de passe incorrect.' }
      }

      currentUser.value = user
      isAuthenticated.value = true
      saveCurrentUser()

      return { success: true, message: 'Connexion réussie !' }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      return { success: false, message: 'Erreur lors de la connexion.' }
    }
  }

  // Déconnexion
  const logout = () => {
    currentUser.value = null
    isAuthenticated.value = false
    saveCurrentUser()
  }

  // Obtenir le nom complet de l'utilisateur
  const getUserFullName = () => {
    if (!currentUser.value) return ''
    return `${currentUser.value.prenom} ${currentUser.value.nom}`
  }

  // Recharger les données depuis localStorage
  const reloadUsers = () => {
    console.log('Rechargement des utilisateurs...')
    initAuth()
  }

  // Initialiser au démarrage
  initAuth()

  return {
    currentUser,
    isAuthenticated,
    users,
    register,
    login,
    logout,
    getUserFullName,
    reloadUsers,
    // Fonction de debug pour vérifier les utilisateurs
    debugUsers: () => {
      console.log('Utilisateurs actuels:', users.value)
      console.log('localStorage users:', localStorage.getItem('users'))
    }
  }
} 