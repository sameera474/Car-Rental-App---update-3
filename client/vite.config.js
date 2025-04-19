// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./", // 👈 This helps fix path issues in Vercel
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  logLevel: "info",
});
