import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@components': path.resolve(__dirname, './src/shared/components'),
      '@utils': path.resolve(__dirname, './src/shared/lib/utils'),
      '@lib': path.resolve(__dirname, './src/shared/lib'),
      '@hooks': path.resolve(__dirname, './src/shared/hooks')
    },
  },
})
