
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    viteCompression(),
    visualizer(),
    react()
  ],
  resolve: {
    alias: {
      '@assets': '/src/assets',
      '@components': '/src/components',
      '@styles': '/src/styles',
      '@services': '/src/services',
      '@atoms': '/src/components/01-atoms',
      '@molecules': '/src/components/02-molecules',
      '@organisms': '/src/components/03-organisms',
      '@templates': '/src/components/04-templates',
      '@pages': '/src/components/05-pages',
      '@i18n': '/src/i18n',
      '@slices': '/src/slices',
      '@hooks': '/src/hooks',
      '@store': '/src/store',
      '@utils': '/src/utils',
    },
  },
});
