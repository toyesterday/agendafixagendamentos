import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import {
  MessageCircle,
  Settings,
  Save,
  Phone,
  MapPin,
  Store,
  CheckCircle,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import AdminLayout from "@/components/AdminLayout";

const WhatsAppConfig = () => {
  const [config, setConfig] = useState({
    salonName: "",
    salonAddress: "",
    salonPhone: "",
    adminPhone: "",
    clientMessageTemplate: "",
    salonMessageTemplate: "",
    autoSendToClient: true,
    autoSendToSalon: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch("/api/whatsapp/config");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setConfig(data.data);
        }
      }
    } catch (error) {
      console.error("Failed to load config:", error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const response = await fetch("/api/whatsapp/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Failed to save config:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setConfig({
      salonName: "Barbearia AgendaFixa",
      salonAddress: "Rua das Flores, 123 - Centro",
      salonPhone: "(11) 99999-9999",
      adminPhone: "(11) 99999-9999",
      clientMessageTemplate: `Olá {clientName}! 👋

Seu agendamento foi confirmado! ✅

📅 Data: {date}
⏰ Horário: {time}
✂️ Serviço: {services}
💰 Valor: R$ {totalPrice}

📍 Endereço: {salonAddress}
📞 Contato: {salonPhone}

Obrigado pela preferência! 😊`,
      salonMessageTemplate: `🔔 NOVO AGENDAMENTO!

👤 Cliente: {clientName}
📞 Telefone: {clientPhone}
📧 Email: {clientEmail}

📅 Data: {date}
⏰ Horário: {time}
✂️ Serviço: {services}
💰 Valor: R$ {totalPrice}

Agendamento realizado em: {bookingTime}`,
      autoSendToClient: true,
      autoSendToSalon: true,
    });
  };

  const getPreviewMessage = (template: string, isClient: boolean) => {
    const sampleData = {
      clientName: "João Silva",
      clientPhone: "(11) 98765-4321",
      clientEmail: "joao@email.com",
      date: "15/12/2023",
      time: "14:30",
      services: "Corte Masculino + Barba",
      totalPrice: "45,00",
      salonAddress: config.salonAddress || "Rua das Flores, 123 - Centro",
      salonPhone: config.salonPhone || "(11) 99999-9999",
      bookingTime: new Date().toLocaleString("pt-BR"),
    };

    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return sampleData[key as keyof typeof sampleData] || match;
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Configurações do WhatsApp
          </h1>
          <p className="text-gray-600">
            Personalize as mensagens automáticas e informações da sua barbearia
          </p>
        </div>

        {saveStatus === "success" && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Configurações salvas com sucesso!
            </AlertDescription>
          </Alert>
        )}

        {saveStatus === "error" && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Erro ao salvar configurações. Tente novamente.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Salon Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="h-5 w-5 mr-2 text-purple-600" />
                Informações da Barbearia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="salonName">Nome da Barbearia</Label>
                <Input
                  id="salonName"
                  value={config.salonName}
                  onChange={(e) =>
                    setConfig({ ...config, salonName: e.target.value })
                  }
                  placeholder="Nome da sua barbearia"
                />
              </div>

              <div>
                <Label htmlFor="salonAddress">Endereço</Label>
                <Input
                  id="salonAddress"
                  value={config.salonAddress}
                  onChange={(e) =>
                    setConfig({ ...config, salonAddress: e.target.value })
                  }
                  placeholder="Endereço completo"
                />
              </div>

              <div>
                <Label htmlFor="salonPhone">Telefone da Barbearia</Label>
                <Input
                  id="salonPhone"
                  value={config.salonPhone}
                  onChange={(e) =>
                    setConfig({ ...config, salonPhone: e.target.value })
                  }
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor="adminPhone">
                  Telefone do Administrador (para receber notificações)
                </Label>
                <Input
                  id="adminPhone"
                  value={config.adminPhone}
                  onChange={(e) =>
                    setConfig({ ...config, adminPhone: e.target.value })
                  }
                  placeholder="(11) 99999-9999"
                />
              </div>
            </CardContent>
          </Card>

          {/* Auto-send Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-purple-600" />
                Configurações de Envio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoSendToClient">Enviar para Cliente</Label>
                  <p className="text-sm text-gray-500">
                    Enviar confirmação automática para o cliente
                  </p>
                </div>
                <Switch
                  id="autoSendToClient"
                  checked={config.autoSendToClient}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, autoSendToClient: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoSendToSalon">Enviar para Barbearia</Label>
                  <p className="text-sm text-gray-500">
                    Enviar notificação para o administrador
                  </p>
                </div>
                <Switch
                  id="autoSendToSalon"
                  checked={config.autoSendToSalon}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, autoSendToSalon: checked })
                  }
                />
              </div>

              <div className="pt-4 space-y-2">
                <h4 className="font-medium text-gray-800">
                  Variáveis Disponíveis:
                </h4>
                <div className="text-xs text-gray-600 grid grid-cols-2 gap-1">
                  <span>• {"{clientName}"}</span>
                  <span>• {"{clientPhone}"}</span>
                  <span>• {"{clientEmail}"}</span>
                  <span>• {"{date}"}</span>
                  <span>• {"{time}"}</span>
                  <span>• {"{services}"}</span>
                  <span>• {"{totalPrice}"}</span>
                  <span>• {"{salonAddress}"}</span>
                  <span>• {"{salonPhone}"}</span>
                  <span>• {"{bookingTime}"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Message Template */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
                Mensagem para o Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clientTemplate">Template da Mensagem</Label>
                <Textarea
                  id="clientTemplate"
                  value={config.clientMessageTemplate}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      clientMessageTemplate: e.target.value,
                    })
                  }
                  rows={8}
                  placeholder="Digite o template da mensagem para o cliente..."
                />
              </div>

              <div>
                <Label>Preview da Mensagem:</Label>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                  <pre className="whitespace-pre-wrap font-sans">
                    {getPreviewMessage(config.clientMessageTemplate, true)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salon Message Template */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-blue-600" />
                Mensagem para a Barbearia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="salonTemplate">Template da Mensagem</Label>
                <Textarea
                  id="salonTemplate"
                  value={config.salonMessageTemplate}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      salonMessageTemplate: e.target.value,
                    })
                  }
                  rows={8}
                  placeholder="Digite o template da mensagem para a barbearia..."
                />
              </div>

              <div>
                <Label>Preview da Mensagem:</Label>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                  <pre className="whitespace-pre-wrap font-sans">
                    {getPreviewMessage(config.salonMessageTemplate, false)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Salvando..." : "Salvar Configurações"}
          </Button>

          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Restaurar Padrão
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default WhatsAppConfig;
