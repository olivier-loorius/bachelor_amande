<template>
  <div v-if="isVisible" class="cart-animation" :style="animationStyle">
    <i class="fas fa-shopping-cart"></i>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  startX: number
  startY: number
  endX: number
  endY: number
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  duration: 1000
})

const isVisible = ref(false)
const animationStyle = ref({
  left: `${props.startX}px`,
  top: `${props.startY}px`
})

onMounted(() => {
  isVisible.value = true
  
  setTimeout(() => {
    animationStyle.value = {
      left: `${props.endX}px`,
      top: `${props.endY}px`
    }
  }, 50)

  setTimeout(() => {
    isVisible.value = false
  }, props.duration)
})
</script>

<style scoped>
.cart-animation {
  position: fixed;
  z-index: 9999;
  pointer-events: none;
  color: var(--accent-color);
  font-size: 1.5rem;
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation: cartBounce 0.8s ease-in-out;
}

@keyframes cartBounce {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style> 