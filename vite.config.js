import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// GitHub Pages: publicado em /portfolio-vue3/ (VITE_BASE sobrescreve, se definido).
export default defineConfig({
  base: process.env.VITE_BASE || '/portfolio-vue3/',
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
