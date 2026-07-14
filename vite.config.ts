import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 添加这一行

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'), // 添加这一行
    },
  },
})