import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["images/favicon.ico", "images/apple-touch-icon.png"], // Ajustado a tu carpeta
      manifest: {
        name: "Anotalo",
        short_name: "Anotalo",
        description: "Aplicación de anotaciones y gestión",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "images/pwa-192x192.png", // Ruta relativa a public
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "images/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable", // Importante para Android
          },
        ],
      },
    }),
  ],
});
