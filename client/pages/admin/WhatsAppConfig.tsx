import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
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
  ArrowLeft,
} from "lucide-react";
import { WhatsAppConfig } from "@/types";

const WhatsAppConfigPage = () => {
  const [config, setConfig] = useState<WhatsAppConfig>({
    id: "1",
    salonName: "Barbearia ModernCut",
    salonAddress: "Rua Principal, 456 - Centro, São Paulo/SP",
    salonPhone: "(11) 3333-4444",
    adminPhone: "(11) 99999-8888",
    clientMessageTemplate: `🔮 *{salonName} - Agendamento Confirmado!*

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

Obrigado por escolher a {salonName}! ✨`,
    salonMessageTemplate: `🆕 *NOVO AGENDAMENTO - {salonName}*

📋 *Cliente:* {clientName}
📞 *Telefone:* {clientPhone}
📅 *Data:* {date}
⏰ *Horário:* {time}
✂️ *Serviços:* {services}

💰 *Total:* R$ {totalPrice}

💼 *Sistema AgendaFixa*
Agendamento feito através do site.`,
    autoSendToClient: true,
    autoSendToSalon: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Simula carregar dados (futuramente seria da API)
  useEffect(() => {
    const loadConfig = () => {
      const savedConfig = localStorage.getItem("whatsapp-config");
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }
    };
    loadConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simula salvamento (futuramente seria na API)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      localStorage.setItem("whatsapp-config", JSON.stringify(config));

      setMessage({
        type: "success",
        text: "Configurações do WhatsApp salvas com sucesso!",
      });

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erro ao salvar configurações. Tente novamente.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const defaultTemplate = `🔮 *{salonName} - Agendamento Confirmado!*

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

    const defaultSalonTemplate = `🆕 *NOVO AGENDAMENTO - {salonName}*

📋 *Cliente:* {clientName}
📞 *Telefone:* {clientPhone}
📅 *Data:* {date}
⏰ *Horário:* {time}
✂️ *Serviços:* {services}

💰 *Total:* R$ {totalPrice}

💼 *Sistema AgendaFixa*
Agendamento feito através do site.`;

    setConfig({
      ...config,
      clientMessageTemplate: defaultTemplate,
      salonMessageTemplate: defaultSalonTemplate,
    });
  };

  const updateConfig = (field: keyof WhatsAppConfig, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configurações do WhatsApp</h1>
          <p className="text-gray-600 mt-2">
            Configure as notificações automáticas para diferentes salões
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 hover:bg-green-700"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Salvar Configurações
        </Button>
      </div>

      {message && (
        <Alert
          className={
            message.type === "success"
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }
        >
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription
            className={
              message.type === "success" ? "text-green-700" : "text-red-700"
            }
          >
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Informações do Salão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Store className="h-5 w-5" />
            <span>Informações do Salão</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salonName">Nome do Salão</Label>
              <Input
                id="salonName"
                value={config.salonName}
                onChange={(e) => updateConfig("salonName", e.target.value)}
                placeholder="Ex: Barbearia ModernCut"
              />
            </div>
            <div>
              <Label htmlFor="salonPhone">Telefone do Salão</Label>
              <Input
                id="salonPhone"
                value={config.salonPhone}
                onChange={(e) => updateConfig("salonPhone", e.target.value)}
                placeholder="Ex: (11) 3333-4444"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="salonAddress">Endereço Completo</Label>
            <Input
              id="salonAddress"
              value={config.salonAddress}
              onChange={(e) => updateConfig("salonAddress", e.target.value)}
              placeholder="Ex: Rua Principal, 456 - Centro, São Paulo/SP"
            />
          </div>
          <div>
            <Label htmlFor="adminPhone">
              Telefone do Admin (Recebe Notificações)
            </Label>
            <Input
              id="adminPhone"
              value={config.adminPhone}
              onChange={(e) => updateConfig("adminPhone", e.target.value)}
              placeholder="Ex: (11) 99999-8888"
            />
            <p className="text-sm text-gray-500 mt-1">
              Este número receberá as notificações quando houver novos
              agendamentos
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Notificação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Configurações de Notificação</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoClient">Enviar automático para cliente</Label>
              <p className="text-sm text-gray-500">
                Envia confirmação automaticamente para o cliente após
                agendamento
              </p>
            </div>
            <Switch
              id="autoClient"
              checked={config.autoSendToClient}
              onCheckedChange={(checked) =>
                updateConfig("autoSendToClient", checked)
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoSalon">Enviar automático para salão</Label>
              <p className="text-sm text-gray-500">
                Envia notificação automaticamente para o admin do salão
              </p>
            </div>
            <Switch
              id="autoSalon"
              checked={config.autoSendToSalon}
              onCheckedChange={(checked) =>
                updateConfig("autoSendToSalon", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Templates de Mensagem */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Templates de Mensagem</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Restaurar Padrão
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="clientTemplate">Mensagem para Cliente</Label>
            <Textarea
              id="clientTemplate"
              value={config.clientMessageTemplate}
              onChange={(e) =>
                updateConfig("clientMessageTemplate", e.target.value)
              }
              rows={15}
              className="font-mono text-sm"
            />
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="font-medium text-blue-800 mb-2">
                Variáveis disponíveis:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-700">
                <code>{"{clientName}"}</code>
                <code>{"{date}"}</code>
                <code>{"{time}"}</code>
                <code>{"{services}"}</code>
                <code>{"{salonName}"}</code>
                <code>{"{salonAddress}"}</code>
                <code>{"{salonPhone}"}</code>
                <code>{"{totalPrice}"}</code>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="salonTemplate">Mensagem para Salão</Label>
            <Textarea
              id="salonTemplate"
              value={config.salonMessageTemplate}
              onChange={(e) =>
                updateConfig("salonMessageTemplate", e.target.value)
              }
              rows={12}
              className="font-mono text-sm"
            />
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
              <p className="font-medium text-green-800 mb-2">
                Variáveis disponíveis:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-green-700">
                <code>{"{clientName}"}</code>
                <code>{"{clientPhone}"}</code>
                <code>{"{date}"}</code>
                <code>{"{time}"}</code>
                <code>{"{services}"}</code>
                <code>{"{salonName}"}</code>
                <code>{"{totalPrice}"}</code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview das Mensagens */}
      <Card>
        <CardHeader>
          <CardTitle>Preview das Mensagens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Mensagem para Cliente:</h4>
            <div className="bg-green-50 border border-green-200 rounded p-3 whitespace-pre-wrap text-sm">
              {config.clientMessageTemplate
                .replace(/{salonName}/g, config.salonName)
                .replace(/{salonAddress}/g, config.salonAddress)
                .replace(/{salonPhone}/g, config.salonPhone)
                .replace(/{clientName}/g, "João Silva")
                .replace(/{date}/g, "Segunda-feira, 15 de Janeiro de 2024")
                .replace(/{time}/g, "14:00")
                .replace(/{services}/g, "Corte Masculino, Barba")
                .replace(/{totalPrice}/g, "45,00")}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Mensagem para Salão:</h4>
            <div className="bg-blue-50 border border-blue-200 rounded p-3 whitespace-pre-wrap text-sm">
              {config.salonMessageTemplate
                .replace(/{salonName}/g, config.salonName)
                .replace(/{clientName}/g, "João Silva")
                .replace(/{clientPhone}/g, "(11) 98765-4321")
                .replace(/{date}/g, "Segunda-feira, 15 de Janeiro de 2024")
                .replace(/{time}/g, "14:00")
                .replace(/{services}/g, "Corte Masculino, Barba")
                .replace(/{totalPrice}/g, "45,00")}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppConfigPage;
