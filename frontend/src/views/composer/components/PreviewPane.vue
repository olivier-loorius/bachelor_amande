<template>
  <aside class="preview">
    <img v-if="src" :src="src" alt="Prévisualisation" class="preview-img" @error="onError" />
    <div v-else class="preview-placeholder">Prévisualisation</div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{ src: string }>()
function onError(e: Event) { (e.target as HTMLImageElement).style.visibility = 'hidden' }
</script>

<style scoped>
.preview { 
  width: 100%; 
  border: 1px solid #e9ecef; 
  border-radius: 12px; 
  padding: 8px; 
  background: var(--white);
 }

.preview-img { 
  width: 100%; 
  height: 220px; 
  object-fit: cover; 
  border-radius: 8px; 
  display:block; 
}

.preview-placeholder { 
  height: 220px; 
  display:flex; 
  align-items:center; 
  justify-content:center; 
  color:#999; 
  border:1px dashed #e0e0e0; 
  border-radius:8px; 
  }
  
</style>
