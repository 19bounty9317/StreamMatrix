import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist/renderer',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        tileWindow: resolve(__dirname, 'tile-window.html'),
        userModalWindow: resolve(__dirname, 'user-modal-window.html')
      }
    }
  },
  server: {
    port: 5173,
    strictPort: false
  }
});
