import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      // Create Express app asynchronously to prevent blocking
      const createExpressApp = async () => {
        try {
          console.log("🚀 Creating Express server...");
          const app = createServer();

          // Add Express app as middleware to Vite dev server
          server.middlewares.use(app);

          console.log("✅ Express server integrated with Vite");
        } catch (error) {
          console.error("❌ Failed to create Express server:", error);
          // Create a minimal fallback server
          const express = await import("express");
          const fallbackApp = express.default();

          fallbackApp.get("/api/ping", (req, res) => {
            res.json({
              message: "Server running (WhatsApp disabled)",
              error: "WhatsApp initialization failed",
            });
          });

          server.middlewares.use(fallbackApp);
          console.log("⚠️ Running with fallback server (WhatsApp disabled)");
        }
      };

      // Start Express creation without blocking
      createExpressApp();
    },
  };
}
