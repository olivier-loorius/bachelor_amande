<template>
  <div class="composer-header">
    <h1 class="section-title">Composer sa tartelette</h1>
    
    <div class="composer-price-ux">
      Chez Amande, chaque tartelette est à prix unique :
      <span class="composer-price-ux-value">6€ / tartelette</span>
      Laissez-vous tenter, composez sans compter !
    </div>
    
    <p class="composer-intro">
      Créez la tartelette de vos rêves en quelques clics !<br />
      Choisissez chaque ingrédient, visualisez le résultat, et laissez parler votre
      gourmandise.<br />
      Chaque produit est préparé artisanalement dans notre atelier par nos pâtissiers
      passionnés, toujours à la recherche de qualité et de saveurs d'exception.<br />
      <span class="composer-intro-sub"
        >Personnalisez, savourez, partagez ! Disponible sous 2h en boutique.</span
      >
    </p>
  </div>
</template>

<script setup lang="ts">
// Composant header pour le titre, prix et introduction
// Responsabilité unique : présentation des informations générales
</script>

<style scoped>
.composer-header {
  margin-bottom: 2rem;
}

.section-title {
  font-family: var(--font-family-title);
  font-size: 2.3rem;
  color: #90aeb0;
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: 1px;
}

.composer-price-ux {
  margin: 0 0 1.2rem 0;
  text-align: left;
  font-size: 1.08rem;
  color: var(--text-color);
  font-family: var(--font-family-text);
  font-weight: normal;
  line-height: 1.5;
}

.composer-price-ux-value {
  color: #ff6f61;
  font-weight: bold;
  font-size: 1.08em;
  margin-left: 0.5em;
  margin-right: 0.5em;
}

.composer-intro {
  font-family: var(--font-family-text);
  font-size: 1.1rem;
  color: var(--text-color);
  margin-bottom: 2rem;
}

.composer-intro-sub {
  display: block;
  color: var(--text-color);
  font-weight: normal;
  margin-top: 0.7rem;
  font-size: 1.08rem;
  letter-spacing: 0.5px;
}
</style>

