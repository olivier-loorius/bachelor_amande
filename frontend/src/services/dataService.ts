import { ref, reactive } from 'vue'

// Types pour la sécurité
interface User {
  id: string
  email: string
  nom: string
  dateCreation: string
  role: 'user' | 'admin'
  panierId: string
}

interface Panier {
  id: string
  userId: string
  items: any[]
  dateCreation: string
  derniereModification: string
}

interface SecureData {
  users: User[]
  paniers: Record<string, Panier>
}

// Service de gestion des données sécurisées
class DataService {
  private data: SecureData = {
    users: [],
    paniers: {}
  }

  constructor() {
    this.loadData()
    
    if (this.data.users.length === 0) {
      this.initializeDemoData()
    }
  }

  private initializeDemoData(): void {
    const demoUser: User = {
      id: 'user_001',
      email: 'demo@amande.com',
      nom: 'Demo User',
      dateCreation: '2024-01-15T10:30:00Z',
      role: 'user',
      panierId: 'panier_user_001'
    }

    const demoPanier: Panier = {
      id: 'panier_user_001',
      userId: 'user_001',
      items: [],
      dateCreation: '2024-01-15T10:30:00Z',
      derniereModification: '2024-01-15T10:30:00Z'
    }

    this.data.users.push(demoUser)
    this.data.paniers[demoPanier.id] = demoPanier
    this.saveData()
  }

  loadData(): SecureData {
    try {
      const storedData = localStorage.getItem('secure_data')
      if (storedData) {
        const decryptedData = atob(storedData)
        const parsed = JSON.parse(decryptedData)
        if (this.validateData(parsed)) {
          this.data = parsed
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      this.initializeDemoData()
    }
    return this.data
  }

  saveData(): void {
    try {
      const encryptedData = btoa(JSON.stringify(this.data))
      localStorage.setItem('secure_data', encryptedData)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }

  private validateData(data: any): data is SecureData {
    return (
      data &&
      Array.isArray(data.users) &&
      typeof data.paniers === 'object'
    )
  }

  getUserById(id: string): User | null {
    return this.data.users.find(user => user.id === id) || null
  }

  getUserByEmail(email: string): User | null {
    return this.data.users.find(user => user.email === email) || null
  }

  createUser(userData: Omit<User, 'id' | 'dateCreation' | 'panierId'>): User {
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      dateCreation: new Date().toISOString(),
      panierId: `panier_user_${Date.now()}`
    }

    const newPanier: Panier = {
      id: newUser.panierId,
      userId: newUser.id,
      items: [],
      dateCreation: new Date().toISOString(),
      derniereModification: new Date().toISOString()
    }

    this.data.users.push(newUser)
    this.data.paniers[newUser.panierId] = newPanier
    this.saveData()

    return newUser
  }

  getPanierByUserId(userId: string): Panier | null {
    const user = this.getUserById(userId)
    if (!user) return null
    return this.data.paniers[user.panierId] || null
  }

  updatePanier(userId: string, items: any[]): void {
    const user = this.getUserById(userId)
    if (!user) return

    const panier = this.data.paniers[user.panierId]
    if (panier) {
      panier.items = items
      panier.derniereModification = new Date().toISOString()
      this.saveData()
    }
  }

  clearUserData(userId: string): void {
    const user = this.getUserById(userId)
    if (user) {
      this.data.users = this.data.users.filter(u => u.id !== userId)
      delete this.data.paniers[user.panierId]
      this.saveData()
    }
  }

  exportData(): string {
    return JSON.stringify(this.data, null, 2)
  }

  importData(data: string): boolean {
    try {
      const parsed = JSON.parse(data)
      if (this.validateData(parsed)) {
        this.data = parsed
        this.saveData()
        return true
      }
    } catch (error) {
      console.error('Erreur lors de l\'import:', error)
    }
    return false
  }
}

export const dataService = new DataService() 