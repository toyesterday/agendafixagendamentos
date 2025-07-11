import {
  makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  proto,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import qrcode from "qrcode-terminal";
import fs from "fs";
import path from "path";
import pino from "pino";

export interface WhatsAppMessage {
  to: string;
  message: string;
  type?: "text" | "template";
}

export interface WhatsAppStatus {
  connected: boolean;
  qrCode: string | null;
  lastConnection: Date | null;
  error: string | null;
}

class WhatsAppService {
  private sock: any = null;
  private store: any = null;
  private status: WhatsAppStatus = {
    connected: false,
    qrCode: null,
    lastConnection: null,
    error: null,
  };
  private authDir = path.join(process.cwd(), "auth_info_baileys");
  private logger = pino({ level: "warn" });

  constructor() {
    this.ensureAuthDir();
    this.initializeStore();
  }

  private ensureAuthDir() {
    if (!fs.existsSync(this.authDir)) {
      fs.mkdirSync(this.authDir, { recursive: true });
    }
  }

  private initializeStore() {
    // Store functionality can be added later if needed
    this.store = null;
  }

  async initialize() {
    try {
      console.log("🚀 Initializing WhatsApp service...");
      console.log("📁 Auth directory:", this.authDir);

      // Test imports first
      console.log("🔍 Testing Baileys imports...");
      const baileys = await import("@whiskeysockets/baileys");
      console.log("📦 Baileys imported:", Object.keys(baileys));

      // Get auth state
      console.log("🔐 Getting auth state...");
      const { state, saveCreds } = await useMultiFileAuthState(this.authDir);
      console.log("✅ Auth state obtained");

      // Create socket with recommended configuration
      console.log("🔌 Creating WhatsApp socket...");

      if (typeof makeWASocket !== "function") {
        throw new Error("makeWASocket is not a function");
      }

      this.sock = makeWASocket({
        auth: state,
        logger: this.logger,
        printQRInTerminal: false,
        browser: ["AgendaFixa", "Desktop", "1.0.0"],
        generateHighQualityLinkPreview: false, // Disable to reduce load
        // Reduced timeouts to prevent hanging
        defaultQueryTimeoutMs: 15_000,
        keepAliveIntervalMs: 30_000,
        emitOwnEvents: true,
        markOnlineOnConnect: false, // Disable to prevent connection issues
        // Connection retry settings
        retryRequestDelayMs: 250,
        maxMsgRetryCount: 2,
        connectTimeoutMs: 20_000,
      });

      // Store binding removed for now

      // Event listeners
      this.sock.ev.process(async (events: any) => {
        // Connection updates
        if (events["connection.update"]) {
          this.handleConnectionUpdate(events["connection.update"]);
        }

        // Credentials update
        if (events["creds.update"]) {
          await saveCreds();
        }

        // Messages upsert
        if (events["messages.upsert"]) {
          const upsert = events["messages.upsert"];
          console.log("📨 Received messages:", upsert.messages.length);

          for (const msg of upsert.messages) {
            if (!msg.key.fromMe && msg.message) {
              console.log(
                "Message from:",
                msg.key.remoteJid,
                "Message:",
                msg.message,
              );
            }
          }
        }

        // Message updates (read receipts, etc.)
        if (events["messages.update"]) {
          console.log("📨 Message updates:", events["messages.update"]);
        }

        // Presence updates
        if (events["presence.update"]) {
          console.log("👤 Presence update:", events["presence.update"]);
        }
      });

      console.log("✅ WhatsApp service initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize WhatsApp service:", error);
      this.status.error = `Failed to initialize: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  private handleConnectionUpdate(update: any) {
    const { connection, lastDisconnect, qr } = update;

    console.log("🔄 Connection update:", {
      connection,
      qr: !!qr,
      lastDisconnect: lastDisconnect?.error?.output?.statusCode,
    });

    // Handle QR code
    if (qr) {
      console.log("📱 QR Code received - Please scan with WhatsApp");
      this.status.qrCode = qr;
      this.status.error = null;
      this.status.connected = false;

      // Show QR in terminal for development
      qrcode.generate(qr, { small: true });
    }

    // Handle connection states
    if (connection === "close") {
      this.status.connected = false;
      this.status.qrCode = null;

      const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      console.log("❌ Connection closed:", {
        statusCode,
        reason: this.getDisconnectReason(statusCode),
        shouldReconnect,
      });

      if (shouldReconnect) {
        console.log("🔄 Attempting to reconnect in 5 seconds...");
        this.status.error = "Reconnecting...";

        setTimeout(() => {
          this.initialize().catch((error) => {
            console.error("❌ Reconnection failed:", error);
            this.status.error = "Reconnection failed - please try manually";
          });
        }, 5000);
      } else {
        this.status.error = "Session logged out. Please reconnect.";
        console.log("🔐 Session logged out - manual reconnection required");
      }
    } else if (connection === "open") {
      console.log("✅ WhatsApp connected successfully!");
      this.status.connected = true;
      this.status.qrCode = null;
      this.status.lastConnection = new Date();
      this.status.error = null;
    } else if (connection === "connecting") {
      console.log("🔄 Connecting to WhatsApp...");
      this.status.error = "Connecting...";
    }
  }

  private getDisconnectReason(statusCode?: number): string {
    switch (statusCode) {
      case DisconnectReason.badSession:
        return "Bad session file, deleting and reconnecting";
      case DisconnectReason.connectionClosed:
        return "Connection closed, reconnecting";
      case DisconnectReason.connectionLost:
        return "Connection lost, reconnecting";
      case DisconnectReason.connectionReplaced:
        return "Connection replaced, is another session active?";
      case DisconnectReason.loggedOut:
        return "Device logged out, scan QR code again";
      case DisconnectReason.restartRequired:
        return "Restart required, reconnecting";
      case DisconnectReason.timedOut:
        return "Connection timed out, reconnecting";
      default:
        return "Unknown reason";
    }
  }

  async sendMessage(message: WhatsAppMessage): Promise<boolean> {
    if (!this.sock || !this.status.connected) {
      throw new Error("WhatsApp not connected");
    }

    try {
      // Format phone number (ensure it has country code)
      const phoneNumber = this.formatPhoneNumber(message.to);

      // Check if it's a valid number format
      if (phoneNumber.length < 10) {
        throw new Error("Invalid phone number format");
      }

      const jid = `${phoneNumber}@s.whatsapp.net`;

      console.log(`📤 Sending message to ${phoneNumber} (${jid})...`);

      // Use proper Baileys message structure
      const messageContent = {
        text: message.message,
      };

      // Send message with proper error handling
      const result = await this.sock.sendMessage(jid, messageContent);

      console.log(`✅ Message sent successfully to ${phoneNumber}:`, {
        messageId: result?.key?.id,
        timestamp: result?.messageTimestamp,
      });

      return true;
    } catch (error) {
      console.error("❌ Failed to send WhatsApp message:", error);

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("not-authorized")) {
          throw new Error("WhatsApp session not authorized. Please reconnect.");
        } else if (error.message.includes("rate-limit")) {
          throw new Error("Rate limit exceeded. Please try again later.");
        } else if (error.message.includes("invalid-jid")) {
          throw new Error("Invalid phone number format.");
        }
      }

      throw error;
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Remove all non-numeric characters
    const numbers = phone.replace(/\D/g, "");

    // If doesn't start with country code, add Brazil code (55)
    if (numbers.length === 11 && !numbers.startsWith("55")) {
      return `55${numbers}`;
    }

    return numbers;
  }

  async sendBookingConfirmation(
    clientName: string,
    phone: string,
    serviceName: string,
    date: string,
    time: string,
  ): Promise<boolean> {
    const message = `��� *AgendaFixa - Agendamento Confirmado!*

Olá, ${clientName}! 👋

Seu agendamento foi confirmado com sucesso:

📅 *Data:* ${new Date(date).toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
⏰ *Horário:* ${time}
✂️ *Serviço:* ${serviceName}

📍 *Local:* Barbearia ModernCut
Rua Principal, 456 - Centro, São Paulo/SP

📋 *Importante:*
• Chegue com 5 minutos de antecedência
• Traga um documento com foto
• Em caso de imprevistos, entre em contato

📞 Dúvidas? Ligue: (11) 3333-4444

Obrigado por escolher a AgendaFixa! ✨`;

    return this.sendMessage({
      to: phone,
      message: message,
      type: "text",
    });
  }

  async sendBookingReminder(
    clientName: string,
    phone: string,
    serviceName: string,
    date: string,
    time: string,
  ): Promise<boolean> {
    const message = `🔔 *Lembrete - AgendaFixa*

Olá, ${clientName}! 

Lembramos que você tem um agendamento *AMANHÃ*:

📅 *Data:* ${new Date(date).toLocaleDateString("pt-BR")}
⏰ *Horário:* ${time}
✂️ *Serviço:* ${serviceName}

📍 *Local:* Barbearia ModernCut
Rua Principal, 456 - Centro

Até amanhã! 😊`;

    return this.sendMessage({
      to: phone,
      message: message,
      type: "text",
    });
  }

  async sendBookingCancellation(
    clientName: string,
    phone: string,
    serviceName: string,
    date: string,
    time: string,
  ): Promise<boolean> {
    const message = `❌ *Agendamento Cancelado - AgendaFixa*

Olá, ${clientName},

Seu agendamento foi cancelado:

📅 *Data:* ${new Date(date).toLocaleDateString("pt-BR")}
⏰ *Horário:* ${time}
✂️ *Serviço:* ${serviceName}

Para reagendar, acesse: 
🌐 www.agendafixa.com/booking

📞 Dúvidas? Ligue: (11) 3333-4444

Esperamos vê-lo em breve! 😊`;

    return this.sendMessage({
      to: phone,
      message: message,
      type: "text",
    });
  }

  getStatus(): WhatsAppStatus {
    try {
      return { ...this.status };
    } catch (error) {
      console.error("❌ Error getting status:", error);
      return {
        connected: false,
        qrCode: null,
        lastConnection: null,
        error: "Status check failed",
      };
    }
  }

  async disconnect() {
    try {
      console.log("🔌 Disconnecting WhatsApp...");

      if (this.sock) {
        // Properly close the socket
        this.sock.end();
        this.sock = null;
      }

      this.status.connected = false;
      this.status.qrCode = null;
      this.status.error = "Disconnected manually";

      console.log("✅ WhatsApp disconnected");
    } catch (error) {
      console.error("❌ Error during disconnect:", error);
    }
  }

  async logout() {
    try {
      console.log("���� Logging out of WhatsApp...");

      if (this.sock) {
        await this.sock.logout();
        this.sock = null;
      }

      // Clear auth files
      if (fs.existsSync(this.authDir)) {
        fs.rmSync(this.authDir, { recursive: true, force: true });
        this.ensureAuthDir();
      }

      this.status.connected = false;
      this.status.qrCode = null;
      this.status.error = "Logged out";

      console.log("✅ WhatsApp logged out and auth cleared");
    } catch (error) {
      console.error("❌ Error during logout:", error);
    }
  }

  async reconnect() {
    console.log("🔄 Reconnecting WhatsApp...");
    await this.disconnect();

    // Wait a moment before reconnecting
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await this.initialize();
  }

  async clearAuth() {
    await this.logout();
    console.log("🗑️ Auth files cleared, ready for new connection");
  }
}

// Singleton instance
export const whatsappService = new WhatsAppService();

// Initialize on module load with better error handling
const initializeWhatsApp = async () => {
  try {
    console.log("🚀 Starting WhatsApp service...");
    console.log("📦 Checking Baileys import...");

    // Test if the import works
    const { makeWASocket: testMakeWASocket } = await import(
      "@whiskeysockets/baileys"
    );
    if (typeof testMakeWASocket !== "function") {
      throw new Error("makeWASocket is not a function - import failed");
    }

    console.log("✅ Baileys import successful");

    // Initialize with timeout protection
    await Promise.race([
      whatsappService.initialize(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Initialization timeout")), 30000),
      ),
    ]);

    console.log("✅ WhatsApp service started successfully");
  } catch (error) {
    console.error("❌ Failed to start WhatsApp service:", error);

    // Don't log the full stack trace to reduce noise for timeout errors
    if (
      error instanceof Error &&
      (error.message.includes("Timed Out") || error.message.includes("timeout"))
    ) {
      console.log(
        "ℹ️  WhatsApp timeout is normal - service will continue in background",
      );
    } else {
      console.error(
        "Stack trace:",
        error instanceof Error ? error.stack : "No stack trace",
      );
    }

    // Set error state but don't crash the server
    whatsappService["status"].error =
      `Initialization failed: ${error instanceof Error ? error.message : String(error)}`;
  }
};

// Delay initialization and wrap in timeout protection
setTimeout(() => {
  // Wrap in timeout to prevent hanging the server
  const initTimeout = setTimeout(() => {
    console.log("⚠️  WhatsApp initialization timed out, skipping...");
    whatsappService["status"].error =
      "Initialization timed out - WhatsApp disabled";
  }, 10000); // 10 second timeout

  initializeWhatsApp()
    .then(() => {
      clearTimeout(initTimeout);
    })
    .catch((error) => {
      clearTimeout(initTimeout);
      console.error("❌ WhatsApp initialization failed:", error);
      whatsappService["status"].error =
        "Initialization failed - WhatsApp disabled";
    });
}, 2000);
