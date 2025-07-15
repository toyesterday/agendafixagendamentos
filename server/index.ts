import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { handleDemo } from "./routes/demo";
import {
  getWhatsAppStatus,
  sendMessage,
  sendBookingConfirmation,
  sendBookingReminder,
  sendBookingCancellation,
  reconnectWhatsApp,
  disconnectWhatsApp,
  testWhatsApp,
  logoutWhatsApp,
  clearWhatsAppAuth,
} from "./routes/whatsapp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static files in production
  if (process.env.NODE_ENV === "production") {
    const spaPath = path.join(__dirname, "../spa");
    app.use(express.static(spaPath));
  }

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // WhatsApp API routes
  app.get("/api/whatsapp/status", getWhatsAppStatus);
  app.get("/api/whatsapp/test", testWhatsApp);
  app.post("/api/whatsapp/send", sendMessage);
  app.post("/api/whatsapp/booking/confirmation", sendBookingConfirmation);
  app.post("/api/whatsapp/booking/reminder", sendBookingReminder);
  app.post("/api/whatsapp/booking/cancellation", sendBookingCancellation);
  app.post("/api/whatsapp/reconnect", reconnectWhatsApp);
  app.post("/api/whatsapp/disconnect", disconnectWhatsApp);
  app.post("/api/whatsapp/logout", logoutWhatsApp);
  app.post("/api/whatsapp/clear-auth", clearWhatsAppAuth);

  // Catch-all handler for SPA in production
  if (process.env.NODE_ENV === "production") {
    app.get("*", (_req, res) => {
      const spaPath = path.join(__dirname, "../spa");
      res.sendFile(path.join(spaPath, "index.html"));
    });
  }

  return app;
}
