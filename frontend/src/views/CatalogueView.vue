<template>
  <div class="page-container">
    <main class="content-container catalogue-content">
      <div class="catalogue-card">
        <h1>Catalogue</h1>
        <p class="mb-8 text-center">
          Trouvez ici nos dernières créations du mois de {{ currentMonth }}
        </p>

        <!-- Slider des créations du mois -->
        <h2 class="text-xl font-semibold mb-4 mt-2" style="color: #b48a78;">Créations du mois</h2>
        <div class="slider-container mb-10">
          <div class="slider-track">
            <div
              v-for="creation in creationsMois"
              :key="creation.id"
              class="creation-card"
            >
              <img :src="creation.image" :alt="creation.nom" class="creation-img" />
              <div class="creation-nom">{{ creation.nom }}</div>
            </div>
          </div>
        </div>

        <!-- Produits phares -->
        <h2 class="text-xl font-semibold mb-4 mt-8" style="color: #b48a78;">Nos produits phares en commande</h2>
        <div class="produits-phares-grid">
          <div
            v-for="produit in produitsPhares"
            :key="produit.id"
            class="produit-card"
          >
            <img :src="produit.image" :alt="produit.nom" class="produit-img" />
            <div class="produit-nom">{{ produit.nom }}</div>
            <button class="btn-commander">Commander</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Mois dynamique
const mois = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
]
const currentMonth = mois[new Date().getMonth()]

// Données fictives pour les créations du mois
const creationsMois = ref([
  { id: 1, nom: 'Tartelette Framboise', image: new URL('@/assets/images/TarteletteBanner.png', import.meta.url).href },
  { id: 2, nom: 'Éclair Chocolat', image: new URL('@/assets/images/eclairs.jpg', import.meta.url).href },
  { id: 3, nom: 'Macaron Pistache', image: new URL('@/assets/images/macaron.jpg', import.meta.url).href },
  { id: 4, nom: 'Gâteau d’Anniversaire', image: new URL('@/assets/images/birthday.jpg', import.meta.url).href },
])

// Données fictives pour les produits phares
const produitsPhares = ref([
  { id: 1, nom: 'Wedding Cake', image: new URL('@/assets/images/wedding-cake.jpg', import.meta.url).href },
  { id: 2, nom: 'Pâtisserie Chocolat', image: new URL('@/assets/images/chocolat.jpg', import.meta.url).href },
  { id: 3, nom: 'Génoise Fruits', image: new URL('@/assets/images/genoise.jpg', import.meta.url).href },
  { id: 4, nom: 'Pâte à Choux', image: new URL('@/assets/images/pâte.jpg', import.meta.url).href },
])
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: var(--secondary-color);
}
.content-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.catalogue-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.catalogue-card {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(180, 138, 120, 0.07);
  padding: 2.5rem 2rem;
  max-width: 900px;
  width: 100%;
  margin: 2rem 0;
}
@media (max-width: 640px) {
  .catalogue-card {
    padding: 1.2rem 0.5rem;
    margin: 1rem 0;
  }
}
.catalogue-view {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
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
.slider-container {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 8px;
}
.slider-track {
  display: flex;
  gap: 1.5rem;
}
.creation-card {
  min-width: 180px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}
.creation-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}
.creation-nom {
  font-weight: 500;
  color: #b48a78;
  text-align: center;
}
.produits-phares-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 900px;
  margin-bottom: 2rem;
}
.produit-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}
.produit-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}
.produit-nom {
  font-weight: 500;
  color: #b48a78;
  text-align: center;
  margin-bottom: 0.5rem;
}
.btn-commander {
  background: #b48a78;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-commander:hover {
  background: #a06c5a;
}
</style>
