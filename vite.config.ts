import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // CRITICAL FIX: Configure build optimization for better code splitting
    rollupOptions: {
      output: {
        // Manual chunks for vendor separation using function-based API
        manualChunks(id) {
          // React core (small, load first)
          if (id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
          // State management (load early)
          if (id.includes('node_modules/zustand') ||
              id.includes('node_modules/@tanstack')) {
            return 'vendor-state';
          }
          // Animation library (lazy load)
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          // Maps (HUGE - always lazy load)
          if (id.includes('node_modules/mapbox-gl') ||
              id.includes('node_modules/react-map-gl') ||
              id.includes('node_modules/leaflet') ||
              id.includes('node_modules/react-leaflet')) {
            return 'vendor-maps';
          }
        },
      },
    },
    // Increase chunk warning limit for maps (they're inherently large)
    chunkSizeWarningLimit: 500,
  },
})
