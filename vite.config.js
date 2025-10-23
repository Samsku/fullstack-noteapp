import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react({
            // Enable Fast Refresh
            jsxRuntime: 'automatic', // Enables the new JSX transform
            babel: {
                plugins: ['@babel/plugin-transform-react-jsx'], // Ensure JSX transform is enabled
            },
        }),
    ],
    server: {
        port: 3000, // Match your frontend port
        open: true,
    },
    build: {
        outDir: 'dist', // Output directory for the production build
        sourcemap: true, // Enable source maps for debugging
    },
});