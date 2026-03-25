import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        chunkSizeWarningLimit: 1000, // Increase warning threshold to 1MB
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
        rollupOptions: {
          output: {
            manualChunks(id) {
              // Split vendor dependencies
              if (id.includes('node_modules/react')) {
                return 'vendor-react';
              }
              // Split auth logic
              if (id.includes('auth/AuthContext')) {
                return 'vendor-auth';
              }
              // Split payment/subscription logic
              if (id.includes('utils/subscriptionUtils') || id.includes('components/PaymentModal') || id.includes('pages/AdminPayment')) {
                return 'vendor-payments';
              }
              // Split admin pages
              if (id.includes('pages/Admin') || id.includes('components/AdminLayout')) {
                return 'chunk-admin';
              }
            },
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]'
          }
        }
      },
      base: './'
    };
});
