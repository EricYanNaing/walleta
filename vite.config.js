// vite.config.js
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-icon-192.png', 'pwa-icon-512.png'],
      manifest: {
        name: 'Paisa Walleta',
        short_name: 'Walleta',
        description: 'Track balances, categories, and spending momentum anywhere.',
        theme_color: '#7c3aed',
        background_color: '#f5f3ff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  resolve: {
    alias : {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    host: true,
    port: 5178,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  }
})
