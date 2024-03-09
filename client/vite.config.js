import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        changeOrigin: true,
        target:
          'http://[::1]:3000',
      },
    },
  },
  plugins: [vue()],
})