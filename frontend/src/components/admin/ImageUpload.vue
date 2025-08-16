<template>
  <div class="image-upload" :class="{ locked }">
    <div v-if="src" class="image-preview">
      <img :src="src" :alt="alt" />
      <button @click="$emit('remove')" class="remove-btn">×</button>
    </div>
    <div v-else class="upload-area" @click="!locked && triggerFileInput()">
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        style="display: none"
        :disabled="locked"
      />
      <span>📁</span>
      <small>Cliquez pour uploader</small>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  src: String,
  alt: String,
  locked: Boolean
})

const emit = defineEmits(['upload', 'remove'])

const fileInput = ref(null)

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    emit('upload', file)
  }
}
</script>

<style scoped>
.image-upload {
  width: 100px;
  height: 100px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.image-upload:hover:not(.locked) {
  border-color: #007bff;
  background-color: #f8f9fa;
}

.image-upload.locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #dc3545;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.upload-area span {
  font-size: 24px;
}

.upload-area small {
  font-family: var(--font-family-text);
  font-size: 10px;
  color: #666;
}
</style>
