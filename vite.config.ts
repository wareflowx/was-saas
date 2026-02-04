import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import electron from 'vite-plugin-electron'

import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 3001,
    strictPort: false,
  },
  plugins: [
    // devtools(), // Temporarily disabled - port 42069 conflict
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    viteReact(),
    tailwindcss(),
    electron([
      {
        // Main process only - preload is handled separately
        entry: 'electron/main.cjs',
        vite: {
          build: {
            outDir: 'dist-electron',
          }
        },
        onstart: () => {
          // Empty function - we copy preload via npm script
        }
      }
    ])
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
