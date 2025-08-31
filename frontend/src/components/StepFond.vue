<template>
  <section>
    <h2 class="composer-step-title">Pour commencer, choisissez votre fond de tartelette</h2>
    <p class="composer-step-desc">Sélectionnez la base de votre tartelette parmi nos fonds maison.</p>

    <div class="fond-options">
      <button
        v-for="fond in fonds"
        :key="fond.id"
        type="button"
        :class="['fond-option-card', { selected: selectedFond?.id === fond.id }]"
        @click="onSelect(fond)"
      >
        <div class="fond-image-wrapper">
          <img v-if="fond.image" :src="fond.image" :alt="fond.nom" class="fond-image" @error="handleImageError" />
          <div v-else class="fond-img-error">Image manquante</div>
          <div v-if="selectedFond?.id === fond.id" class="fond-overlay fond-hover-overlay">
            <span class="fond-overlay-label">{{ fond.nom }}</span>
          </div>
        </div>
      </button>
    </div>

    <div class="composer-footer">
      <div class="composer-nav-btns">
        <button 
          class="composer-btn composer-btn-icon" 
          :disabled="!selectedFond" 
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
import type { Fond } from '@/composer/types'

defineProps<{
  currentStep: number
  fonds: Fond[]
  selectedFond: Fond | null
  autoNextOnSelect?: boolean
}>()

const emit = defineEmits<{
  (e: 'select', fond: Fond): void
  (e: 'next'): void
  (e: 'handle-image-error', event: Event): void
}>()

function onSelect(f: Fond) {
  emit('select', f)
  if (typeof window !== 'undefined' && document?.querySelector) {
    document.querySelector('.composer-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function handleImageError(event: Event) {
  emit('handle-image-error', event)
}
</script>
