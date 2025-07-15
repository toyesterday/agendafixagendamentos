import { createServer } from "./index.js";

// Create and start the server
const app = createServer();
const PORT = process.env.PORT || 8080;

// Add error handling for the server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`📱 WhatsApp service starting in background...`);
});

// Handle server errors
server.on("error", (error: Error) => {
  console.error("❌ Server error:", error);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

// Handle uncaught exceptions to prevent crashes
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  // Don't exit - let the server continue running
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  // Don't exit - let the server continue running
});
