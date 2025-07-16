<template>
  <div class="actualite-detail-bg">
    <div class="actualite-detail-container">
      <div class="actualite-detail-header">
        <div class="actualite-detail-thumbnail">
          <img :src="article.image" alt="Vignette" />
        </div>
        <div class="actualite-detail-meta">
          <h1 class="actualite-detail-title">{{ article.titre }}</h1>
          <div class="actualite-detail-date-link">
            <span class="actualite-detail-date">{{ formatDate(article.date) }}</span>
            <template v-if="article.lien">
              <a :href="article.lien" target="_blank" rel="noopener" class="actualite-detail-link"
                >Lien</a
              >
            </template>
          </div>
        </div>
      </div>
      <div class="actualite-detail-content" v-html="article.contenu"></div>
      <div class="actualite-detail-nav">
        <router-link :to="{ name: 'actualite' }" class="actualite-detail-back">
          ← Retour à la liste
        </router-link>
        <router-link
          v-if="nextId"
          :to="{ name: 'actualite-detail', params: { id: nextId } }"
          class="actualite-detail-next"
        >
          Article suivant →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

// Simulation d'une source d'articles (à remplacer par une vraie source ou API)
const articles = [
  {
    id: 1,
    titre: 'Nouveaux parfums de saison',
    date: '2025-05-20',
    lien: 'https://exemple.com/parfums',
    image: new URL('@/assets/images/chocolat.jpg', import.meta.url).href,
    contenu:
      '<p>Découvrez nos nouveaux parfums pour l’été : framboise, citron vert, et bien plus encore !</p>',
  },
  {
    id: 2,
    titre: 'Atelier pâtisserie enfants',
    date: '2025-05-28',
    lien: '',
    image: new URL('@/assets/images/genoise.jpg', import.meta.url).href,
    contenu:
      '<p>Participez à notre atelier spécial enfants le 15 juin. Inscriptions ouvertes !</p>',
  },
  // ...
]

const route = useRoute()
const id = Number(route.params.id)
const article = articles.find((a) => a.id === id) || articles[0]
const currentIndex = articles.findIndex((a) => a.id === id)
const nextId = computed(() => {
  if (currentIndex >= 0 && currentIndex < articles.length - 1) {
    return articles[currentIndex + 1].id
  }
  return null
})

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.actualite-detail-bg {
  background: url('@/assets/images/BGActualité.png') center/cover no-repeat;
  min-height: 100vh;
  width: 100vw;
  padding: 0;
}
.actualite-detail-container {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
}
.actualite-detail-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}
.actualite-detail-thumbnail {
  flex: 0 0 120px;
  width: 120px;
  height: 120px;
  border-radius: 1rem;
  overflow: hidden;
  background: #f3f3f3;
  display: flex;
  align-items: center;
  justify-content: center;
}
.actualite-detail-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.actualite-detail-meta {
  flex: 1 1 0;
  min-width: 200px;
}
.actualite-detail-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #2d2d2d;
}
.actualite-detail-date-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  color: #888;
}
.actualite-detail-link {
  color: #b48a78;
  text-decoration: underline;
  font-weight: 500;
}
.actualite-detail-content {
  font-size: 1.15rem;
  color: #3a3a3a;
  line-height: 1.7;
  margin-bottom: 2rem;
}
.actualite-detail-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.actualite-detail-back,
.actualite-detail-next {
  color: #b48a78;
  font-weight: 600;
  text-decoration: none;
  background: #fff6f2;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  transition: background 0.2s;
}
.actualite-detail-back:hover,
.actualite-detail-next:hover {
  background: #fbeee6;
}
@media (max-width: 600px) {
  .actualite-detail-container {
    padding: 1rem 0.5rem;
  }
  .actualite-detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .actualite-detail-thumbnail {
    width: 90px;
    height: 90px;
  }
  .actualite-detail-title {
    font-size: 1.3rem;
  }
}
</style>
