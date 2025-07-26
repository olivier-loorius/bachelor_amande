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
        <p>Remplissez les informations ci-dessous pour créer votre compte.</p>
        
        <div v-if="message" :class="['message', messageType]">
          {{ message }}
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label for="nom" class="block text-sm font-medium text-gray-700">Nom</label>
            <input
              v-model="formData.nom"
              type="text"
              id="nom"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Entrez votre nom"
              required
            />
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="formData.email"
              type="email"
              id="email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Entrez votre email"
              autocomplete="username"
              required
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
            <div class="password-container">
              <input
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                class="password-input"
                placeholder="Entrez votre mot de passe"
                autocomplete="new-password"
                required
              />
              <button
                type="button"
                @click="togglePassword"
                class="password-toggle"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Création...' : 'Créer un compte' }}
          </button>
        </form>
        
        <p class="text-sm text-center mt-4">
          Vous avez déjà un compte ?
          <a href="#" class="text-accent hover:underline" @click.prevent="openLogin">Connectez-vous</a>
        </p>

        <!-- Modale de succès intégrée -->
        <div v-if="showSuccessModal" class="success-modal-integrated" :class="{ show: showSuccessModal }">
          <div class="success-modal-content">
            <div class="success-modal-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="success-modal-msg">Compte créé avec succès !</div>
            <div class="modal-actions">
              <button class="btn-primary" @click="closeSuccessModal">
                Continuer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  openLogin: []
}>()

const authStore = useAuthStore()

const isMobile = ref(false)
const isLoading = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('error')
const showPassword = ref(false)
const showSuccessModal = ref(false)

const formData = reactive({
  nom: '',
  email: '',
  password: ''
})

const closeRegister = () => {
  emit('close')
  resetForm()
}

const openLogin = () => {
  emit('openLogin')
}

const resetForm = () => {
  formData.nom = ''
  formData.email = ''
  formData.password = ''
  message.value = ''
  isLoading.value = false
  showPassword.value = false
}

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    resetForm()
  }
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePassword = (password: string): boolean => {
  return password.length >= 4
}

const showMessage = (msg: string, type: 'success' | 'error') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  closeRegister()
  window.location.reload()
}

const handleRegister = async () => {
  if (!formData.nom.trim()) {
    showMessage('Le nom est requis', 'error')
    return
  }

  if (!validateEmail(formData.email)) {
    showMessage('Format d\'email invalide', 'error')
    return
  }

  if (!validatePassword(formData.password)) {
    showMessage('Le mot de passe doit contenir au moins 4 caractères', 'error')
    return
  }

  isLoading.value = true

  try {
    const result = await authStore.register({
      nom: formData.nom.trim(),
      email: formData.email.trim(),
      password: formData.password
    })

    if (result.success) {
      showSuccessModal.value = true
      resetForm()
      // Fermer automatiquement le formulaire après 4 secondes
      setTimeout(() => {
        closeSuccessModal()
      }, 4000)
    } else {
      showMessage(result.message, 'error')
    }
  } catch (error) {
    showMessage('Erreur lors de la création du compte', 'error')
  } finally {
    isLoading.value = false
  }
}

const checkViewport = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkViewport()
  window.addEventListener('resize', checkViewport)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkViewport)
})
</script>

<style scoped>
.register-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.register-overlay.active {
  opacity: 1;
  visibility: visible;
}

.register-panel {
  width: 400px;
  height: 100vh;
  background: var(--secondary-color);
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  border-radius: 0 0 0 20px;
}

.register-overlay.active .register-panel {
  transform: translateX(0);
}

.register-panel.mobile-view {
  width: 100%;
  height: 80vh;
  position: fixed;
  bottom: 0;
  border-radius: 20px 20px 0 0;
  transform: translateY(100%);
}

.register-overlay.active .register-panel.mobile-view {
  transform: translateY(0);
}

.register-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--secondary-color);
}

.register-header h2 {
  margin: 0;
  color: #90aeb0;
  font-family: var(--font-family-title);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s;
}

.close-btn:hover {
  color: var(--accent-color);
}

.register-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  font-family: var(--font-family-text);
  color: var(--text-color);
}

.register-content p {
  margin-bottom: 1.5rem;
  font-size: 1rem;
  line-height: 1.5;
}

.message {
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

form label {
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--text-color);
  display: block;
  margin-bottom: 0.5rem;
}

form input {
  padding: 0.75rem;
  border: 1px solid var(--accent-color);
  border-radius: 0.5rem;
  font-size: 1rem;
  color: var(--text-color);
  background: var(--secondary-color);
  width: 100%;
  box-sizing: border-box;
}

form input::placeholder {
  color: var(--cart-text-light);
  font-size: 0.9rem;
}

form button {
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
  width: 100%;
}

form button[type='submit'] {
  background: var(--accent-color);
  color: var(--secondary-color);
}

form button[type='submit']:hover:not(:disabled) {
  background: var(--text-color);
}

form button[type='submit']:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.password-container {
  position: relative;
  margin-top: 0.25rem;
}

.password-input {
  padding: 0.75rem;
  padding-right: 2.5rem;
  border: 1px solid var(--accent-color);
  border-radius: 0.5rem;
  font-size: 1rem;
  color: var(--text-color);
  background: var(--secondary-color);
  width: 100%;
  box-sizing: border-box;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.3s;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-top: -1px;
}

.password-toggle:hover {
  color: var(--accent-color);
}

.success-modal-integrated {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: var(--secondary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  z-index: 10;
}

.success-modal-integrated.show {
  transform: translateY(0);
}

.success-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  text-align: center;
  max-width: 300px;
  width: 100%;
}

.success-modal-icon {
  color: var(--accent-color);
  font-size: 2.5rem;
}

.success-modal-msg {
  font-size: 1.1rem;
  color: var(--text-color);
  text-align: center;
  font-family: var(--font-family-text);
  line-height: 1.4;
}

.modal-actions {
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.inset-y-0 {
  top: 0;
  bottom: 0;
}

.right-0 {
  right: 0;
}

.pr-3 {
  padding-right: 0.75rem;
}

.pr-10 {
  padding-right: 2.5rem;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.text-gray-400 {
  color: #9ca3af;
}

.text-xs {
  font-size: 0.75rem;
}

.text-gray-500 {
  color: #6b7280;
}

.mt-1 {
  margin-top: 0.25rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
}

.block {
  display: block;
}

.w-full {
  width: 100%;
}

.rounded-md {
  border-radius: 0.375rem;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.focus\:border-indigo-500:focus {
  border-color: #6366f1;
}

.focus\:ring-indigo-500:focus {
  --tw-ring-color: #6366f1;
}

.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-offset-2:focus {
  --tw-ring-offset-width: 2px;
}

.sm\:text-sm {
  font-size: 0.875rem;
}

.text-sm {
  font-size: 0.875rem;
}

.font-medium {
  font-weight: 500;
}

.text-gray-700 {
  color: #374151;
}

.text-white {
  color: #ffffff;
}

.bg-indigo-600 {
  background-color: #4f46e5;
}

.hover\:bg-indigo-700:hover {
  background-color: #4338ca;
}

.border-transparent {
  border-color: transparent;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.justify-center {
  justify-content: center;
}

.text-center {
  text-align: center;
}

.mt-4 {
  margin-top: 1rem;
}

.text-indigo-600 {
  color: #4f46e5;
}

.text-accent {
  color: var(--accent-color);
}

.hover\:underline:hover {
  text-decoration: underline;
}
</style>
