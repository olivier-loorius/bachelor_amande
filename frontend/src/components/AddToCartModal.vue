<template>
  <div v-if="show" class="add-modal-overlay" @click.self="closeModal">
    <div class="add-modal">
      <div class="add-modal-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <div class="add-modal-msg">{{ message }}</div>
      <button class="composer-btn" @click="closeModal" style="margin-top: 1.2rem;">OK</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  show: boolean
  message?: string
  autoCloseDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  message: 'Votre produit a bien été ajouté au panier !',
  autoCloseDelay: 2500
})

const emit = defineEmits<{
  close: []
}>()

let autoCloseTimeout: ReturnType<typeof setTimeout> | null = null

const closeModal = () => {
  if (autoCloseTimeout) {
    clearTimeout(autoCloseTimeout)
    autoCloseTimeout = null
  }
  emit('close')
}

watch(() => props.show, (newShow) => {
  if (newShow) {
    // Auto-fermeture après le délai spécifié
    autoCloseTimeout = setTimeout(() => {
      closeModal()
    }, props.autoCloseDelay)
  } else {
    // Nettoyer le timeout si la modal est fermée manuellement
    if (autoCloseTimeout) {
      clearTimeout(autoCloseTimeout)
      autoCloseTimeout = null
    }
  }
})
</script>

<style scoped>
.add-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s;
}

.add-modal {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 32px rgba(180, 138, 120, 0.18);
  padding: 2.2rem 2.5rem 1.5rem 2.5rem;
  min-width: 320px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: popIn 0.18s;
}

@media (max-width: 768px) {
  .add-modal {
    min-width: 280px;
    max-width: 85vw;
    padding: 2.5rem 2rem 2rem 2rem;
    min-height: 200px;
  }
  
  .add-modal-icon {
    font-size: 3rem;
    margin-bottom: 1.5rem;
  }
  
  .add-modal-msg {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    line-height: 1.4;
  }
  
  .composer-btn {
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
  }
}

.add-modal-icon {
  color: var(--accent-color);
  font-size: 2.5rem;
  margin-bottom: 1.1rem;
}

.add-modal-msg {
  font-size: 1.15rem;
  color: var(--text-color);
  text-align: center;
  margin-bottom: 0.5rem;
  font-family: var(--font-family-text);
}

.composer-btn {
  background: var(--accent-color);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 2rem;
  font-family: var(--font-family-text);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.composer-btn:hover {
  background: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes popIn {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style> 