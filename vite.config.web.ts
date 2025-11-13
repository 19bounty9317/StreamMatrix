import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Web-Version Config (ohne Electron)
export default defineConfig({
  plugins: [react()],
  base: '/StreamMatrix/app/',
  build: {
    outDir: 'dist/web',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'web/index.html')
      }
    }
  },
  server: {
    port: 5174,
    strictPort: false
  },
  define: {
    'process.env.IS_WEB': JSON.stringify(true)
  }
});
