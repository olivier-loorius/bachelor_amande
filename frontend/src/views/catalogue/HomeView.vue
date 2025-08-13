<template>
  <div class="home-page">
    <!-- Section Hero -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="hero-image"></div>
        <div class="hero-overlay"></div>
      </div>
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="hero-title-line">Découvrez Amande,</span>
            <span class="hero-title-line">L'art de la tartelette</span>
          </h1>
          <p class="hero-subtitle">En entrant chez Amande, vous devenez le créateur de vos envies. Laissez-vous porter par notre catalogue ou composez votre dessert unique. Ici, chaque client devient pâtissier le temps d'un clic.</p>
          
          <div class="hero-accroche">
            <div class="chef-quote">
              <p>"En pensant ce concept, j'ai voulu par mon expérience, mon respect et la qualité des produits emmener le client au cœur de la conception et le laisser libre de sa création, tout en lui assurant un service et des produits de saison et de qualité. Bonne dégustation."</p>
              <span class="chef-signature">- Le Chef Amande</span>
            </div>
          </div>
          
          <div class="hero-actions">
            <router-link to="/composer" class="btn btn-primary btn-hero">
              Composer mes tartelettes
            </router-link>
            <router-link to="/catalogue" class="btn btn-secondary btn-hero">
              Voir le catalogue
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Actualités -->
    <section class="news-section">
      <div class="container">
        <div class="section-header">
          <h2>Actualités</h2>
          <p>Retrouvez ici toutes les actualités, recettes exclusives et événements gourmands de la pâtisserie Amande. Notre chef sélectionne avec soin les meilleures techniques, les tendances culinaires et les secrets de fabrication pour vous offrir une expérience pâtissière unique. Découvrez nos conseils d'expert, nos recettes signature et les dernières innovations qui font la réputation d'Amande.</p>
        </div>
        
        <div class="news-slider-container">
          <div class="news-slider">
            <div class="news-slide" :class="{ active: currentSlide === 0 }">
              <div class="slide-image">
                <img src="@/assets/images/macaron.jpg" alt="Les meilleures recettes de macarons" />
              </div>
              <div class="slide-content">
                <h3>Les meilleures recettes de macarons</h3>
                <p>Découvrez nos secrets pour des macarons parfaits, légers et délicieux.</p>
                <router-link to="/actualite" class="slide-link">Lire l'article</router-link>
              </div>
            </div>
            
            <div class="news-slide" :class="{ active: currentSlide === 1 }">
              <div class="slide-image">
                <img src="@/assets/images/birthday.jpg" alt="Le phénomène des gâteaux à thème" />
              </div>
              <div class="slide-content">
                <h3>Le phénomène des gâteaux à thème</h3>
                <p>Comment créer des gâteaux personnalisés qui racontent votre histoire.</p>
                <router-link to="/actualite" class="slide-link">Lire l'article</router-link>
              </div>
            </div>
            
            <div class="news-slide" :class="{ active: currentSlide === 2 }">
              <div class="slide-image">
                <img src="@/assets/images/genoise.jpg" alt="Comment créer une génoise légère et aérée" />
              </div>
              <div class="slide-content">
                <h3>Comment créer une génoise légère et aérée</h3>
                <p>Nos techniques pour une génoise parfaite, base de nombreux desserts.</p>
                <router-link to="/actualite" class="slide-link">Lire l'article</router-link>
              </div>
            </div>
          </div>
          
          <div class="slider-indicators">
            <button 
              v-for="(slide, index) in 3" 
              :key="index"
              @click="goToSlide(index)"
              class="indicator"
              :class="{ active: currentSlide === index }"
              :aria-label="`Aller au slide ${index + 1}`"
            ></button>
          </div>
        </div>
        
        <div class="news-cta">
          <router-link to="/actualite" class="btn btn-primary">
            Voir toutes les actualités
          </router-link>
        </div>
      </div>
    </section>

    <!-- Section Catalogue -->
    <section class="catalogue-section">
      <div class="container">
        <div class="section-header">
          <h2>Notre Catalogue</h2>
          <p>Découvrez notre sélection de tartelettes et desserts artisanaux, créés avec passion et des ingrédients d'exception. Chaque création est le fruit d'un savoir-faire traditionnel et d'une créativité moderne.</p>
        </div>
        
        <div class="catalogue-grid">
          <div class="catalogue-card desktop-only">
            <div class="catalogue-image">
              <img src="@/assets/images/macaron.jpg" alt="Tartelettes classiques" />
              <div class="catalogue-overlay">
                <h3 class="catalogue-title">Tartelettes Classiques</h3>
                <router-link to="/catalogue" class="catalogue-link">Voir</router-link>
              </div>
            </div>
          </div>
          
          <div class="catalogue-card desktop-only">
            <div class="catalogue-image">
              <img src="@/assets/images/birthday.jpg" alt="Créations personnalisées" />
              <div class="catalogue-overlay">
                <h3 class="catalogue-title">Créations Personnalisées</h3>
                <router-link to="/catalogue" class="catalogue-link">Voir</router-link>
              </div>
            </div>
          </div>
          
          <div class="catalogue-card desktop-only">
            <div class="catalogue-image">
              <img src="@/assets/images/genoise.jpg" alt="Desserts de saison" />
              <div class="catalogue-overlay">
                <h3 class="catalogue-title">Desserts de Saison</h3>
                <router-link to="/catalogue" class="catalogue-link">Voir</router-link>
              </div>
            </div>
          </div>
          
          <div class="catalogue-slider mobile-only">
            <div class="catalogue-slide" :class="{ active: currentCatalogueSlide === 0 }">
              <div class="catalogue-card">
                <div class="catalogue-image">
                  <img src="@/assets/images/macaron.jpg" alt="Tartelettes classiques" />
                  <div class="catalogue-overlay">
                    <h3 class="catalogue-title">Tartelettes Classiques</h3>
                    <router-link to="/catalogue" class="catalogue-link">Voir</router-link>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="catalogue-slide" :class="{ active: currentCatalogueSlide === 1 }">
              <div class="catalogue-card">
                <div class="catalogue-image">
                  <img src="@/assets/images/birthday.jpg" alt="Créations personnalisées" />
                  <div class="catalogue-overlay">
                    <h3 class="catalogue-title">Créations Personnalisées</h3>
                    <router-link to="/catalogue" class="catalogue-link">Voir</router-link>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="catalogue-slide" :class="{ active: currentCatalogueSlide === 2 }">
              <div class="catalogue-card">
                <div class="catalogue-image">
                  <img src="@/assets/images/genoise.jpg" alt="Desserts de saison" />
                  <div class="catalogue-overlay">
                    <h3 class="catalogue-title">Desserts de Saison</h3>
                    <router-link to="/catalogue" class="catalogue-link">Voir</router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="catalogue-slider-nav">
          <button 
            @click="prevCatalogueSlide" 
            class="catalogue-nav-btn catalogue-nav-prev"
            aria-label="Catalogue précédent"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <div class="catalogue-indicators">
            <button 
              v-for="(slide, index) in 3" 
              :key="index"
              @click="goToCatalogueSlide(index)"
              class="catalogue-indicator"
              :class="{ active: currentCatalogueSlide === index }"
              :aria-label="`Aller au catalogue ${index + 1}`"
            ></button>
          </div>
          
          <button 
            @click="nextCatalogueSlide" 
            class="catalogue-nav-btn catalogue-nav-next"
            aria-label="Catalogue suivant"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div class="catalogue-cta">
          <router-link to="/catalogue" class="btn btn-primary">
            Voir tout le catalogue
          </router-link>
        </div>
      </div>
    </section>

    <!-- Section CTA -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">
            <span>Prêt à créer</span>
            <span>vos tartelettes ?</span>
          </h2>
          <p class="cta-subtitle">Découvrez notre catalogue complet et commencez votre composition</p>
          <div class="cta-actions">
            <router-link to="/catalogue" class="btn btn-primary btn-cta">
              Explorer le catalogue
            </router-link>
            <router-link to="/composer" class="btn btn-secondary btn-cta">
              Commencer à composer
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const currentSlide = ref(0)
const totalSlides = 3
let autoSlideInterval: NodeJS.Timeout | null = null

const currentCatalogueSlide = ref(0)
const totalCatalogueSlides = 3

const goToSlide = (index: number) => {
  currentSlide.value = index
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % totalSlides
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + totalSlides) % totalSlides
}

const goToCatalogueSlide = (index: number) => {
  currentCatalogueSlide.value = index
}

const nextCatalogueSlide = () => {
  currentCatalogueSlide.value = (currentCatalogueSlide.value + 1) % totalCatalogueSlides
}

const prevCatalogueSlide = () => {
  currentCatalogueSlide.value = (currentCatalogueSlide.value - 1 + totalCatalogueSlides) % totalCatalogueSlides
}

const startAutoSlide = () => {
  autoSlideInterval = setInterval(() => {
    nextSlide()
  }, 4000)
}

const stopAutoSlide = () => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
    autoSlideInterval = null
  }
}

onMounted(() => {
  startAutoSlide()
})

onUnmounted(() => {
  stopAutoSlide()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  background-size: 400% 400%;
  animation: gradientShift 12s ease infinite;
}

.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/HeroBanner.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  animation: imageZoom 20s ease-in-out infinite;
  filter: brightness(0.7) contrast(1.1);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: #fff;
  max-width: 900px;
  padding: 0 1.5rem;
}

.hero-title {
  font-family: var(--font-family-title);
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  line-height: 1.1;
}

.hero-title-line {
  display: block;
  animation: fadeInUp 1s ease-out;
}

.hero-title-line:nth-child(2) {
  animation-delay: 0.2s;
  animation-fill-mode: both;
}

.hero-subtitle {
  font-family: var(--font-family-text);
  font-size: 1.4rem;
  margin-bottom: 3rem;
  opacity: 0.95;
  animation: fadeInUp 1s ease-out 0.4s both;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-accroche {
  margin-bottom: 3rem;
  animation: fadeInUp 1s ease-out 0.6s both;
}

.chef-quote {
  font-family: var(--font-family-text);
  font-size: 1.2rem;
  color: #fff;
  opacity: 0.9;
  line-height: 1.8;
  position: relative;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.chef-quote p {
  margin-bottom: 1rem;
}

.chef-signature {
  display: block;
  text-align: right;
  font-style: italic;
  font-size: 0.9rem;
  color: #fff;
  opacity: 0.8;
  margin-top: 1rem;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 1s ease-out 0.6s both;
  margin-bottom: 4rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.btn-hero {
  padding: 1.2rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 12px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  white-space: nowrap;
  min-width: fit-content;
  box-sizing: border-box;
}

.btn-hero:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.section-header h2 {
  font-family: var(--font-family-title);
  font-size: 2.5rem;
  color: var(--text-color);
  margin-bottom: 1.5rem;
  text-align: center;
}

.section-header p {
  font-family: var(--font-family-text);
  font-size: 1.1rem;
  color: var(--text-color);
  opacity: 0.9;
  line-height: 1.7;
  text-align: center;
}

.news-section {
  padding: 5rem 0;
  background: #fff;
}

.news-slider-container {
  position: relative;
  width: 100%;
  max-width: 900px;
  margin: 0 auto 3rem;
  height: 400px;
  overflow: hidden;
}

.news-slider {
  position: relative;
  width: 100%;
  height: 100%;
}

.news-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: row;
}

.news-slide.active {
  opacity: 1;
  z-index: 1;
}

.slide-image {
  width: 66.66%;
  height: 100%;
  overflow: hidden;
}

.slide-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.news-slide:hover .slide-image img {
  transform: scale(1.05);
}

.slide-content {
  width: 33.33%;
  padding: 2.5rem;
  text-align: left;
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(135deg, #fff 0%, #f8f8f8 100%);
}

.slide-content h3 {
  font-family: var(--font-family-title);
  font-size: 1.6rem;
  color: var(--text-color);
  margin-bottom: 1rem;
  line-height: 1.3;
}

.slide-content p {
  font-family: var(--font-family-text);
  color: var(--text-color);
  opacity: 0.8;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.slide-link {
  display: inline-block;
  color: var(--accent-color);
  font-family: var(--font-family-text);
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0;
  border-radius: 0;
  align-self: flex-start;
  border-bottom: 2px solid transparent;
}

.slide-link:hover {
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
  transform: none;
  box-shadow: none;
}

.slider-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ccc;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator:hover {
  background-color: var(--accent-color);
  transform: scale(1.2);
}

.indicator.active {
  background-color: var(--accent-color);
  transform: scale(1.1);
}

.news-cta {
  text-align: center;
  margin-top: 2rem;
}

.news-cta .btn {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: transparent;
  color: var(--accent-color);
  border: 2px solid var(--accent-color);
}

.news-cta .btn:hover {
  background: var(--accent-color);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.catalogue-section {
  padding: 5rem 0;
  background: #fff;
}

.catalogue-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  position: relative;
}

.catalogue-slider {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.catalogue-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.catalogue-slide.active {
  opacity: 1;
  z-index: 1;
}

.catalogue-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.catalogue-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.catalogue-image {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.catalogue-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.catalogue-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  color: #fff;
  text-align: left;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.catalogue-card:hover .catalogue-overlay {
  opacity: 1;
}

.catalogue-title {
  font-family: var(--font-family-title);
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.catalogue-link {
  display: inline-block;
  color: #fff;
  font-family: var(--font-family-text);
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  white-space: nowrap;
}

.catalogue-link:hover {
  background: rgba(255, 255, 255, 0.9);
  color: var(--primary-color);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.catalogue-cta {
  text-align: center;
  margin-top: 3rem;
}

.catalogue-cta .btn {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: transparent;
  color: var(--accent-color);
  border: 2px solid var(--accent-color);
}

.catalogue-cta .btn:hover {
  background: var(--accent-color);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.catalogue-slider-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 0 1rem;
  position: relative;
  z-index: 10;
}

.catalogue-nav-btn {
  background: none;
  border: none;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--accent-color);
  justify-self: center;
}

.catalogue-nav-btn.desktop-only {
  display: flex;
}

.catalogue-nav-btn:hover {
  color: var(--primary-color);
  transform: scale(1.1);
}

.catalogue-nav-btn svg {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-width: 3;
}

.catalogue-indicators {
  display: flex;
  gap: 8px;
  align-items: center;
}

.catalogue-indicator {
  position: relative;
  width: 12px;
  height: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  display: inline-block;
  border: none;
  background: none;
  padding: 0;
}

.catalogue-indicator::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  border: 2px solid var(--accent-color);
  transition: all 0.3s ease;
}

.catalogue-indicator:hover::before {
  background-color: var(--accent-color);
  transform: scale(1.2);
}

.catalogue-indicator.active::before {
  background-color: var(--accent-color);
  transform: scale(1.1);
  border-color: var(--accent-color);
}

.desktop-only {
  display: block;
}

.mobile-only {
  display: none;
}

.catalogue-slider {
  display: none;
}

.catalogue-slide {
  display: none;
}

.catalogue-slider-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 0 1rem;
  position: relative;
  z-index: 10;
}

.cta-section {
  position: relative;
  padding: 6rem 0;
  color: #fff;
  overflow: hidden;
  background: #fff;
}

.cta-background {
  display: none;
}

.cta-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  animation: patternFloat 25s ease-in-out infinite reverse;
}

.cta-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
}

.cta-inner {
  background: #90aeb0;
  padding: 4rem 1.5rem;
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 3;
  overflow: hidden;
  box-sizing: border-box;
}

.cta-content {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.cta-title {
  font-family: var(--font-family-title);
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.cta-title-line {
  display: block;
  animation: fadeInUp 1s ease-out;
}

.cta-title-line:nth-child(2) {
  animation-delay: 0.2s;
  animation-fill-mode: both;
}

.cta-subtitle {
  font-family: var(--font-family-text);
  font-size: 1.3rem;
  margin-bottom: 3rem;
  opacity: 0.95;
  animation: fadeInUp 1s ease-out 0.4s both;
}

.cta-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 1s ease-out 0.6s both;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.btn-cta {
  padding: 1.2rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 12px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  white-space: nowrap;
  min-width: fit-content;
  box-sizing: border-box;
}

.btn-cta:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-family: var(--font-family-text);
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: var(--accent-color);
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary:hover {
  background: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: transparent;
  color: #fff;
  border: 2px solid #fff;
}

.btn-secondary:hover {
  background: #fff;
  color: var(--primary-color);
  transform: translateY(-2px);
}

.btn svg {
  width: 20px;
  height: 20px;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes imageZoom {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes patternFloat {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(1deg); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
  40% { transform: translateX(-50%) translateY(-10px); }
  60% { transform: translateX(-50%) translateY(-5px); }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.8rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
    padding: 0 1rem;
    width: 100%;
    gap: 1rem;
  }

  .btn-hero {
    width: 100%;
    max-width: 280px;
    justify-content: center;
    margin: 0.5rem 0;
    text-align: center;
  }

  .cta-title {
    font-size: 2.5rem;
  }

  .cta-subtitle {
    font-size: 1.1rem;
  }

  .cta-actions {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
    max-width: 100%;
  }

  .btn-cta {
    width: 100%;
    max-width: 250px;
    justify-content: center;
    padding: 1rem 1.5rem;
    font-size: 0.95rem;
    white-space: normal;
    text-align: center;
  }

  .news-slider-container {
    max-width: 400px;
    height: 380px;
    margin: 0 auto;
    overflow: hidden;
  }

  .news-slider {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .news-slide {
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .slide-image {
    width: 100%;
    height: 65%;
  }

  .slide-content {
    width: 100%;
    height: 35%;
    padding: 1.5rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    box-sizing: border-box;
  }

  .slide-content h3 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    width: 100%;
    text-align: center;
  }

  .slide-content p {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    flex-grow: 1;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    line-height: 1.4;
    width: 100%;
    text-align: center;
  }

  .slide-link {
    align-self: center;
    padding: 0.6rem 1.2rem;
    font-size: 0.8rem;
    margin-top: auto;
  }

  .section-header h2 {
    font-size: 2rem;
  }

  .catalogue-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    position: relative;
    overflow: hidden;
    align-items: stretch;
  }

  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: block;
  }

  .catalogue-slider {
    display: block;
    width: 100%;
    height: 250px;
    overflow: hidden;
  }

  .catalogue-slide {
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
  }

  .catalogue-slide.active {
    opacity: 1;
    z-index: 1;
  }

  .catalogue-card {
    height: 100%;
    min-width: 100%;
    transition: transform 0.3s ease;
  }

  .catalogue-slider-nav {
    display: flex !important;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
    padding: 0 0.5rem;
    position: relative;
    z-index: 10;
  }

  .catalogue-nav-btn {
    width: 40px;
    height: 40px;
    background: var(--accent-color);
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    position: static;
    transform: none;
  }

  .catalogue-nav-btn.desktop-only {
    display: none;
  }

  .catalogue-nav-btn:hover {
    background: var(--primary-color);
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .catalogue-nav-btn svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
  }

  .catalogue-indicators {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .catalogue-indicator {
    position: relative;
    width: 8px;
    height: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    flex-shrink: 0;
    display: inline-block;
    border: none;
    background: none;
    padding: 0;
  }

  .catalogue-indicator::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.4);
    border: 2px solid var(--accent-color);
    transition: all 0.3s ease;
  }

  .catalogue-indicator:hover::before {
    background-color: var(--accent-color);
    transform: scale(1.2);
  }

  .catalogue-indicator.active::before {
    background-color: var(--accent-color);
    transform: scale(1.1);
    border-color: var(--accent-color);
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2.2rem;
  }

  .hero-content {
    padding: 0 1rem;
  }

  .hero-actions {
    padding: 0 0.5rem;
  }

  .btn-hero {
    max-width: 260px;
    font-size: 1rem;
    padding: 1rem 1.5rem;
  }

  .cta-inner {
    padding: 2.5rem 0.8rem;
  }

  .cta-title {
    font-size: 2.2rem;
  }

  .cta-subtitle {
    font-size: 1rem;
  }

  .btn-cta {
    max-width: 200px;
    padding: 0.8rem 1rem;
    font-size: 0.85rem;
  }

  .container {
    padding: 0 1rem;
  }

  .news-slider-container {
    height: 400px;
    max-width: 350px;
  }

  .slide-content {
    padding: 0.8rem;
  }

  .slide-content h3 {
    font-size: 1rem;
    line-height: 1.2;
  }

  .slide-content p {
    font-size: 0.75rem;
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  .slide-link {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }

  .news-content {
    padding: 1.2rem;
  }

  .news-content h3 {
    font-size: 1.2rem;
  }
}

@media (max-width: 320px) {
  .news-slider-container {
    max-width: 300px;
  }

  .slide-content {
    padding: 0.6rem;
  }

  .slide-content h3 {
    font-size: 0.9rem;
    line-height: 1.1;
  }

  .slide-content p {
    font-size: 0.7rem;
    line-height: 1.1;
  }

  .slide-link {
    padding: 0.4rem 0.8rem;
    font-size: 0.7rem;
  }

  .cta-inner {
    padding: 2.5rem 1rem;
  }

  .cta-title {
    font-size: 2.2rem;
  }

  .cta-subtitle {
    font-size: 1rem;
  }

  .btn-cta {
    max-width: 240px;
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }

  .catalogue-nav-btn {
    width: 36px;
    height: 36px;
    background: var(--accent-color);
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .catalogue-nav-btn:hover {
    background: var(--primary-color);
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .catalogue-nav-btn svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
  }

  .catalogue-indicators {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .catalogue-indicator {
    position: relative;
    width: 8px;
    height: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    flex-shrink: 0;
    display: inline-block;
    border: none;
    background: none;
    padding: 0;
  }

  .catalogue-indicator::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.4);
    border: 2px solid var(--accent-color);
    transition: all 0.3s ease;
  }

  .catalogue-indicator:hover::before {
    background-color: var(--accent-color);
    transform: scale(1.2);
  }

  .catalogue-indicator.active::before {
    background-color: var(--accent-color);
    transform: scale(1.1);
    border-color: var(--accent-color);
  }
}
</style>
