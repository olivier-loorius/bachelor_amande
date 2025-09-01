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
</script>

<style scoped>
.composer-header { 
  margin-bottom: 2rem; 
  padding: 0 0.5rem;
}

.section-title { 
  font-family: var(--font-family-title, 'Poppins', sans-serif); 
  font-size: 2.3rem; 
  color: var(--teal-color, #90aeb0); 
  text-align: left; 
  margin: 0 0 1.8rem 0; 
  font-weight: 600;
  line-height: 1.2;
}

.composer-price-ux { 
  margin: 0 0 1.5rem 0; 
  font-size: 1.08rem; 
  color: var(--text-color, #333); 
  font-family: var(--font-family-text, 'Inter', sans-serif); 
  line-height: 1.5; 
  text-align: left;
}

.composer-price-ux-value { 
  color: var(--accent-color, #e05a4e); 
  font-weight: bold; 
  font-size: 1.08em; 
  margin: 0 .5em; 
}

.composer-intro { 
  font-family: var(--font-family-text, 'Inter', sans-serif); 
  font-size: 1.05rem; 
  color: var(--text-color, #333); 
  line-height: 1.6;
  text-align: left;
}

.composer-intro-sub { 
  display: block; 
  color: var(--text-color, #333); 
  margin-top: .8rem; 
  font-size: 1.02rem; 
  font-weight: 500;
}
</style>

