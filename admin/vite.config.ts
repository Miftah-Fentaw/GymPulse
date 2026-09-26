import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/v1": {
        target: process.env.VITE_API_PROXY || "http://127.0.0.1:8080",
        changeOrigin: true,
      },
      "/health": {
        target: process.env.VITE_API_PROXY || "http://127.0.0.1:8080",
        changeOrigin: true,
      },
      "/ready": {
        target: process.env.VITE_API_PROXY || "http://127.0.0.1:8080",
        changeOrigin: true,
      },
    },
  },
});
