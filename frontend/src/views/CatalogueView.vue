<template>
  <div class="catalogue-view">
    <h1>Catalogue</h1>
    <p>Bienvenue sur la page catalogue. Ici, vous retrouverez bientôt toutes nos pâtisseries !</p>
  </div>
</template>

<script setup lang="ts">
// Aucun script spécifique pour l’instant
</script>

<style scoped>
.catalogue-view {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.catalogue-view h1 {
  font-size: 2.2rem;
  color: #b48a78;
  margin-bottom: 1rem;
  font-family: 'Roboto', sans-serif;
}
.catalogue-view p {
  font-size: 1.1rem;
  color: #444;
}
</style>
