<template>
  <section class="banner-section">
    <img src="@/assets/images/TarteletteBanner.png" alt="Tarte" class="banner-image" />
    <div class="banner-text">
      <h2 class="banner-title">Bienvenue chez Amande Pâtisserie</h2>
      <p class="banner-description">
        "Découvrez l'art de la pâtisserie française revisitée avec une touche de modernité.
        Chaque création est réalisée avec passion et des ingrédients de qualité pour offrir une
        expérience gustative unique"
      </p>
    </div>
  </section>
</template>

<script setup>
// Pas de logique JS spécifique
</script>

<style scoped>
.banner-section {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%) brightness(0.8);
}

.banner-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.banner-title {
  font-size: 2.5rem;
  font-family: 'Satisfy', cursive;
  color: #fff;
  margin-bottom: 0.5rem;
}

.banner-description {
  font-size: 1.25rem;
  font-family: 'Satisfy', cursive;
  color: #fff;
  text-align: center;
  margin-top: 1rem;
}
@media (max-width: 700px) {
  .banner-section {
    height: 200px;
  }
  .banner-title {
    font-size: 1.5rem;
  }
  .banner-description {
    font-size: 1rem;
  }
  .banner-text {
    padding: 1rem 0.5rem;
    margin: 0 0.5rem;
  }
}
</style>
