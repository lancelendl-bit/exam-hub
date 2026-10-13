import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { resolve } from "node:path";

export default defineConfig({
  // Relative base so the build works on GitHub Pages under /<repo>/ and from any static host.
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        service: resolve(import.meta.dirname, "maps/service.html"),
        monitoring: resolve(import.meta.dirname, "maps/monitoring.html"),
        stem: resolve(import.meta.dirname, "maps/stem.html"),
      },
    },
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: null, // registered in src/main.js only; the map pages don't load it
      includeAssets: ["icons/*.png"],
      manifest: {
        name: "Fabric Exam Hub",
        short_name: "Fabric Hub",
        description: "Practice exams, drills and reference maps for the Microsoft Fabric certifications.",
        start_url: "./",
        scope: "./",
        display: "standalone",
        background_color: "#0f1514",
        theme_color: "#0d6b5b",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,webmanifest}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
            handler: "CacheFirst",
            options: { cacheName: "google-fonts", expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
    }),
  ],
  test: { environment: "node" },
});
