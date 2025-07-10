import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Smartphone,
  Wifi,
  WifiOff,
  RefreshCw,
  Send,
  QrCode,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface WhatsAppStatus {
  connected: boolean;
  qrCode: string | null;
  lastConnection: Date | null;
  error: string | null;
}

const WhatsAppManager = () => {
  const [status, setStatus] = useState<WhatsAppStatus>({
    connected: false,
    qrCode: null,
    lastConnection: null,
    error: null,
  });
  const [loading, setLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [lastSent, setLastSent] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/whatsapp/status");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setStatus(data.data);
      } else {
        setStatus({
          connected: false,
          qrCode: null,
          lastConnection: null,
          error: "WhatsApp service unavailable",
        });
      }
    } catch (error) {
      console.error("Failed to fetch WhatsApp status:", error);
      setStatus({
        connected: false,
        qrCode: null,
        lastConnection: null,
        error: "WhatsApp service not available",
      });
    }
  };

  const handleReconnect = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/whatsapp/reconnect", {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        setLastSent("Reconexão iniciada com sucesso");
        setTimeout(fetchStatus, 2000);
      } else {
        setLastSent(`Erro: ${data.error}`);
      }
    } catch (error) {
      setLastSent("Erro ao reconectar WhatsApp");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/whatsapp/disconnect", {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        setLastSent("WhatsApp desconectado com sucesso");
        fetchStatus();
      } else {
        setLastSent(`Erro: ${data.error}`);
      }
    } catch (error) {
      setLastSent("Erro ao desconectar WhatsApp");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!phoneNumber || !message) {
      setLastSent("Preencha o telefone e a mensagem");
      return;
    }

    setSendLoading(true);
    try {
      const response = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: message,
          type: "text",
        }),
      });

      const data = await response.json();
      if (data.success) {
        setLastSent("Mensagem enviada com sucesso!");
        setMessage("");
        setPhoneNumber("");
      } else {
        setLastSent(`Erro: ${data.error}`);
      }
    } catch (error) {
      setLastSent("Erro ao enviar mensagem");
    } finally {
      setSendLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Status do WhatsApp</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {status.connected ? (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <Wifi className="h-5 w-5 text-green-500" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 border-green-300"
                  >
                    ✅ Conectado e Pronto
                  </Badge>
                </>
              ) : status.qrCode ? (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    <QrCode className="h-5 w-5 text-yellow-500" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 border-yellow-300"
                  >
                    📱 Aguardando QR Code
                  </Badge>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <WifiOff className="h-5 w-5 text-red-500" />
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-800 border-red-300"
                  >
                    ❌ Desconectado
                  </Badge>
                </>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={fetchStatus}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              <div className="flex space-x-2">
                {status.connected ? (
                  <Button
                    onClick={handleDisconnect}
                    variant="outline"
                    size="sm"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <WifiOff className="h-4 w-4 mr-2" />
                    )}
                    Desconectar
                  </Button>
                ) : (
                  <Button
                    onClick={handleReconnect}
                    variant="outline"
                    size="sm"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Wifi className="h-4 w-4 mr-2" />
                    )}
                    Conectar
                  </Button>
                )}

                <Button
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const response = await fetch("/api/whatsapp/logout", {
                        method: "POST",
                      });
                      const data = await response.json();
                      if (data.success) {
                        setLastSent("✅ Sessão limpa com sucesso");
                        setTimeout(fetchStatus, 1000);
                      } else {
                        setLastSent(`❌ Erro: ${data.error}`);
                      }
                    } catch (error) {
                      setLastSent("❌ Erro ao limpar sessão");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Limpar Sessão
                </Button>
              </div>
            </div>
          </div>

          {status.lastConnection && (
            <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <p className="font-medium">📅 Última conexão:</p>
              <p>{new Date(status.lastConnection).toLocaleString("pt-BR")}</p>
            </div>
          )}

          {!status.connected && !status.qrCode && !status.error && (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">
                🚀 Clique em "Conectar" para iniciar a conexão com o WhatsApp
              </p>
              <div className="text-xs text-gray-500">
                <p>ℹ️ Você precisará escanear um QR Code com seu WhatsApp</p>
              </div>
            </div>
          )}

          {status.error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {status.error}
              </AlertDescription>
            </Alert>
          )}

          {status.qrCode && (
            <Alert className="border-blue-200 bg-blue-50">
              <QrCode className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                <div className="text-center">
                  <p className="font-medium mb-4">
                    📱 Escaneie o QR Code com seu WhatsApp:
                  </p>
                  <div className="bg-white p-6 rounded-lg border-2 border-blue-200 inline-block shadow-lg">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(status.qrCode)}`}
                      alt="QR Code WhatsApp"
                      className="w-64 h-64"
                    />
                  </div>
                  <div className="mt-4 text-sm bg-blue-100 rounded-lg p-3">
                    <p className="font-medium text-blue-800 mb-2">
                      📋 Como conectar:
                    </p>
                    <ol className="text-left text-blue-700 space-y-1">
                      <li>1. Abra o WhatsApp no seu celular</li>
                      <li>
                        2. Toque em <strong>Menu</strong> (⋮) ou{" "}
                        <strong>Configurações</strong>
                      </li>
                      <li>
                        3. Selecione <strong>Dispositivos conectados</strong>
                      </li>
                      <li>
                        4. Toque em <strong>Conectar dispositivo</strong>
                      </li>
                      <li>5. Escaneie este QR Code</li>
                    </ol>
                  </div>
                  <p className="text-xs mt-3 text-blue-600">
                    ⏱️ O QR Code expira em 30 segundos. Se não funcionar, clique
                    em "Conectar" novamente.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Send Message Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="h-5 w-5" />
            <span>Enviar Mensagem</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(formatPhoneNumber(e.target.value))
                  }
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              placeholder="Digite sua mensagem aqui..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={
              !status.connected || sendLoading || !phoneNumber || !message
            }
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {sendLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Enviar Mensagem
          </Button>

          {lastSent && (
            <Alert
              className={`${lastSent.includes("sucesso") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
            >
              {lastSent.includes("sucesso") ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription
                className={
                  lastSent.includes("sucesso")
                    ? "text-green-700"
                    : "text-red-700"
                }
              >
                {lastSent}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={async () => {
                try {
                  const response = await fetch("/api/whatsapp/test");
                  const data = await response.json();
                  if (data.success) {
                    setLastSent("✅ Teste de conexão bem-sucedido!");
                  } else {
                    setLastSent(`❌ Teste falhou: ${data.error}`);
                  }
                } catch (error) {
                  setLastSent("❌ Erro no teste de conexão");
                }
              }}
            >
              <MessageCircle className="h-6 w-6" />
              <span className="text-sm">Teste de Conexão</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              disabled={!status.connected}
            >
              <Send className="h-6 w-6" />
              <span className="text-sm">Mensagem Padrão</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2"
              disabled={!status.connected}
            >
              <CheckCircle className="h-6 w-6" />
              <span className="text-sm">Status do Serviço</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppManager;
