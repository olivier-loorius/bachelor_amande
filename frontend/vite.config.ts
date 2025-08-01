// vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Ce chemin doit être correct pour "src"
    },
  },
  envDir: '../', // Lire les variables d'environnement depuis la racine du projet
})
