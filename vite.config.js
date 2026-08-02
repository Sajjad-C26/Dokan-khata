import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon-192.png", "icon-512.png"],
      manifest: {
        name: "দোকান খাতা",
        short_name: "দোকান খাতা",
        description: "ছোট ব্যবসার জন্য অর্ডার ও মালামালের হিসাব রাখার অ্যাপ",
        theme_color: "#3D5A45",
        background_color: "#F6F1E4",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" }
        ]
      }
    })
  ]
});
