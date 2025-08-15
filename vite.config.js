import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // ここにbaseオプションを追加
  base: '/demo-task-app/', 
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})
