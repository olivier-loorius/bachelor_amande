<template>
  <div class="image-upload" :class="{ locked }">
    <div v-if="src" class="image-preview">
      <img :src="src" :alt="alt" />
      <button @click="$emit('remove')" class="remove-btn">×</button>
    </div>
    <div v-else-if="uploading" class="uploading-area">
      <div class="spinner"></div>
      <small>Upload en cours...</small>
    </div>
    <div 
      v-else 
      class="upload-area" 
      @click="!locked && triggerFileInput()"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      :class="{ 'drag-over': isDragOver }"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        style="display: none"
        :disabled="locked"
      />
      <span>📁</span>
      <small>Cliquez ou glissez-déposez</small>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  src: String,
  alt: String,
  locked: Boolean,
  uploading: Boolean
})

const emit = defineEmits(['upload', 'remove'])

const fileInput = ref(null)
const isDragOver = ref(false)

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    emit('upload', file)
  }
}

function handleDragOver(event) {
  if (!props.locked) {
    isDragOver.value = true
  }
}

function handleDragLeave(event) {
  isDragOver.value = false
}

function handleDrop(event) {
  if (props.locked) return
  
  isDragOver.value = false
  const files = event.dataTransfer.files
  
  if (files.length > 0) {
    const file = files[0]
    if (file.type.startsWith('image/')) {
      emit('upload', file)
    }
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

.image-upload .upload-area.drag-over {
  border-color: #28a745;
  background-color: #d4edda;
  transform: scale(1.02);
}

.uploading-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
