<template>
  <section class="product-step">
    <h3>{{ step }}. {{ title }}</h3>
    <p class="desc">{{ description }}</p>

    <div class="product-grid">
      <div v-for="(product, i) in products" :key="i" class="product-card">
        <!-- Nom -->
        <input
          type="text"
          v-model="product.nom"
          :placeholder="`Nom du produit ${i+1}`"
          :disabled="locked && locked[i]"
          @input="(event) => $emit('nomChange', startIndex + i, (event.target as HTMLInputElement).value)"
        />

        <!-- Upload(s) -->
        <div class="upload-container">
          <ImageUpload
            v-for="n in imagesCount"
            :key="n"
            :locked="locked && locked[i]"
            :src="getImageSrc(product, n-1)"
            :alt="`${product.nom || 'Produit'} - Image ${n}`"
            @upload="$emit('upload', { productIndex: startIndex + i, imageIndex: n-1, file: $event })"
            @remove="$emit('remove', { productIndex: startIndex + i, imageIndex: n-1 })"
          />
        </div>

        <!-- Actions -->
        <div class="actions">
          <!-- Bouton verrouiller/déverrouiller -->
          <button 
            class="action-btn lock-btn" 
            :class="{ 'unlocked': !(locked && locked[i]) }"
            @click="$emit('toggleLock', startIndex + i)"
            :title="(locked && locked[i]) ? 'Déverrouiller' : 'Verrouiller'"
          >
            <i class="fas" :class="(locked && locked[i]) ? 'fa-lock' : 'fa-unlock'"></i>
          </button>
          
          <!-- Bouton save (visible seulement si déverrouillé) -->
          <button 
            v-if="!(locked && locked[i])"
            class="action-btn save-btn" 
            @click="$emit('save', startIndex + i)"
            title="Sauvegarder"
          >
            <i class="fas fa-save"></i>
          </button>
          
          <!-- Bouton reset (visible seulement si déverrouillé) -->
          <button 
            v-if="!(locked && locked[i])"
            class="action-btn reset-btn" 
            @click="$emit('reset', startIndex + i)"
            title="Remettre à zéro"
          >
            <i class="fas fa-undo"></i>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import ImageUpload from './ImageUpload.vue'
import { onMounted } from 'vue'

// Interface pour typer les produits
interface Product {
  nom: string
  images: string[]
  locked: boolean
}

const props = defineProps({
  step: Number,
  title: String,
  description: String,
  products: {
    type: Array as () => Product[],
    required: true
  },
  locked: {
    type: Array as () => boolean[],
    required: true
  },
  imagesCount: {
    type: Number,
    default: 3
  },
  startIndex: {
    type: Number,
    default: 0
  }
})

defineEmits(['upload', 'remove', 'save', 'reset', 'toggleLock', 'nomChange'])

// Debug: vérifier le nombre de produits
onMounted(() => {
  console.log(`🔍 ProductStep ${props.step} - Nombre de produits:`, props.products?.length)
  console.log(`🔍 ProductStep ${props.step} - Produits:`, props.products)
})

// Fonction helper pour gérer la structure uniforme d'images
function getImageSrc(product: Product, imageIndex: number) {
  // Nouvelle structure uniforme : { nom: '', images: string[], locked: boolean }
  return product.images && product.images[imageIndex] ? product.images[imageIndex] : null
}
</script>

<style scoped>
.product-step {
  padding: 1rem;
  border-radius: 8px;
  background: #f8f9fa;
}

.product-step h3 {
  margin: 0 0 0.5rem 0;
  color: #383961;
  font-family: var(--font-family-title);
  font-size: 1.2rem;
}

.product-step .desc {
  margin: 0 0 1rem 0;
  color: #6c757d;
  font-family: var(--font-family-text);
  font-size: 0.9rem;
  line-height: 1.4;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.product-card {
  flex: 1 1 200px;
  border: 1px solid #e9ecef;
  padding: 1rem;
  border-radius: 8px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.product-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.product-card input[type="text"] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: var(--font-family-text);
  font-size: 0.9rem;
}

.product-card input[type="text"]:disabled {
  background: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

.product-card input[type="text"]:focus {
  outline: none;
  border-color: #383961;
  box-shadow: 0 0 0 2px rgba(56, 57, 97, 0.2);
}

.upload-container {
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.action-btn {
  font-family: var(--font-family-text);
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
}

.action-btn i {
  font-size: 1rem;
  color: white;
  /* Force l'affichage des icônes FontAwesome */
  display: inline-block !important;
  font-family: "Font Awesome 5 Free" !important;
  font-weight: 900 !important;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.action-btn:active {
  transform: translateY(0);
}

.lock-btn {
  background: #6c757d;
}

.lock-btn:hover {
  background: #5a6268;
}

.lock-btn.unlocked {
  background: #ffc107;
}

.lock-btn.unlocked:hover {
  background: #e0a800;
}

.save-btn {
  background: #28a745;
}

.save-btn:hover {
  background: #218838;
}

.reset-btn {
  background: #dc3545;
}

.reset-btn:hover {
  background: #c82333;
}
</style>
