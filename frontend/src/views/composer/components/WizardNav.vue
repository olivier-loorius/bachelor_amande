<template>
  <div class="nav">
    <button class="btn-secondary" @click="$emit('prev')" :disabled="!canPrev">Précédent</button>
    <button class="btn" @click="$emit('next')" :disabled="!canNext">Suivant</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ canPrev: boolean; canNext: boolean }>()
</script>

<style scoped>

.nav { 
  display:flex; 
  gap:.8rem; 
  justify-content:center; 
  margin-top:1.2rem; 
  }

.btn { 
  background: var(--accent-color); 
  color:#fff; border:none; 
  padding:.7rem 1.2rem; 
  border-radius:.8rem; 
  font-weight:700; 
  box-shadow: 0 2px 8px rgba(144,174,176,.15);
   }

.btn:disabled { 
  background:#ccc; 
  color:#888; 
  }

.btn-secondary { 
  background:#fff; 
  color:var(--accent-color); 
  border:2px solid var(--accent-color); 
  padding:.7rem 1.2rem; border-radius:.8rem; 
  font-weight:700; 
  }

.btn-secondary:disabled { 
opacity:.5;
 }
 
</style>
