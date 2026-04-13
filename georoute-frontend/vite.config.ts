import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    proxy: {
      '/api/routes/match': {
        target: 'http://localhost:8989',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/routes\/match/, '/match'),
      },

      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1'),
      }
    }
  }
})
