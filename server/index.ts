import express from "express";
import cors from "cors";
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

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

  return app;
}
