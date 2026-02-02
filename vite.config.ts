import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import electron from 'vite-plugin-electron'

import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    devtools(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    viteReact(),
    tailwindcss(),
    electron([
      {
        // Main process
        entry: 'electron/main.cjs',
        vite: {
          build: {
            outDir: 'dist-electron',
          }
        },
        // Disable automatic Electron launching - we launch it manually with wait-on
        onstart: () => {
          // Empty function prevents automatic Electron startup
          // We launch Electron manually via pnpm dev:electron with wait-on
        }
      },
      {
        // Preload script - disabled, we copy it directly
        entry: 'electron/preload.cjs',
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: {
              output: {
                entryFileNames: '[name].cjs',
                format: 'cjs',
              }
            }
          }
        },
        onstart() {
          // Copy preload.cjs directly to avoid Vite transformation
          const fs = require('fs')
          const source = 'electron/preload.cjs'
          const target = 'dist-electron/preload.cjs'
          fs.copyFileSync(source, target)
          console.log('Copied preload.cjs to dist-electron/')
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
