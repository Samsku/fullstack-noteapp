import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    // Production build settings
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      // Ensure proper chunking for production
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
          },
        },
      },
    },
    // Base public path when served in production
    base: './',
    // Environment variables available in the client
    define: {
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV || 'production'),
    },
  };
});
