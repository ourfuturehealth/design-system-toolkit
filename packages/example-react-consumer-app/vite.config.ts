import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  logLevel: process.env.VERBOSE === 'true' ? 'info' : 'warn',
  plugins: [react()],
  server: {
    port: 5174
  },
})
