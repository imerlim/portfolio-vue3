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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('three')) return 'vendor-three'
          if (id.includes('swiper')) return 'vendor-swiper'
          if (id.includes('gsap') || id.includes('animejs')) return 'vendor-motion'
          if (id.includes('vue') || id.includes('vue-router') || id.includes('@headlessui')) {
            return 'vendor-vue'
          }
        },
      },
    },
  },
})
