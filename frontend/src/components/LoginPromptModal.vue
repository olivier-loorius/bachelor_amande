<template>
  <div v-if="isOpen" class="login-prompt-overlay active" @click.self="closeModal">
    <div class="login-prompt-modal">
      <!-- En-tête -->
      <div class="modal-header">
        <h2>Connexion Requise</h2>
        <button @click="closeModal" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Contenu -->
      <div class="modal-content">
        <div class="icon-container">
          <i class="fas fa-shopping-cart"></i>
        </div>
        
        <p class="message">
          Vous devez être connecté pour ajouter des produits à votre panier et passer commande.
        </p>

        <!-- Boutons d'action -->
        <div class="action-buttons">
          <button @click="openLogin" class="btn-primary">
            Se connecter
          </button>
          <button @click="openRegister" class="btn-secondary">
            Créer un compte
          </button>
        </div>
      </div>
    </div>

    <!-- Composant de connexion/inscription -->
    <LoginPanel 
      :isOpen="isLoginOpen" 
      @close="closeLogin"
      @loginSuccess="handleLoginSuccess"
      :openCartAfterLogin="true"
      @openCart="handleOpenCart"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LoginPanel from '@/components/auth/LoginPanel.vue'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  loginSuccess: []
  registerSuccess: []
  openCart: []
}>()

const isLoginOpen = ref(false)

const closeModal = () => {
  emit('close')
}

const openLogin = () => {
  isLoginOpen.value = true
}

const closeLogin = () => {
  isLoginOpen.value = false
}

const openRegister = () => {
  // Ouvrir le mode inscription dans LoginPanel
  isLoginOpen.value = true
  // Le LoginPanel gère maintenant l'inscription en interne
}

const handleLoginSuccess = () => {
  emit('loginSuccess')
  closeModal()
}

const handleRegisterSuccess = () => {
  emit('registerSuccess')
  closeModal()
}

const handleOpenCart = () => {
  emit('openCart')
}
</script>

<style scoped>
.login-prompt-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

.login-prompt-modal {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  max-width: 400px;
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: slideUp 0.3s ease;
}

/* En-tête */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  width: 100%;
}

.modal-header h2 {
  margin: 0;
  font-family: var(--font-family-title);
  font-size: 1.2rem;
  color: var(--text-color);
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

/* Contenu */
.modal-content {
  text-align: center;
  width: 100%;
}

.icon-container {
  color: var(--accent-color);
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.message {
  font-size: 1.1rem;
  color: var(--text-color);
  text-align: center;
  margin-bottom: 1.5rem;
  font-family: var(--font-family-text);
  line-height: 1.4;
}

/* Boutons */
.action-buttons {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  flex-direction: column;
}

.btn-primary {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: var(--font-family-text);
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  background: var(--primary-color);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-secondary {
  background: #fff;
  color: #90aeb0;
  border: 1px solid #90aeb0;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: var(--font-family-text);
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-secondary:hover {
  background: #90aeb0;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .login-prompt-overlay {
    padding: 0.5rem;
  }
  
  .login-prompt-modal {
    padding: 1.5rem;
    max-width: 90vw;
  }
  
  .modal-header h2 {
    font-size: 1.1rem;
  }
  
  .icon-container {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }
  
  .message {
    font-size: 1rem;
    margin-bottom: 1.25rem;
  }
  
  .action-buttons {
    gap: 0.5rem;
  }
  
  .btn-primary, .btn-secondary {
    padding: 0.7rem 1.25rem;
    font-size: 0.85rem;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style> 