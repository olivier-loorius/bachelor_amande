<template>
  <section>
    <h2 class="title">1) Choisissez votre fond</h2>
     
    <div class="grid">
      <button
        v-for="(f, i) in fonds"
        :key="f.id"
        class="card"
        :class="{ selected: selectedId === f.id }"
        @click="$emit('select', { item: f, index: i })"
      >
        <div class="imgWrap">
          <img v-if="f.image" :src="f.image" :alt="f.nom" @error="hideImg" />
        </div>
        <div class="label">{{ f.nom }}</div>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Item } from '../types'
defineProps<{ fonds: Item[]; selectedId?: string }>()
defineEmits<{ select: [{ item: Item; index: number }] }>()
function hideImg(e: Event){ (e.target as HTMLImageElement).style.display='none' }

</script>

<style scoped>
.title{ 
  font-family:var(--font-family-title); 
  color:var(--teal-color); 
  font-size:1.4rem; 
  margin:1rem 0; 
}

.preview-section {
  margin: 1rem 0 1.5rem 0;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .preview-section {
    display: none;
  }
}

.grid{ 
  display:grid; 
  grid-template-columns: repeat(3, 1fr); 
  gap:1.5rem; 
  max-width: 600px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }
}

.card{ 
  border:1px solid #e0e0e0; 
  border-radius:12px; 
  padding:1rem; 
  background:#fff; 
  cursor:pointer; 
  text-align:center; 
  transition: transform .12s ease; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.card:hover{ 
  transform: translateY(-2px); 
}

.card.selected{ 
  border:3px solid var(--accent-color); 
}

.imgWrap{ 
  width:100%; 
  height:140px; 
  border-radius:8px; 
  overflow:hidden; 
  background:#fafafa; 
  display:flex; 
  align-items:center; 
  justify-content:center; 
}

@media (max-width: 768px) {
  .imgWrap {
    height: 100px;
  }
}

@media (max-width: 480px) {
  .imgWrap {
    height: 140px;
  }
}

.card img{ 
  width:100%; 
  height:100%; 
  object-fit:cover; 
  display:block; 
}

.label{ 
  margin-top:.8rem; 
  font-weight:600; 
  font-size: 0.95rem;
}

@media (max-width: 480px) {
  .label {
    font-size: 0.9rem;
    margin-top: 0.6rem;
  }
}
</style>
