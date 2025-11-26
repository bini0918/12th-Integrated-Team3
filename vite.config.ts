import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://3.34.231.145:8080',
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
      },
    },
  },
});
