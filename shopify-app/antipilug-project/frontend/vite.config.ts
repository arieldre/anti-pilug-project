import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()] as any,
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://antipilug-backend:5000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
  },
})
