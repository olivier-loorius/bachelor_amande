<template>
  <div>
    <div v-if="!authStore.isAuthenticated">
      <button @click="openLogin" class="open-login-btn">Ouvrir Connexion</button>
      <LoginPanel :isOpen="isLoginOpen" @close="closeLogin" />
    </div>
    <div v-else>
      <p>Vous êtes déjà connecté. Redirection vers l'accueil...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LoginPanel from '@/components/LoginPanel.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isLoginOpen = ref(false)

function openLogin() {
  isLoginOpen.value = true
}

function closeLogin() {
  isLoginOpen.value = false
}

onMounted(() => {
  // Si l'utilisateur est déjà connecté, rediriger vers l'accueil
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})
</script>

<style scoped>
.open-login-btn {
  padding: 0.75rem 1.5rem;
  background-color: var(--accent-color);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.open-login-btn:hover {
  background-color: darken(var(--accent-color), 10%);
}
</style>
