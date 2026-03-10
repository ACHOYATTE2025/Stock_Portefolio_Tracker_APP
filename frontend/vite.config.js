import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'stock-portfolio-tracker-app-frontend.onrender.com',
      'localhost'
    ]
  }
})