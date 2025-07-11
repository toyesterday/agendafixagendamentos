import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import WhatsAppManager from "@/components/admin/WhatsAppManager";
import AdminLayout from "@/components/AdminLayout";

const WhatsAppSettings = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Notificações Automáticas WhatsApp
          </h1>
          <p className="text-gray-600">
            Configure o WhatsApp para enviar notificações automáticas quando um
            cliente faz um agendamento. As mensagens são enviadas tanto para o
            cliente quanto para o salão.
          </p>
        </div>

        {/* Simple Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 text-green-600" />
            <h3 className="text-xl font-bold text-green-800 mb-2">
              Notificações Automáticas
            </h3>
            <p className="text-green-700">
              Conecte o WhatsApp abaixo para ativar as notificações automáticas
              de agendamento.
            </p>
          </div>
        </div>

        {/* WhatsApp Manager Component */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-6 w-6 mr-2 text-purple-600" />
              Gerenciar WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WhatsAppManager />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default WhatsAppSettings;
