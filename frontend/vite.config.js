import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'stock-portfolio-tracker-app-frontend.onrender.com',
      'localhost'
    ]
  }
})