import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          recharts: ['recharts'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api/windsor': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace('/api/windsor', '/.netlify/functions/windsor-proxy'),
      },
    },
  },
});
