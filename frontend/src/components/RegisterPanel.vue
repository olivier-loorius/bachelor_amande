<template>
  <div class="register-overlay" :class="{ active: isOpen }" @click.self="closeRegister">
    <div class="register-panel" :class="{ 'mobile-view': isMobile }">
      <!-- En-tête -->
      <div class="register-header">
        <h2>Créer un compte</h2>
        <button @click="closeRegister" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Contenu -->
      <div class="register-content">
        <p>Remplissez les informations ci-dessous pour créer votre compte.</p>
        <form class="space-y-4">
          <div>
            <label for="last-name" class="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              id="last-name"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Entrez votre nom"
            />
          </div>
          <div>
            <label for="first-name" class="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              id="first-name"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Entrez votre prénom"
            />
          </div>
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
            <label for="phone" class="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              type="tel"
              id="phone"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Entrez votre numéro"
            />
          </div>
          <div>
            <label for="birth-date" class="block text-sm font-medium text-gray-700">Date de naissance</label>
            <input
              type="date"
              id="birth-date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Créer un compte
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: Boolean,
  },
  data() {
    return {
      isMobile: false,
    }
  },
  methods: {
    closeRegister() {
      this.$emit('close')
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
}
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
  border-bottom: 1px solid var(--accent-color);
  background: var(--secondary-color);
}

.register-header h2 {
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

form input,
form select {
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

form button[type='submit']:hover {
  background: var(--text-color);
}
</style>
