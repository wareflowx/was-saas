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
        // Main process only - preload is handled separately
        entry: 'electron/main.cjs',
        vite: {
          build: {
            outDir: 'dist-electron',
          }
        },
        onstart: () => {
          // Copy preload on start
          const fs = require('fs')
          const path = require('path')
          const source = path.join(process.cwd(), 'electron', 'preload.cjs')
          const target = path.join(process.cwd(), 'dist-electron', 'preload.cjs')
          fs.mkdirSync(path.dirname(target), { recursive: true })
          fs.copyFileSync(source, target)
          console.log('✓ Copied preload.cjs to dist-electron/')
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
