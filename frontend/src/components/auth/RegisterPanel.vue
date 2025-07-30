<template>
  <div class="register-overlay" :class="{ active: isOpen }" @click.self="closeRegister">
    <div class="register-panel" :class="{ 'mobile-view': isMobile }">
      <div class="register-header">
        <h2>Créer un compte</h2>
        <button @click="closeRegister" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="register-content">
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label for="nom">Nom complet *</label>
            <input
              id="nom"
              v-model="formData.nom"
              type="text"
              required
              placeholder="Votre nom complet"
            />
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              placeholder="votre@email.com"
            />
          </div>

          <div class="form-group">
            <label for="password">Mot de passe *</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              required
              placeholder="Votre mot de passe"
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmer le mot de passe *</label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              type="password"
              required
              placeholder="Confirmez votre mot de passe"
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="register-btn" :disabled="loading">
              <span v-if="!loading">Créer un compte</span>
              <span v-else>Création...</span>
            </button>
          </div>
        </form>

        <div class="register-footer">
          <p>Vous avez déjà un compte ?</p>
          <button @click="openLogin" class="login-link">
            Se connecter
          </button>
        </div>
      </div>
    </div>

    <!-- Modale de succès -->
    <div v-if="showSuccessModal" class="success-modal-overlay" @click.self="closeSuccessModal">
      <div class="success-modal">
        <div class="success-modal-header">
          <i class="fas fa-check-circle"></i>
          <h3>Compte créé avec succès !</h3>
        </div>
        <div class="success-modal-content">
          <p>Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.</p>
        </div>
        <div class="success-modal-actions">
          <button @click="handleLoginAfterRegister" class="success-modal-btn">
            <i class="fas fa-sign-in-alt"></i>
            Se connecter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'
// Modal components removed - using simple divs instead

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  openLogin: []
}>()

const authStore = useAuthStore()
const loading = ref(false)
const isMobile = ref(false)
const showSuccessModal = ref(false)

const formData = reactive({
  nom: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const closeRegister = () => {
  emit('close')
}

const handleRegister = async () => {
  if (!formData.nom || !formData.email || !formData.password || !formData.confirmPassword) {
    return
  }

  if (formData.password !== formData.confirmPassword) {
    alert('Les mots de passe ne correspondent pas')
    return
  }

  loading.value = true
  
  try {
    await authStore.register(formData.nom, formData.email, formData.password)
    showSuccessModal.value = true
  } catch (error) {
    console.error('Erreur d\'inscription:', error)
  } finally {
    loading.value = false
  }
}

const openLogin = () => {
  emit('openLogin')
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  closeRegister()
}

const handleLoginAfterRegister = () => {
  showSuccessModal.value = false
  closeRegister()
  emit('openLogin')
}

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.register-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.register-overlay.active {
  opacity: 1;
  visibility: visible;
}

.register-panel {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transform: translateY(-20px);
  transition: all 0.3s ease;
}

.register-overlay.active .register-panel {
  transform: translateY(0);
}

.register-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.register-header h2 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-color-light);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: var(--background-light);
  color: var(--text-color);
}

.register-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.9rem;
}

.form-group input {
  padding: 12px 15px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(255, 111, 97, 0.1);
}

.form-actions {
  margin-top: 1rem;
}

.register-btn {
  width: 100%;
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.register-btn:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.register-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.register-footer p {
  margin: 0 0 0.5rem 0;
  color: var(--text-color-light);
  font-size: 0.9rem;
}

.login-link {
  background: none;
  border: none;
  color: var(--accent-color);
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: var(--accent-hover);
}

.success-content {
  text-align: center;
  padding: 1rem 0;
}

.success-content p {
  margin: 0;
  color: var(--text-color);
  line-height: 1.6;
}

/* Modale de succès */
.success-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.success-modal {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.success-modal-header {
  margin-bottom: 1rem;
}

.success-modal-header i {
  font-size: 3rem;
  color: #4CAF50;
  margin-bottom: 1rem;
}

.success-modal-header h3 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.3rem;
}

.success-modal-content {
  margin-bottom: 1.5rem;
}

.success-modal-content p {
  margin: 0;
  color: var(--text-color);
  line-height: 1.6;
}

.success-modal-actions {
  display: flex;
  justify-content: center;
}

.success-modal-btn {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.success-modal-btn:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .register-panel {
    margin: 1rem;
    padding: 1.5rem;
    max-width: none;
    width: calc(100% - 2rem);
  }

  .register-panel.mobile-view {
    border-radius: 15px 15px 0 0;
    margin: 0;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    transform: translateY(100%);
  }

  .register-overlay.active .register-panel.mobile-view {
    transform: translateY(0);
  }
}
</style> 