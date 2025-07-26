<template>
  <div v-if="show" class="logout-modal-overlay" @click.self="closeModal">
    <div class="logout-modal">
      <div class="logout-modal-icon">
        <i class="fas fa-sign-out-alt"></i>
      </div>
      <div class="logout-modal-msg">
        <p>{{ message }}</p>
        <div v-if="hasItemsInCart" class="cart-warning">
          <i class="fas fa-exclamation-triangle"></i>
          <span>Attention : Votre panier contient {{ panierStore.nombreArticles }} article(s) qui seront perdus.</span>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-secondary" @click="closeModal">
          Annuler
        </button>
        <button class="btn-primary" @click="confirmLogout">
          Se déconnecter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { usePanierStore } from '@/stores/panier'

interface Props {
  show: boolean
  userName?: string
}

const props = withDefaults(defineProps<Props>(), {
  userName: 'Utilisateur'
})

const emit = defineEmits<{
  close: []
  confirm: []
}>()

const panierStore = usePanierStore()

const hasItemsInCart = computed(() => panierStore.nombreArticles > 0)

const message = ref(`Êtes-vous sûr de vouloir vous déconnecter, ${props.userName} ?`)

const closeModal = () => {
  emit('close')
}

const confirmLogout = () => {
  emit('confirm')
  closeModal()
}

watch(() => props.userName, (newName) => {
  message.value = `Êtes-vous sûr de vouloir vous déconnecter, ${newName} ?`
})
</script>

<style scoped>
.logout-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

.logout-modal {
  background: var(--secondary-color);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: slideUp 0.3s ease;
  border: 1px solid var(--accent-color);
  position: relative;
  z-index: 10000;
}

.logout-modal-icon {
  color: var(--accent-color);
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.logout-modal-msg {
  font-size: 1.1rem;
  color: var(--text-color);
  text-align: center;
  margin-bottom: 1.5rem;
  font-family: var(--font-family-text);
  line-height: 1.4;
}

.cart-warning {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  color: #856404;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-align: left;
}

.cart-warning i {
  color: #f39c12;
  font-size: 1rem;
  flex-shrink: 0;
}

.cart-warning span {
  line-height: 1.3;
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
  .logout-modal-overlay {
    padding: 0.5rem;
  }
  
  .logout-modal {
    padding: 1.5rem;
    max-width: 90vw;
  }
  
  .logout-modal-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }
  
  .logout-modal-msg {
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