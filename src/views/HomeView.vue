<template>
  <div class="page-container">
    <Navbar />
    <main class="content-container">
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

      <section class="composer-section">
        <div class="composer-content">
          <div class="composer-text">
            <h2 class="section-title">Composer votre pâtisserie</h2>
            <p class="section-description">
              Créez la pâtisserie de vos rêves en choisissant parmi une variété d'ingrédients et de
              saveurs. Laissez libre cours à votre imagination et personnalisez chaque détail pour
              une expérience unique.
            </p>
            <router-link to="/composer" class="section-link">Commencer à composer</router-link>
          </div>
          <div class="carousel">
            <img :src="currentImage" alt="Pâtisserie" class="carousel-image" />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const images = [
  './src/assets/images/ImgCompo1.png',
  './src/assets/images/ImgCompo2.png',
  './src/assets/images/ImgCompo3.png',
  './src/assets/images/ImgCompo4.png',
  './src/assets/images/ImgCompo5.png',
]

const currentImage = ref(images[0])
let intervalId: number | undefined

onMounted(() => {
  let index = 0
  intervalId = setInterval(() => {
    index = (index + 1) % images.length
    currentImage.value = images[index]
  }, 3000) // Change image every 3 seconds
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Satisfy&display=swap');

.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background-color: #f9f9f9;
}

.content-container {
  width: 100%;
}

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

.composer-section {
  padding: 2rem;
  text-align: left;
  background-color: #fff;
  margin: 2rem auto;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 800px;
}

.composer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.composer-text {
  flex: 1;
  margin-right: 1rem;
}

.section-title {
  font-size: 2rem;
  font-family: 'Roboto', sans-serif;
  color: var(--text-color);
  margin-bottom: 1rem;
  text-align: left;
}

.section-description {
  font-size: 1rem;
  font-family: 'Roboto', sans-serif;
  color: var(--text-color);
  margin-bottom: 1.5rem;
  text-align: left;
}

.section-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--accent-color); /* Couleur initiale du bouton */
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  border-radius: 0.5rem;
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
  font-family: 'Roboto', sans-serif;
}

.section-link:hover {
  background-color: var(--accent-color); /* Conserve la couleur initiale au survol */
  transform: scale(1.05);
}

.carousel {
  flex: 1;
  text-align: center;
}

.carousel-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .banner-section {
    height: 250px;
  }

  .banner-title {
    font-size: 1.5rem;
  }

  .banner-description {
    font-size: 1rem;
  }

  .composer-section {
    padding: 1.5rem;
  }

  .composer-content {
    flex-direction: column;
    align-items: center;
  }

  .composer-text {
    margin-right: 0;
    margin-bottom: 1rem;
    text-align: center;
  }

  .section-title {
    font-size: 1.5rem;
    text-align: center;
  }

  .section-description {
    font-size: 0.875rem;
    text-align: center;
  }

  .section-link {
    padding: 0.5rem 1rem;
  }

  .carousel {
    width: 100%;
  }

  .carousel-image {
    max-height: 200px;
  }
}
</style>
