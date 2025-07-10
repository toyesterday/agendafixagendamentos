import { RequestHandler } from "express";
import { whatsappService, WhatsAppMessage } from "../services/whatsapp";
import { z } from "zod";

// Validation schemas
const sendMessageSchema = z.object({
  to: z.string().min(10, "Phone number is required"),
  message: z.string().min(1, "Message is required"),
  type: z.enum(["text", "template"]).optional(),
});

const bookingNotificationSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  phone: z.string().min(10, "Phone number is required"),
  serviceName: z.string().min(1, "Service name is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  totalPrice: z.string().optional().default("0.00"),
  clientPhone: z.string().optional(),
  type: z.enum(["client", "salon"]).optional().default("client"),
  config: z.any().optional(), // WhatsApp configuration object
});

// Get WhatsApp connection status
export const getWhatsAppStatus: RequestHandler = async (req, res) => {
  try {
    console.log("📊 Getting WhatsApp status...");
    const status = whatsappService.getStatus();
    console.log("📊 WhatsApp status:", status);

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error("❌ Error getting WhatsApp status:", error);

    // Return a safe default status instead of 500 error
    res.json({
      success: true,
      data: {
        connected: false,
        qrCode: null,
        lastConnection: null,
        error: "WhatsApp service initialization failed",
      },
    });
  }
};

// Send a custom WhatsApp message
export const sendMessage: RequestHandler = async (req, res) => {
  try {
    const validation = sendMessageSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid request data",
        details: validation.error.errors,
      });
    }

    const { to, message, type = "text" } = validation.data;

    const messageData: WhatsAppMessage = {
      to,
      message,
      type,
    };

    await whatsappService.sendMessage(messageData);

    res.json({
      success: true,
      message: "WhatsApp message sent successfully",
    });
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to send message",
    });
  }
};

// Send booking confirmation notification
export const sendBookingConfirmation: RequestHandler = async (req, res) => {
  try {
    const validation = bookingNotificationSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid request data",
        details: validation.error.errors,
      });
    }

    const {
      clientName,
      phone,
      serviceName,
      date,
      time,
      totalPrice,
      clientPhone,
      type,
      config,
    } = validation.data;

    // Use custom templates if provided, otherwise fall back to defaults
    let message: string;

    if (type === "client") {
      // Message for CLIENT
      const template =
        config?.clientMessageTemplate ||
        `🔮 *{salonName} - Agendamento Confirmado!*

Olá, {clientName}! 👋

Seu agendamento foi confirmado com sucesso:

📅 *Data:* {date}
⏰ *Horário:* {time}
✂️ *Serviços:* {services}

📍 *Local:* {salonName}
{salonAddress}

📋 *Importante:*
• Chegue com 5 minutos de antecedência
• Traga um documento com foto
• Em caso de imprevistos, entre em contato

📞 Dúvidas? Ligue: {salonPhone}

Obrigado por escolher a {salonName}! ✨`;

      message = template
        .replace(/{clientName}/g, clientName)
        .replace(
          /{date}/g,
          new Date(date).toLocaleDateString("pt-BR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        )
        .replace(/{time}/g, time)
        .replace(/{services}/g, serviceName)
        .replace(/{salonName}/g, config?.salonName || "AgendaFixa")
        .replace(
          /{salonAddress}/g,
          config?.salonAddress || "Rua Principal, 456 - Centro, São Paulo/SP",
        )
        .replace(/{salonPhone}/g, config?.salonPhone || "(11) 3333-4444")
        .replace(/{totalPrice}/g, totalPrice);
    } else {
      // Message for SALON
      const template =
        config?.salonMessageTemplate ||
        `🆕 *NOVO AGENDAMENTO - {salonName}*

📋 *Cliente:* {clientName}
📞 *Telefone:* {clientPhone}
📅 *Data:* {date}
⏰ *Horário:* {time}
✂️ *Serviços:* {services}

💰 *Total:* R$ {totalPrice}

💼 *Sistema AgendaFixa*
Agendamento feito através do site.`;

      message = template
        .replace(/{clientName}/g, clientName)
        .replace(/{clientPhone}/g, clientPhone || "Não informado")
        .replace(
          /{date}/g,
          new Date(date).toLocaleDateString("pt-BR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        )
        .replace(/{time}/g, time)
        .replace(/{services}/g, serviceName)
        .replace(/{salonName}/g, config?.salonName || "AgendaFixa")
        .replace(/{totalPrice}/g, totalPrice);
    }

    await whatsappService.sendMessage({
      to: phone,
      message: message,
      type: "text",
    });

    res.json({
      success: true,
      message: "Booking confirmation sent successfully",
    });
  } catch (error) {
    console.error("Error sending booking confirmation:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to send notification",
    });
  }
};

// Send booking reminder notification
export const sendBookingReminder: RequestHandler = async (req, res) => {
  try {
    const validation = bookingNotificationSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid request data",
        details: validation.error.errors,
      });
    }

    const { clientName, phone, serviceName, date, time } = validation.data;

    await whatsappService.sendBookingReminder(
      clientName,
      phone,
      serviceName,
      date,
      time,
    );

    res.json({
      success: true,
      message: "Booking reminder sent successfully",
    });
  } catch (error) {
    console.error("Error sending booking reminder:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to send reminder",
    });
  }
};

// Send booking cancellation notification
export const sendBookingCancellation: RequestHandler = async (req, res) => {
  try {
    const validation = bookingNotificationSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid request data",
        details: validation.error.errors,
      });
    }

    const { clientName, phone, serviceName, date, time } = validation.data;

    await whatsappService.sendBookingCancellation(
      clientName,
      phone,
      serviceName,
      date,
      time,
    );

    res.json({
      success: true,
      message: "Booking cancellation sent successfully",
    });
  } catch (error) {
    console.error("Error sending booking cancellation:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to send cancellation",
    });
  }
};

// Reconnect WhatsApp
export const reconnectWhatsApp: RequestHandler = async (req, res) => {
  try {
    await whatsappService.reconnect();

    res.json({
      success: true,
      message: "WhatsApp reconnection initiated",
    });
  } catch (error) {
    console.error("Error reconnecting WhatsApp:", error);
    res.status(500).json({
      success: false,
      error: "Failed to reconnect WhatsApp",
    });
  }
};

// Disconnect WhatsApp
export const disconnectWhatsApp: RequestHandler = async (req, res) => {
  try {
    await whatsappService.disconnect();

    res.json({
      success: true,
      message: "WhatsApp disconnected successfully",
    });
  } catch (error) {
    console.error("Error disconnecting WhatsApp:", error);
    res.status(500).json({
      success: false,
      error: "Failed to disconnect WhatsApp",
    });
  }
};

// Test WhatsApp service
export const testWhatsApp: RequestHandler = async (req, res) => {
  try {
    console.log("🧪 Testing WhatsApp service...");

    // Test Baileys import
    try {
      const baileys = await import("@whiskeysockets/baileys");
      console.log("✅ Baileys import successful");
    } catch (importError) {
      console.error("❌ Baileys import failed:", importError);
      return res.json({
        success: false,
        error: "Baileys library import failed",
        details:
          importError instanceof Error
            ? importError.message
            : String(importError),
      });
    }

    const status = whatsappService.getStatus();
    console.log("📊 Service status:", status);

    res.json({
      success: true,
      message: "WhatsApp service is running",
      data: {
        ...status,
        timestamp: new Date().toISOString(),
        serviceRunning: true,
        bakeysImport: "OK",
      },
    });
  } catch (error) {
    console.error("❌ Error testing WhatsApp:", error);
    res.json({
      success: false,
      error: "WhatsApp service test failed",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

// Logout WhatsApp (clear session)
export const logoutWhatsApp: RequestHandler = async (req, res) => {
  try {
    await whatsappService.logout();

    res.json({
      success: true,
      message: "WhatsApp logged out and session cleared",
    });
  } catch (error) {
    console.error("Error logging out WhatsApp:", error);
    res.status(500).json({
      success: false,
      error: "Failed to logout WhatsApp",
    });
  }
};

// Clear auth files
export const clearWhatsAppAuth: RequestHandler = async (req, res) => {
  try {
    await whatsappService.clearAuth();

    res.json({
      success: true,
      message: "WhatsApp auth cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing WhatsApp auth:", error);
    res.status(500).json({
      success: false,
      error: "Failed to clear WhatsApp auth",
    });
  }
};
