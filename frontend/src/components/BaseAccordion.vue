<template>
  <section class="accordion-section">
    <header class="accordion-header" @click="$emit('toggle')">
      <h3>{{ title }}</h3>
      <span class="chevron" :class="{ open }">⌄</span>
    </header>
    <Transition name="slide-fade">
      <div v-if="open" class="accordion-content">
        <slot />
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  open: boolean
}>()

defineEmits<{
  toggle: []
}>()
</script>

<style scoped lang="scss">
.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.chevron {
  display: inline-block;
  transition: transform 0.3s ease;
}
.chevron.open {
  transform: rotate(180deg);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
  max-height: 500px;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
