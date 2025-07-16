<template>
  <div>
    <button @click="openLogin" class="open-login-btn">Ouvrir Connexion</button>
    <LoginPanel :isOpen="isLoginOpen" @close="closeLogin" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginPanel from '@/components/LoginPanel.vue'

const isLoginOpen = ref(false)

function openLogin() {
  isLoginOpen.value = true
}

function closeLogin() {
  isLoginOpen.value = false
}
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
