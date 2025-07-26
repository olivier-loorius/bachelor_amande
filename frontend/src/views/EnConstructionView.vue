<template>
  <div class="en-construction">
    <h1>Page en construction</h1>
    <p>Cette page sera bientôt disponible !</p>
    <div class="actions">
      <button class="btn-secondary" @click="goBack">Retour</button>
      <router-link class="btn-primary" to="/">Accueil</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
function goBack() {
  router.back()
}
</script>

<style scoped>
.en-construction {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  background: var(--secondary-color);
}
h1 {
  color: var(--accent-color);
  font-size: 2.2rem;
  font-family: var(--font-family-title);
  letter-spacing: 1px;
  margin-bottom: 1rem;
  text-transform: uppercase;
}
p {
  color: var(--text-color);
  font-family: var(--font-family-text);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}
.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
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
  text-decoration: none;
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
@media (max-width: 768px) {
  .en-construction {
    padding: 1rem;
  }
  h1 {
    font-size: 1.4rem;
  }
  p {
    font-size: 1rem;
  }
  .btn-primary, .btn-secondary {
    padding: 0.7rem 1.25rem;
    font-size: 0.85rem;
  }
}
</style> 