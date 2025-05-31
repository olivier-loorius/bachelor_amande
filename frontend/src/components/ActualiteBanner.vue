<template>
  <section class="actualite-banner-section">
    <div class="actualite-banner-content">
      <h2 class="actualite-banner-title">Actualités</h2>
      <p class="actualite-banner-intro">
        Découvrez nos dernières actualités, recettes exclusives et événements gourmands.<br />
        Restez informé(e) de toutes les nouveautés de la pâtisserie Amande !
      </p>
      <router-link to="/actualite" class="actualite-banner-cta">Voir toutes les actualités</router-link>
      <div class="actualite-banner-slider">
        <button class="chevron chevron-left" @click="prevSlide" aria-label="Précédent">
          <span>&lt;</span>
        </button>
        <div class="actualite-banner-slide">
          <img :src="slides[currentIndex].image" :alt="slides[currentIndex].title" class="actualite-banner-img" />
          <div class="actualite-banner-overlay">
            <h3 class="actualite-banner-article-title">{{ slides[currentIndex].title }}</h3>
            <router-link :to="{ name: 'actualite', query: { highlight: slides[currentIndex].title } }" class="actualite-banner-link">En savoir plus</router-link>
          </div>
        </div>
        <button class="chevron chevron-right" @click="nextSlide" aria-label="Suivant">
          <span>&gt;</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const slides = [
  {
    title: 'Les meilleures recettes de macarons',
    image: new URL('@/assets/images/macaron.jpg', import.meta.url).href,
  },
  {
    title: 'Le phénomène des gâteaux à thème',
    image: new URL('@/assets/images/birthday.jpg', import.meta.url).href,
  },
  {
    title: 'Comment créer une génoise légère et aérée',
    image: new URL('@/assets/images/genoise.jpg', import.meta.url).href,
  },
]
const currentIndex = ref(0)
function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % slides.length
}
function prevSlide() {
  currentIndex.value = (currentIndex.value - 1 + slides.length) % slides.length
}
</script>

<style scoped>
.actualite-banner-section {
  width: 100%;
  background: url('@/assets/images/BGActualité.png') center/cover no-repeat;
  padding: 4rem 0;
  display: flex;
  justify-content: center;
}
.actualite-banner-content {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  padding: 2.5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}
.actualite-banner-title {
  font-size: 2rem;
  font-family: 'Roboto', sans-serif;
  color: var(--primary-color, #4a4a4a);
  margin-bottom: 1.2rem;
  font-weight: 700;
}
.actualite-banner-intro {
  font-size: 1.1rem;
  color: var(--text-color, #333);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}
.actualite-banner-cta {
  display: inline-block;
  background: var(--accent-color, #ff6f61);
  color: #fff;
  padding: 0.5rem 1.2rem;
  border-radius: 0.4rem;
  text-decoration: none;
  font-family: 'Roboto', sans-serif;
  font-size: 1.05rem;
  font-weight: 500;
  transition: background 0.2s;
  margin-bottom: 1.5rem;
}
.actualite-banner-cta:hover {
  background: var(--accent-color-light, #ffa07a);
}
.actualite-banner-slider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  width: 100%;
}
.actualite-banner-slide {
  width: 100%;
  max-width: 540px;
  aspect-ratio: 16/9;
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}
.actualite-banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(0.25) brightness(1.08);
  opacity: 0.85;
  transition: filter 0.2s, opacity 0.2s;
}
.actualite-banner-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.92);
  padding: 0.7rem 1rem 0.5rem 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}
.actualite-banner-article-title {
  font-size: 1.18rem;
  font-family: 'Roboto', sans-serif;
  color: var(--primary-color, #4a4a4a);
  font-weight: 700;
  margin: 0 0 0.2rem 0;
  letter-spacing: 0.01em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.actualite-banner-link {
  display: inline-block;
  margin-top: 0.1rem;
  background: var(--accent-color, #ff6f61);
  color: #fff;
  padding: 0.09rem 0.6rem;
  border-radius: 0.3rem;
  text-decoration: none;
  font-family: 'Roboto', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  opacity: 0.85;
  transition: background 0.2s, opacity 0.2s;
}
.actualite-banner-link:hover {
  background: var(--accent-color-light, #ffa07a);
  opacity: 1;
}
.chevron {
  background: none;
  border: none;
  color: var(--accent-color, #ff6f61);
  font-size: 2.5rem;
  cursor: pointer;
  padding: 0 1.2rem;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  height: 100%;
  user-select: none;
}
.chevron:hover {
  color: var(--accent-color-light, #ffa07a);
}
@media (max-width: 900px) {
  .actualite-banner-content {
    max-width: 100%;
    padding: 1.2rem 0.7rem;
    border-radius: 0.7rem;
  }
  .actualite-banner-slide {
    max-width: 98vw;
    aspect-ratio: 16/10;
  }
  .chevron {
    font-size: 2rem;
    padding: 0.5rem 0;
  }
}
</style>