<template>
  <div class="login-overlay" :class="{ active: isOpen }" @click.self="closeLogin">
    <div class="login-panel" :class="{ 'mobile-view': isMobile }">
      <div class="login-header">
        <h2>Se connecter</h2>
        <button @click="closeLogin" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="login-content">
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              placeholder="votre@email.com"
            />
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              required
              placeholder="Votre mot de passe"
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="login-btn" :disabled="loading">
              <span v-if="!loading">Se connecter</span>
              <span v-else>Connexion...</span>
            </button>
          </div>
        </form>

        <div class="login-footer">
          <p>Pas encore de compte ?</p>
          <button @click="openRegister" class="register-link">
            Créer un compte
          </button>
        </div>
      </div>
    </div>

    <!-- Modale de déconnexion -->
    <LogoutModal
      :isOpen="showLogoutModal"
      @close="closeLogoutModal"
      @confirm="confirmLogout"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import LogoutModal from '@/components/LogoutModal.vue'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const authStore = useAuthStore()
const loading = ref(false)
const isMobile = ref(false)
const showLogoutModal = ref(false)

const formData = reactive({
  email: '',
  password: ''
})

const isLoggedIn = computed(() => authStore.isLoggedIn)

const closeLogin = () => {
  emit('close')
}

const handleLogin = async () => {
  if (!formData.email || !formData.password) {
    return
  }

  loading.value = true
  
  try {
    await authStore.login(formData.email, formData.password)
    closeLogin()
  } catch (error) {
    console.error('Erreur de connexion:', error)
  } finally {
    loading.value = false
  }
}

const openRegister = () => {
  // Émettre un événement pour ouvrir le panneau d'inscription
  emit('close')
  // Ici on pourrait émettre un événement pour ouvrir RegisterPanel
}

const logout = () => {
  showLogoutModal.value = true
}

const closeLogoutModal = () => {
  showLogoutModal.value = false
}

const confirmLogout = () => {
  authStore.logout()
  showLogoutModal.value = false
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
.login-overlay {
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

.login-overlay.active {
  opacity: 1;
  visibility: visible;
}

.login-panel {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transform: translateY(-20px);
  transition: all 0.3s ease;
}

.login-overlay.active .login-panel {
  transform: translateY(0);
}

.login-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.login-header h2 {
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

.login-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.login-form {
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

.login-btn {
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

.login-btn:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.login-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.login-footer p {
  margin: 0 0 0.5rem 0;
  color: var(--text-color-light);
  font-size: 0.9rem;
}

.register-link {
  background: none;
  border: none;
  color: var(--accent-color);
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: var(--accent-hover);
}

/* Responsive */
@media (max-width: 768px) {
  .login-panel {
    margin: 1rem;
    padding: 1.5rem;
    max-width: none;
    width: calc(100% - 2rem);
  }

  .login-panel.mobile-view {
    border-radius: 15px 15px 0 0;
    margin: 0;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    transform: translateY(100%);
  }

  .login-overlay.active .login-panel.mobile-view {
    transform: translateY(0);
  }
}
</style> 