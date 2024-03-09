import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        changeOrigin: true,
        target: 'http://100.20.92.101:3000',
      },
    },
  },
  plugins: [vue()],
})