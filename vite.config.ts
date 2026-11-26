import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // NEXT_PUBLIC_* : variables publiques posées par l'intégration Vercel ↔ Supabase (URL + clé anon).
  // Ne JAMAIS nommer un secret avec ces préfixes : il serait inclus dans le code envoyé aux navigateurs.
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['framer-motion'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'icons/*.svg', 'icons/*.png', 'legal/*'],
      manifest: {
        id: '/',
        name: 'KaziBoss',
        short_name: 'KaziBoss',
        description:
          "Deviens le boss de ton business : simulation terrain, leçons express et outils financiers pour entrepreneurs d'Afrique francophone.",
        lang: 'fr',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0F172A',
        theme_color: '#0F172A',
        categories: ['education', 'finance', 'games', 'business'],
        // PNG requis par Android (installation, Play Store via TWA) ; SVG en complément.
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: 'icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
        shortcuts: [
          { name: 'Jouer', short_name: 'Jouer', url: '/?tab=play' },
          { name: 'Outils', short_name: 'Outils', url: '/?tab=tools' },
        ],
      },
      workbox: {
        // Précache de tout le shell applicatif : l'app fonctionne entièrement hors-ligne.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2,webmanifest}'],
        navigateFallback: '/index.html',
        // Pages légales, pages « À propos » et fichiers pour robots : vrais fichiers, pas l'app.
        navigateFallbackDenylist: [/^\/legal\//, /^\/info\//, /^\/(robots\.txt|sitemap\.xml|llms(-full)?\.txt)$/],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            // Cache-first pour les images et polices chargées à la volée.
            urlPattern: ({ request }) => request.destination === 'image' || request.destination === 'font',
            handler: 'CacheFirst',
            options: {
              cacheName: 'kaziboss-assets',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 60 },
            },
          },
        ],
      },
    }),
  ],
});
