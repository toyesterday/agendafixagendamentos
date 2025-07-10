import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  proto,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import qrcode from "qrcode-terminal";
import fs from "fs";
import path from "path";

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
  private status: WhatsAppStatus = {
    connected: false,
    qrCode: null,
    lastConnection: null,
    error: null,
  };
  private authDir = path.join(process.cwd(), "auth_info");

  constructor() {
    this.ensureAuthDir();
  }

  private ensureAuthDir() {
    if (!fs.existsSync(this.authDir)) {
      fs.mkdirSync(this.authDir, { recursive: true });
    }
  }

  async initialize() {
    try {
      console.log("Initializing WhatsApp service...");
      const { state, saveCreds } = await useMultiFileAuthState(this.authDir);

      this.sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        browser: ["AgendaFixa", "Desktop", "1.0.0"],
        generateHighQualityLinkPreview: true,
        logger: {
          level: "warn",
          log: (level: any, ...args: any[]) => {
            if (level === "error") {
              console.error("Baileys error:", ...args);
            }
          },
        } as any,
        qrTimeout: 30000,
        connectTimeoutMs: 20000,
      });

      this.sock.ev.on("connection.update", (update: any) => {
        this.handleConnectionUpdate(update);
      });

      this.sock.ev.on("creds.update", saveCreds);

      this.sock.ev.on("messages.upsert", (m: any) => {
        console.log("Received message:", JSON.stringify(m, undefined, 2));
      });

      console.log("WhatsApp service initialized");
    } catch (error) {
      console.error("Failed to initialize WhatsApp service:", error);
      this.status.error = `Failed to initialize: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  private handleConnectionUpdate(update: any) {
    const { connection, lastDisconnect, qr } = update;

    console.log("Connection update:", {
      connection,
      qr: !!qr,
      lastDisconnect: lastDisconnect?.error,
    });

    if (qr) {
      console.log("QR Code received, scan to connect WhatsApp");
      this.status.qrCode = qr;
      this.status.error = null;
      // Show QR in terminal for development
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;

      console.log(
        "Connection closed due to",
        lastDisconnect?.error,
        ", reconnecting:",
        shouldReconnect,
      );

      this.status.connected = false;
      this.status.qrCode = null;

      if (shouldReconnect) {
        console.log("Attempting to reconnect...");
        setTimeout(() => {
          this.initialize();
        }, 3000); // Wait 3 seconds before reconnecting
      } else {
        this.status.error =
          "WhatsApp session logged out. Please scan QR code again.";
        console.log("Session logged out, need new QR scan");
      }
    } else if (connection === "open") {
      console.log("✅ WhatsApp connection opened successfully");
      this.status.connected = true;
      this.status.qrCode = null;
      this.status.lastConnection = new Date();
      this.status.error = null;
    } else if (connection === "connecting") {
      console.log("🔄 WhatsApp connecting...");
      this.status.error = null;
    }
  }

  async sendMessage(message: WhatsAppMessage): Promise<boolean> {
    if (!this.sock || !this.status.connected) {
      throw new Error("WhatsApp not connected");
    }

    try {
      // Format phone number (ensure it has country code)
      const phoneNumber = this.formatPhoneNumber(message.to);
      const jid = `${phoneNumber}@s.whatsapp.net`;

      const messageContent = {
        text: message.message,
      };

      await this.sock.sendMessage(jid, messageContent);
      console.log(`WhatsApp message sent to ${phoneNumber}`);
      return true;
    } catch (error) {
      console.error("Failed to send WhatsApp message:", error);
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
    return { ...this.status };
  }

  async disconnect() {
    if (this.sock) {
      await this.sock.logout();
      this.sock = null;
      this.status.connected = false;
      this.status.qrCode = null;
    }
  }

  async reconnect() {
    await this.disconnect();
    await this.initialize();
  }
}

// Singleton instance
export const whatsappService = new WhatsAppService();

// Initialize on module load
whatsappService.initialize().catch(console.error);
