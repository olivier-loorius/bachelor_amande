<template>
  <div class="page-container">
    <main class="content-container composer-content">
      <div class="composer-card card">
        <h1 class="section-title">Actualités</h1>
        
        <section class="composer-section">
          <div class="section-desc">
            <p>Retrouvez ici toutes les actualités, recettes exclusives et événements gourmands de la pâtisserie Amande.</p>
          </div>
          
          <div class="actualite-grid">
            <article 
              v-for="article in articles" 
              :key="article.title" 
              class="actualite-card"
            >
              <div class="actualite-image-wrapper">
                <img 
                  :src="article.image" 
                  :alt="article.title" 
                  class="actualite-image" 
                  loading="lazy"
                />
              </div>
              <div class="actualite-content">
                <h2 class="actualite-title">{{ article.title }}</h2>
                <time class="actualite-date" :datetime="article.date">{{ article.date }}</time>
                <router-link
                  :to="{ name: 'not-found' }"
                  class="actualite-link"
                  aria-label="Lire l'article : {{ article.title }}"
                >
                  Lire l'article
                </router-link>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Articles d'actualité harmonisés avec le style de ComposerView
const articles = ref([
  {
    title: 'Les secrets des éclairs parfaits',
    image: new URL('@/assets/images/eclairs.jpg', import.meta.url).href,
    date: '25 mars 2025',
  },
  {
    title: 'Les tendances de la pâtisserie en 2025',
    image: new URL('@/assets/images/patisserie.jpg', import.meta.url).href,
    date: '20 mars 2025',
  },
  {
    title: "L'art de la pâte à sucre pour les gâteaux de mariage",
    image: new URL('@/assets/images/wedding-cake.jpg', import.meta.url).href,
    date: '15 mars 2025',
  },
  {
    title: 'Les meilleures recettes de macarons',
    image: new URL('@/assets/images/macaron.jpg', import.meta.url).href,
    date: '10 mars 2025',
  },
  {
    title: 'Le phénomène des gâteaux à thème',
    image: new URL('@/assets/images/birthday.jpg', import.meta.url).href,
    date: '5 mars 2025',
  },
  {
    title: 'Comment créer une génoise légère et aérée',
    image: new URL('@/assets/images/genoise.jpg', import.meta.url).href,
    date: '28 févr. 2025',
  },
  {
    title: 'Les meilleurs conseils pour réussir une pâte feuilletée maison',
    image: new URL('@/assets/images/p%C3%A2te.jpg', import.meta.url).href,
    date: '20 févr. 2025',
  },
  {
    title: "L'importance du chocolat de qualité en pâtisserie",
    image: new URL('@/assets/images/chocolat.jpg', import.meta.url).href,
    date: '10 févr. 2025',
  },
])

function getArticleId(title: string) {
  // Associer un ID unique à chaque article (exemple simple basé sur l'ordre)
  const index = articles.value.findIndex((a) => a.title === title)
  return index >= 0 ? index + 1 : 1
}
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

.composer-card {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(180, 138, 120, 0.07);
  padding: 2rem 1.5rem;
  max-width: 900px;
  width: 100%;
  margin: 1.5rem 0;
  scroll-margin-top: 120px;
}

.composer-title {
  font-family: var(--font-family-title);
  font-size: 2rem;
  color: #90aeb0;
  text-align: center;
  margin-bottom: 1.5rem;
  letter-spacing: 1px;
}

.composer-section {
  margin-bottom: 1.5rem;
}

.composer-step-desc {
  font-family: var(--font-family-text);
  color: var(--text-color);
  font-size: 1rem;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  text-align: center;
}

.actualite-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.actualite-card {
  background: #fff;
  border-radius: 0.8rem;
  box-shadow: 0 2px 8px rgba(180, 138, 120, 0.06);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(180, 138, 120, 0.08);
  display: flex;
  flex-direction: column;
}

.actualite-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(180, 138, 120, 0.12);
  border-color: var(--accent-color);
}

.actualite-image-wrapper {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16/10;
}

.actualite-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.actualite-card:hover .actualite-image {
  transform: scale(1.03);
}

.actualite-content {
  padding: 1.2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.actualite-title {
  font-family: var(--font-family-title);
  font-size: 1.1rem;
  color: var(--primary-color);
  margin: 0;
  line-height: 1.4;
  font-weight: 600;
}

.actualite-date {
  font-family: var(--font-family-text);
  font-size: 0.85rem;
  color: #888;
  font-style: italic;
}

.actualite-link {
  display: inline-block;
  color: var(--accent-color);
  text-decoration: none;
  font-family: var(--font-family-text);
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
  padding: 0.5rem 0;
  border-bottom: 1px solid transparent;
  margin-top: auto;
  align-self: flex-start;
}

.actualite-link:hover {
  border-bottom-color: var(--accent-color);
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .composer-card {
    padding: 1.2rem 1rem;
    margin: 1rem;
  }

  .composer-title {
    font-size: 1.6rem;
  }

  .actualite-grid {
    grid-template-columns: 1fr;
    gap: 1.2rem;
  }

  .actualite-content {
    padding: 1rem;
  }

  .actualite-title {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .actualite-grid {
    gap: 1rem;
  }

  .actualite-content {
    padding: 0.8rem;
  }

  .actualite-title {
    font-size: 0.95rem;
  }

  .actualite-link {
    font-size: 0.8rem;
  }
}
</style>
