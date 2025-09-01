<template>
  <section>
    <h2 class="title">{{ title }}</h2>
    
    <div v-if="previewUrl" class="mobile-preview">
      <img :src="previewUrl" alt="Prévisualisation" class="preview-img" />
    </div>
    
    <div class="cta-list">
      <button
        v-for="g in items"
        :key="g.id"
        class="cta"
        :class="{ selected: selectedId === g.id }"
        @click="$emit('select', g)"
      >
        {{ g.nom }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Item } from '../types'
defineProps<{ title: string; items: Item[]; selectedId?: string; previewUrl?: string }>()
defineEmits<{ select: [Item] }>()
</script>

<style scoped>
.title { 
  font-family: var(--font-family-title); 
  color: var(--teal-color); 
  font-size: 1.4rem; 
  margin: 1rem 0; 
}

.cta-list { 
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: 1rem; 
  max-width: 600px;
  margin: 0 auto;
}

.cta { 
  background: #fff; 
  border: 1.5px solid #e0e0e0; 
  border-radius: 8px; 
  padding: 1rem; 
  font-weight: 700; 
  text-align: center; 
  font-size: 0.95rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
  width: 100%;
}

.cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.cta.selected { 
  outline: 3px solid var(--accent-color); 
  background: rgba(60,60,60,0.45); 
  color: #fff; 
}

.mobile-preview {
  display: none;
  margin-bottom: 0.8rem;
  text-align: center;
}

.mobile-preview .preview-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .cta-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
    max-width: none;
  }
  
  .mobile-preview {
    display: block;
  }
}

@media (max-width: 480px) {
  .cta-list {
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }
}
</style>
