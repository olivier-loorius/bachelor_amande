<template>
  <section class="composer-section">
    <div class="composer-content">
      <div class="composer-text">
        <h2 class="section-title">Composer votre pâtisserie</h2>
        <p class="section-description">
          Créez la pâtisserie de vos rêves en choisissant parmi une variété d'ingrédients et de
          saveurs. Laissez libre cours à votre imagination et personnalisez chaque détail pour une
          expérience unique.
        </p>
        <router-link to="/composer" class="section-link">Commencer à composer</router-link>
      </div>
      <div class="carousel">
        <img :src="currentImage" alt="Pâtisserie" class="carousel-image" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const images = [
  new URL('@/assets/images/ImgCompo1.png', import.meta.url).href,
  new URL('@/assets/images/ImgCompo2.png', import.meta.url).href,
  new URL('@/assets/images/ImgCompo3.png', import.meta.url).href,
  new URL('@/assets/images/ImgCompo4.png', import.meta.url).href,
  new URL('@/assets/images/ImgCompo5.png', import.meta.url).href,
]
const currentImage = ref(images[0])
let intervalId: number | undefined

onMounted(() => {
  let index = 0
  intervalId = setInterval(() => {
    index = (index + 1) % images.length
    currentImage.value = images[index]
  }, 3000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
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
  background-color: var(--accent-color);
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  border-radius: 0.5rem;
  transition:
    background-color 0.3s,
    transform 0.2s;
  font-family: 'Roboto', sans-serif;
}
.section-link:hover {
  background-color: var(--accent-color);
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
@media (max-width: 900px) {
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
