<template>
  <div v-if="show" class="add-modal-overlay" @click.self="closeModal">
    <div class="add-modal">
      <div class="add-modal-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <div class="add-modal-msg">{{ message }}</div>
      <div class="modal-actions">
        <button class="btn-secondary" @click="closeModal">
          Continuer mes achats
        </button>
        <button class="btn-primary" @click="viewCart">
          <i class="fas fa-shopping-cart"></i> Voir mon panier
        </button>
      </div>
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
  autoCloseDelay: 5000
})

const emit = defineEmits<{
  close: []
  viewCart: []
}>()

const viewCart = () => {
  emit('viewCart')
  closeModal()
}

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
    autoCloseTimeout = setTimeout(() => {
      closeModal()
    }, props.autoCloseDelay)
  } else {
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
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

.add-modal {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: slideUp 0.3s ease;
}

.add-modal-icon {
  color: var(--accent-color);
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.add-modal-msg {
  font-size: 1.1rem;
  color: var(--text-color);
  text-align: center;
  margin-bottom: 1.5rem;
  font-family: var(--font-family-text);
  line-height: 1.4;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  flex-direction: column;
}

.btn-primary {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: var(--font-family-text);
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  background: var(--primary-color);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-secondary {
  background: #fff;
  color: #90aeb0;
  border: 1px solid #90aeb0;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: var(--font-family-text);
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-secondary:hover {
  background: #90aeb0;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .add-modal-overlay {
    padding: 0.5rem;
  }
  
  .add-modal {
    padding: 1.5rem;
    max-width: 90vw;
  }
  
  .add-modal-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }
  
  .add-modal-msg {
    font-size: 1rem;
    margin-bottom: 1.25rem;
  }
  
  .modal-actions {
    gap: 0.5rem;
  }
  
  .btn-primary, .btn-secondary {
    padding: 0.7rem 1.25rem;
    font-size: 0.85rem;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style> 