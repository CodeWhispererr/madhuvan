import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: true },
  // The three.js chunk (3D plot view) is ~1 MB but only loads when someone opens the 3D view.
  build: { chunkSizeWarningLimit: 1100 },
});
