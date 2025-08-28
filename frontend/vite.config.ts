// vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  server: {
    // Configuration pour Vue Router - gère les refresh de page
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Ce chemin doit être correct pour "src"
    },
  },
  envDir: '../', // Lire les variables d'environnement depuis la racine du projet
})
