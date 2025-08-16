<template>
  <div class="users-view">
    <div class="view-header">
      <h1>Gestion des Utilisateurs</h1>
      <p>Gérez les comptes utilisateurs et leurs permissions</p>
    </div>
    
    <div class="view-content">
      <UserTable />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import UserTable from '@/components/admin/UserTable.vue'

// COPIE EXACTE de la logique d'AdminView.vue
const userStore = useUserStore()

// COPIE EXACTE de la logique de chargement
onMounted(async () => {
  await userStore.loadUsers()
})
</script>

<style scoped>
/* COPIE EXACTE des styles d'AdminView.vue */
.users-view {
  padding: 20px;
  margin-left: 280px; /* Espace pour la sidebar */
}

.view-header {
  text-align: center;
  margin-bottom: 30px;
}

.view-header h1 {
  color: #fab92e;
  font-size: 2.5em;
  margin: 0 0 10px 0;
  font-weight: bold;
}

.view-header p {
  color: #fab92e80;
  font-size: 1.2em;
  margin: 0;
}

.view-content {
  background: #01192b;
  border-radius: 15px;
  border: 2px solid #fab92e;
  overflow: hidden;
}

/* Responsive */
@media (max-width: 1024px) {
  .users-view {
    margin-left: 250px;
  }
}

@media (max-width: 768px) {
  .users-view {
    margin-left: 0;
    padding: 15px;
  }
  
  .view-header h1 {
    font-size: 2em;
  }
  
  .view-header p {
    font-size: 1.1em;
  }
}
</style>
