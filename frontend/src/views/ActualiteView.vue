<template>
  <div class="page-container">
    <main class="content-container actualite-content">
      <div class="actualite-card">
        <div class="actualite-header">
          <h1 class="actualite-title">Actualités</h1>
          <p class="actualite-intro">
            Retrouvez ici toutes les actualités, recettes exclusives et événements gourmands de la
            pâtisserie Amande.
          </p>
        </div>
        <div class="actualite-list">
          <div class="actualite-item" v-for="article in articles" :key="article.title">
            <img :src="article.image" :alt="article.title" class="actualite-img" />
            <div class="actualite-content">
              <h2 class="article-title">{{ article.title }}</h2>
              <p class="article-date">{{ article.date }}</p>
              <router-link
                :to="{ name: 'actualite-detail', params: { id: getArticleId(article.title) } }"
                class="actualite-link"
                >En savoir plus</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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
.actualite-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.actualite-card {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(180, 138, 120, 0.07);
  padding: 2.5rem 2rem;
  max-width: 800px;
  width: 100%;
  margin: 2rem 0;
}
.actualite-header {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  padding: 2.5rem 2rem 2rem 2rem;
  margin-bottom: 2.5rem;
  text-align: center;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}
.actualite-title {
  font-size: 2.2rem;
  font-family: 'Roboto', sans-serif;
  color: var(--primary-color, #4a4a4a);
  margin-bottom: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}
.actualite-intro {
  font-size: 1.1rem;
  color: var(--text-color, #333);
  margin-bottom: 0;
  line-height: 1.6;
}
.actualite-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
}
.actualite-item {
  background: #fff;
  border-radius: 0.7rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s;
}
.actualite-item:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.13);
}
.actualite-img {
  width: 100%;
  height: 220px;
  object-fit: cover;
}
.actualite-content {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.article-title {
  font-size: 1.15rem;
  font-family: 'Roboto', sans-serif;
  color: var(--primary-color, #4a4a4a);
  margin-bottom: 0.5rem;
  font-weight: bold;
}
.article-date {
  font-size: 1rem;
  color: #888;
  margin-bottom: 1rem;
}
.actualite-link {
  display: inline-block;
  margin: 0.5rem auto 0 auto;
  background: var(--accent-color, #ff6f61);
  color: #fff;
  padding: 0.13rem 0.6rem;
  border-radius: 0.4rem;
  text-decoration: none;
  font-family: 'Roboto', sans-serif;
  font-size: 0.89rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  transition: background 0.2s;
  min-width: unset;
  width: auto;
  text-align: center;
}
.actualite-link:hover {
  background: var(--accent-color-light, #ffa07a);
}
@media (max-width: 640px) {
  .actualite-card {
    padding: 1.2rem 0.5rem;
    margin: 1rem 0;
  }
}
@media (max-width: 700px) {
  .actualite-header {
    padding: 1.2rem 0.7rem 1.2rem 0.7rem;
    border-radius: 0.7rem;
  }
  .actualite-view {
    padding: 1rem;
  }
  .actualite-list {
    gap: 1rem;
  }
  .actualite-img {
    height: 170px;
  }
}
</style>
