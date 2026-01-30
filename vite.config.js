import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/EyasSareeDrapist/',
  server: {
    host: true,
    allowedHosts: ['6d0841b06e374a1d-61-2-75-161.serveousercontent.com'],
  },
})
