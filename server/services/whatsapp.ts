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
  initializing: boolean;
}

class WhatsAppService {
  private sock: any = null;
  private store: any = null;
  private status: WhatsAppStatus = {
    connected: false,
    qrCode: null,
    lastConnection: null,
    error: null,
    initializing: false,
  };
  private authDir = path.join(process.cwd(), "auth_info_baileys");
  private logger = pino({ level: "silent" }); // Silent by default to prevent spam
  private initPromise: Promise<void> | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;

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

  async initialize(): Promise<void> {
    // Prevent multiple simultaneous initializations
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._doInitialize();
    return this.initPromise;
  }

  private async _doInitialize(): Promise<void> {
    try {
      console.log("🚀 Initializing WhatsApp service...");
      this.status.initializing = true;
      this.status.error = null;

      // Clear any existing reconnect timeout
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }

      // Get auth state with timeout
      const { state, saveCreds } = await Promise.race([
        useMultiFileAuthState(this.authDir),
        this.createTimeoutPromise(10000, "Auth state timeout"),
      ]);

      // Create socket with reduced timeouts and error handling
      this.sock = makeWASocket({
        auth: state,
        logger: this.logger,
        printQRInTerminal: false,
        browser: ["AgendaFixa", "Desktop", "1.0.0"],
        generateHighQualityLinkPreview: false,
        // Aggressive timeouts to prevent hanging
        defaultQueryTimeoutMs: 5000,
        connectTimeoutMs: 10000,
        keepAliveIntervalMs: 30000,
        emitOwnEvents: true,
        markOnlineOnConnect: false,
        retryRequestDelayMs: 1000,
        maxMsgRetryCount: 1,
        // Add connection options to prevent hanging
        options: {
          streamTimeoutMs: 5000,
        },
      });

      // Set up event listeners with error handling
      this.sock.ev.process(async (events: any) => {
        try {
          // Connection updates
          if (events["connection.update"]) {
            this.handleConnectionUpdate(events["connection.update"]);
          }

          // Credentials update
          if (events["creds.update"]) {
            try {
              await Promise.race([
                saveCreds(),
                this.createTimeoutPromise(5000, "Save credentials timeout"),
              ]);
            } catch (error) {
              console.warn("⚠️ Failed to save credentials:", error);
            }
          }

          // Messages upsert
          if (events["messages.upsert"]) {
            const upsert = events["messages.upsert"];
            console.log("📨 Received messages:", upsert.messages.length);
          }
        } catch (error) {
          console.warn("⚠️ Error processing events:", error);
        }
      });

      // Add error handler to prevent crashes
      this.sock.ev.on("connection.update", (update: any) => {
        // This is already handled in the process event
      });

      console.log("✅ WhatsApp service initialized successfully");
      this.status.initializing = false;
    } catch (error) {
      console.error("❌ Failed to initialize WhatsApp service:", error);
      this.status.error = `Failed to initialize: ${error instanceof Error ? error.message : String(error)}`;
      this.status.initializing = false;
      this.status.connected = false;
      this.sock = null;

      // Don't throw the error - let the service continue without WhatsApp
    } finally {
      this.initPromise = null;
    }
  }

  private createTimeoutPromise<T>(ms: number, message: string): Promise<T> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms);
    });
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
      try {
        qrcode.generate(qr, { small: true });
      } catch (error) {
        console.warn("⚠️ Failed to generate QR in terminal:", error);
      }
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

      if (
        shouldReconnect &&
        statusCode !== DisconnectReason.connectionReplaced
      ) {
        console.log("🔄 Attempting to reconnect in 10 seconds...");
        this.status.error = "Reconnecting...";

        // Clear any existing timeout
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
        }

        this.reconnectTimeout = setTimeout(() => {
          this.reconnect().catch((error) => {
            console.error("❌ Reconnection failed:", error);
            this.status.error = "Reconnection failed - please try manually";
          });
        }, 10000);
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
      this.status.initializing = false;
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

      // Use proper Baileys message structure with timeout
      const messageContent = {
        text: message.message,
      };

      // Send message with timeout
      const result = await Promise.race([
        this.sock.sendMessage(jid, messageContent),
        this.createTimeoutPromise(10000, "Send message timeout"),
      ]);

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
    const message = `🔮 *AgendaFixa - Agendamento Confirmado!*

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
        initializing: false,
      };
    }
  }

  async disconnect() {
    try {
      console.log("🔌 Disconnecting WhatsApp...");

      // Clear reconnect timeout
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }

      if (this.sock) {
        // Properly close the socket
        try {
          this.sock.end();
        } catch (error) {
          console.warn("⚠️ Error ending socket:", error);
        }
        this.sock = null;
      }

      this.status.connected = false;
      this.status.qrCode = null;
      this.status.error = "Disconnected manually";
      this.status.initializing = false;

      console.log("✅ WhatsApp disconnected");
    } catch (error) {
      console.error("❌ Error during disconnect:", error);
    }
  }

  async logout() {
    try {
      console.log("🚪 Logging out of WhatsApp...");

      // Clear reconnect timeout
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }

      if (this.sock) {
        try {
          await Promise.race([
            this.sock.logout(),
            this.createTimeoutPromise(5000, "Logout timeout"),
          ]);
        } catch (error) {
          console.warn("⚠️ Error during logout:", error);
        }
        this.sock = null;
      }

      // Clear auth files
      if (fs.existsSync(this.authDir)) {
        try {
          fs.rmSync(this.authDir, { recursive: true, force: true });
          this.ensureAuthDir();
        } catch (error) {
          console.warn("⚠️ Error clearing auth files:", error);
        }
      }

      this.status.connected = false;
      this.status.qrCode = null;
      this.status.error = "Logged out";
      this.status.initializing = false;

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

// SAFE initialization - don't block server startup
const initializeWhatsAppSafely = () => {
  // Don't await this - let it run in background
  whatsappService.initialize().catch((error) => {
    console.warn("⚠️ WhatsApp initialization failed (non-blocking):", error);
  });
};

// Start initialization after a delay to ensure server is ready
if (process.env.NODE_ENV !== "test") {
  setTimeout(initializeWhatsAppSafely, 3000);
}
