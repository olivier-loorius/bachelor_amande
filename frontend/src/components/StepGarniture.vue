<template>
  <section>
    <h2 class="composer-step-title">{{ title }}</h2>
    <p class="composer-step-desc">{{ subtitle }}</p>

         <!-- Prévisualisation juste au-dessus des CTA -->
     <div v-if="previewUrl" class="garniture-preview">
       <img :src="previewUrl" alt="Prévisualisation" class="garniture-img" @error="handleImageError" />
     </div>

     <div class="garniture-cta-col">
       <button
         v-for="opt in options.slice(0,4)"
         :key="opt.id"
         class="garniture-cta-btn"
         type="button"
         :class="{ selected: selected?.id === opt.id }"
         @click="$emit('select', opt)"
       >
         {{ opt.nom }}
         <button
           v-if="selected?.id === opt.id"
           class="garniture-deselect-btn"
           type="button"
           @click.stop="$emit('deselect')"
           aria-label="Désélectionner"
         >
           <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M3 3L9 9M9 3L3 9" stroke="#222" stroke-width="1.5" stroke-linecap="round" />
           </svg>
         </button>
       </button>
     </div>

    <div class="composer-footer">
      <div class="composer-progress-bar">
        <template v-for="s in 5" :key="s">
          <span class="progress-dot" :class="{ done: currentStep > s, active: currentStep === s }"/>
          <span v-if="s < 5" class="progress-bar" :class="{ done: currentStep > s }"/>
        </template>
      </div>
      <div class="composer-nav-btns">
        <button class="composer-btn-secondary composer-btn-icon" @click="$emit('prev')" type="button">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 5l-4 4 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="btn-text">Précédent</span>
        </button>
        <button 
          class="composer-btn composer-btn-icon" 
          :disabled="!selected" 
          @click="$emit('next')"
          type="button"
          aria-label="Suivant"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 5l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Garniture } from '@/composer/types'

defineProps<{
  currentStep: number
  title: string
  subtitle: string
  options: Garniture[]
  selected: Garniture | null
  previewUrl: string
}>()

const emit = defineEmits<{
  (e: 'select', g: Garniture): void
  (e: 'deselect'): void
  (e: 'next'): void
  (e: 'prev'): void
  (e: 'handle-image-error', event: Event): void
}>()

function handleImageError(event: Event) {
  emit('handle-image-error', event)
}
</script>
