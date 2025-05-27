<template>
  <div>
    <div class="actualite-container">
      <h1>Actualités</h1>
      <div v-if="articles.length" class="articles">
        <div v-for="(article, index) in articles" :key="index" class="article-card">
          <img :src="article.image" :alt="article.title" class="article-image" />
          <div class="article-content">
            <div class="content-wrapper">
              <div class="article-header">
                <h2>{{ article.title }}</h2>
                <span class="article-date">{{ formatDate(article.date) }}</span>
              </div>
              <p v-if="article.link" class="article-link">
                <a :href="article.link" target="_blank" rel="noopener noreferrer">Source</a>
              </p>
              <p>{{ article.excerpt }}</p>
              <p v-if="expandedArticle === index" class="full-content">{{ article.fullContent }}</p>
            </div>
            <button @click="toggleReadMore(index)" :aria-label="'Lire plus sur ' + article.title">
              {{ expandedArticle === index ? "Réduire" : "Lire plus" }}
            </button>
          </div>
        </div>
      </div>
      <p v-else>Aucun article disponible pour le moment.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      expandedArticle: null,
      articles: [
        {
          title: "Les secrets des éclairs parfaits",
          image: new URL("@/assets/images/eclairs.jpg", import.meta.url).href,
          excerpt: "Les éclairs sont l'un des plus grands classiques de la pâtisserie française. Mais comment réussir cet incontournable de la boulangerie ?",
          fullContent: "Pour réaliser des éclairs parfaits, il est important de maîtriser la pâte à choux, un élément essentiel. La cuisson doit être précise pour obtenir une texture légère et aérée. La garniture, souvent composée de crème pâtissière, peut être personnalisée selon les goûts. Ajoutez-y une touche de glaçage au chocolat ou au café, et vous aurez un éclair digne des plus grandes pâtisseries.",
          link: null,
          date: "2025-03-25",
        },
        {
          title: "Les tendances de la pâtisserie en 2025",
          image: new URL("@/assets/images/patisserie.jpg", import.meta.url).href,
          excerpt: "En 2025, la pâtisserie continue d'évoluer avec des influences modernes. Découvrez les nouvelles tendances à suivre cette année.",
          fullContent: "Les tendances de 2025 vont au-delà des classiques. On voit une montée en puissance des saveurs originales comme le yuzu ou le matcha, et une attention particulière à la réduction du sucre dans les créations. Les pâtissiers s'inspirent également des recettes de grands chefs pour créer des desserts à la fois beaux et surprenants. La présentation devient de plus en plus artistique, avec des pâtisseries qui ressemblent à des œuvres d'art.",
          link: null,
          date: "2025-03-20",
        },
        {
          title: "L'art de la pâte à sucre pour les gâteaux de mariage",
          image: new URL("@/assets/images/wedding-cake.jpg", import.meta.url).href,
          excerpt: "La pâte à sucre est l'un des éléments clés des gâteaux de mariage modernes. Apprenez à l'utiliser pour créer des designs époustouflants.",
          fullContent: "La pâte à sucre permet de donner un fini lisse et élégant aux gâteaux. Elle peut être modelée pour créer des fleurs, des motifs et même des sculptures en 3D. Pour l'utiliser correctement, il est essentiel d'avoir une surface propre et une pâte à sucre bien malaxée. L'ajout de colorants alimentaires permet de personnaliser les gâteaux selon le thème du mariage. Les techniques avancées incluent l'utilisation d'outils pour obtenir des textures et des formes précises.",
          link: "https://example.com/article3",
          date: "2025-03-15",
        },
        {
          title: "Les meilleures recettes de macarons",
          image: new URL("@/assets/images/macaron.jpg", import.meta.url).href,
          excerpt: "Les macarons sont une douceur emblématique, mais leur préparation peut être délicate. Découvrez les meilleures recettes pour réussir ces petites merveilles.",
          fullContent: "Pour réussir les macarons, il faut maîtriser la meringue italienne et le macaronnage. Le secret réside dans l'humidité et la précision de la cuisson. Il existe plusieurs variations de cette recette classique : macarons à la pistache, au chocolat, ou même au citron. Chaque macaron doit être parfaitement lisse à l'extérieur, avec une texture fondante à l'intérieur. Le choix de la garniture est crucial pour le goût, du chocolat au beurre de noisette.",
          link: null,
          date: "2025-03-10",
        },
        {
          title: "Le phénomène des gâteaux à thème",
          image: new URL("@/assets/images/birthday.jpg", import.meta.url).href,
          excerpt: "Les gâteaux à thème sont devenus une véritable tendance, en particulier pour les anniversaires et événements spéciaux. Découvrez pourquoi ils sont si populaires.",
          fullContent: "Les gâteaux à thème permettent d'exprimer la personnalité du client tout en offrant une expérience gustative unique. Que ce soit pour un mariage, un anniversaire ou une fête d'entreprise, ces gâteaux sont personnalisés pour correspondre au thème de l'événement. Ils peuvent être décorés avec des éléments comestibles ou des figurines. La pâtisserie devient ainsi un moyen de célébrer des moments particuliers de manière inoubliable.",
          link: "https://example.com/article5",
          date: "2025-03-05",
        },
        {
          title: "Comment créer une génoise légère et aérée",
          image: new URL("@/assets/images/genoise.jpg", import.meta.url).href,
          excerpt: "La génoise est la base de nombreux gâteaux, mais elle peut être difficile à réussir. Voici nos astuces pour obtenir une génoise parfaite.",
          fullContent: "Pour une génoise réussie, il est essentiel de battre les œufs et le sucre pendant longtemps, jusqu'à ce que le mélange devienne mousseux. La farine doit être incorporée délicatement pour ne pas casser la mousse. La cuisson doit être surveillée de près : une génoise trop cuite deviendra sèche, tandis qu'une génoise sous-cuite sera trop dense. Ce gâteau léger et aéré est la base parfaite pour des gâteaux à étages ou des bûches de Noël.",
          link: null,
          date: "2025-02-28",
        },
        {
          title: "Les meilleurs conseils pour réussir une pâte feuilletée maison",
          image: new URL("@/assets/images/pâte.jpg", import.meta.url).href,
          excerpt: "La pâte feuilletée maison est un véritable délice, mais elle demande du temps et de la patience. Voici comment réussir cette pâte délicate.",
          fullContent: "La pâte feuilletée est composée de plusieurs couches de pâte et de beurre. Pour la réussir, il faut faire des tours pour bien incorporer le beurre, et éviter que la pâte ne devienne trop chaude. Le secret est dans les pliages réguliers et le temps de repos pour que la pâte puisse bien lever à la cuisson. Les croissants, vol-au-vent et mille-feuilles sont des classiques réalisés à partir de cette pâte.",
          link: "https://example.com/article7",
          date: "2025-02-20",
        },
        {
          title: "L'importance du chocolat de qualité en pâtisserie",
          image: new URL("@/assets/images/chocolat.jpg", import.meta.url).href,
          excerpt: "Le chocolat est un ingrédient incontournable en pâtisserie. Découvrez pourquoi la qualité du chocolat est cruciale dans vos créations.",
          fullContent: "Le chocolat de qualité supérieure fait toute la différence dans vos recettes de pâtisserie. Qu'il soit utilisé dans des gâteaux, des mousses ou des truffes, un bon chocolat apporte une richesse de saveurs et une texture parfaite. Il est important de choisir un chocolat avec un pourcentage de cacao adapté à la recette. Le chocolat de couverture est particulièrement prisé des pâtissiers pour son éclat et sa fluidité, parfait pour les enrobages ou les ganaches.",
          link: null,
          date: "2025-02-10",
        },
      ],
    };
  },
  methods: {
    toggleReadMore(index) {
      this.expandedArticle = this.expandedArticle === index ? null : index;
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    }
  },
};
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables" as *;

.actualite-container {
  max-width: 1200px;
  width: 90%;
  margin: 5% auto 0;
  padding: 2rem;
  background: var(--secondary-color);
  color: var(--text-color);
  font-family: var(--font-family-text);
  border-radius: 10px;
}

h1 {
  font-family: var(--font-family-title);
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 2rem;
}

.articles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.article-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
  height: 100%;
}

.article-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  object-position: center;
}

.article-content {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  min-height: 300px;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.8rem;
}

.article-date {
  font-size: 0.9rem;
  color: var(--text-color-light);
  white-space: nowrap;
  margin-left: 1rem;
}

h2 {
  font-family: var(--font-family-title);
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  flex: 1;
}

.article-link a {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}

button {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  margin-top: auto;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s ease;
  align-self: flex-start;

  &:hover {
    background: var(--accent-color-dark);
  }
}

.full-content {
  margin-top: 1rem;
  color: var(--text-color);
}

/* Responsive */
@media (max-width: 768px) {
  .actualite-container {
    width: 95%;
    padding: 1rem;
  }
  
  .articles {
    grid-template-columns: 1fr;
  }
  
  .article-header {
    flex-direction: column;
  }
  
  .article-date {
    margin-left: 0;
    margin-top: 0.3rem;
    align-self: flex-start;
  }
  
  .article-image {
    height: 180px;
  }
  
  .article-content {
    min-height: 280px;
  }
}

@media (min-width: 1200px) {
  .article-image {
    height: 220px;
  }
}
</style>