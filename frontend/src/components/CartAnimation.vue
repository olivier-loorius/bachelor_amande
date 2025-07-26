<template>
  <div v-if="show" class="cart-animation" :style="animationStyle">
    <div class="cart-bubble">
      <i class="fas fa-shopping-cart"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  show: boolean
  startPosition: { x: number; y: number }
  endPosition: { x: number; y: number }
}

const props = defineProps<Props>()

const animationStyle = ref({
  left: `${props.startPosition.x}px`,
  top: `${props.startPosition.y}px`
})

onMounted(() => {
  if (props.show) {
    // Animation vers l'icône du panier
    setTimeout(() => {
      animationStyle.value = {
        left: `${props.endPosition.x}px`,
        top: `${props.endPosition.y}px`
      }
    }, 100)
  }
})
</script>

<style scoped>
.cart-animation {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.cart-bubble {
  width: 40px;
  height: 40px;
  background: var(--accent-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: bounce 0.8s ease-in-out;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.2);
  }
  60% {
    transform: scale(0.9);
  }
}
</style> 