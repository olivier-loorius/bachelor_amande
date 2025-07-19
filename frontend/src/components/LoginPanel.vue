<template>
  <div class="login-overlay" :class="{ 'active': isOpen }" @click.self="closeLogin">
    <div class="login-panel" :class="{ 'mobile-view': isMobile }">
      <!-- En-tête -->
      <div class="login-header">
        <h2>Connexion</h2>
        <button @click="closeLogin" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Contenu -->
      <div class="login-content">
        <p>Entrez votre email et mot de passe pour vous connecter à votre compte.</p>
        <form class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Entrez votre email"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              id="password"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Entrez votre mot de passe"
            />
          </div>
          <a href="#" class="text-sm text-indigo-600 hover:underline">Mot de passe oublié ?</a>
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Connexion
          </button>
        </form>
        <p class="text-sm text-center mt-4">
          Vous n'avez pas de compte ?
          <a href="#" class="text-indigo-600 hover:underline" @click.prevent="openRegister">Créez-en un</a>
        </p>
      </div>
    </div>
    <RegisterPanel :isOpen="isRegisterOpen" @close="closeRegister" />
  </div>
</template>

<script>
import RegisterPanel from '@/components/RegisterPanel.vue';

export default {
  props: {
    isOpen: Boolean,
  },
  data() {
    return {
      isMobile: false,
      isRegisterOpen: false,
    }
  },
  methods: {
    closeLogin() {
      this.$emit('close')
    },
    openRegister() {
      this.isRegisterOpen = true
    },
    closeRegister() {
      this.isRegisterOpen = false
    },
    checkViewport() {
      this.isMobile = window.innerWidth < 768
    },
  },
  mounted() {
    this.checkViewport()
    window.addEventListener('resize', this.checkViewport)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkViewport)
  },
  components: {
    RegisterPanel
  }
}
</script>

<style scoped>
.login-overlay {
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

.login-overlay.active {
  opacity: 1;
  visibility: visible;
}

.login-panel {
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

.login-overlay.active .login-panel {
  transform: translateX(0);
}

.login-panel.mobile-view {
  width: 100%;
  height: 80vh;
  position: fixed;
  bottom: 0;
  border-radius: 20px 20px 0 0;
  transform: translateY(100%);
}

.login-overlay.active .login-panel.mobile-view {
  transform: translateY(0);
}

.login-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--accent-color);
  background: var(--secondary-color);
}

.login-header h2 {
  margin: 0;
  color: var(--accent-color);
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

.login-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  font-family: var(--font-family-text);
  color: var(--text-color);
}

.login-content p {
  margin-bottom: 1.5rem;
  font-size: 1rem;
  line-height: 1.5;
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

form a {
  font-size: 0.9rem;
  color: var(--accent-color);
  text-decoration: none;
  align-self: flex-end;
}

form a:hover {
  text-decoration: underline;
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

form button[type='submit']:hover {
  background: var(--text-color);
}

form button[type='button'] {
  background: var(--secondary-color);
  color: var(--text-color);
  border: 1px solid var(--accent-color);
}

form button[type='button']:hover {
  background: var(--accent-color);
  color: var(--secondary-color);
}

.login-content .text-center {
  margin-top: 1.5rem;
  font-size: 0.9rem;
}

.login-content .text-center a {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: bold;
}

.login-content .text-center a:hover {
  text-decoration: underline;
}
</style>
