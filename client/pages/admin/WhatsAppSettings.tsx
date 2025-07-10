import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  MessageCircle,
  Settings,
  Smartphone,
  Bell,
  Users,
  LogOut,
  Scissors,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAppStore } from "@/stores/useAppStore";
import WhatsAppManager from "@/components/admin/WhatsAppManager";

const WhatsAppSettings = () => {
  const { logout, user } = useAppStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors group"
              >
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Voltar ao Dashboard
              </Link>

              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Configurações WhatsApp
                  </h1>
                  <p className="text-sm text-gray-600">
                    Gerencie notificações automáticas
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Notificações Automáticas WhatsApp
            </h2>
            <p className="text-gray-600">
              Configure o WhatsApp para enviar notificações automáticas quando
              um cliente faz um agendamento. As mensagens são enviadas tanto
              para o cliente quanto para o salão.
            </p>
          </div>

          {/* Overview Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white mb-8">
            <CardContent className="p-8">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-green-200" />
                <h3 className="text-2xl font-bold mb-2">
                  Notificações Automáticas
                </h3>
                <p className="text-green-100 text-lg">
                  Quando um cliente faz um agendamento, automaticamente:
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center">
                    <span className="bg-green-400 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      📱 Cliente recebe confirmação no WhatsApp
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="bg-green-400 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      💼 Salão recebe notificação do novo agendamento
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Manager Component */}
          <WhatsAppManager />

          {/* How it Works */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Como Funcionam as Notificações</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border border-green-200 bg-green-50">
                    <CardContent className="p-6">
                      <h4 className="font-medium text-green-800 mb-3 flex items-center">
                        <span className="bg-green-200 text-green-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                          📱
                        </span>
                        Para o Cliente
                      </h4>
                      <div className="text-sm text-green-700 space-y-2">
                        <p>• Confirmação do agendamento</p>
                        <p>• Detalhes do serviço e horário</p>
                        <p>• Endereço e instruções</p>
                        <p>• Contato do salão</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-blue-200 bg-blue-50">
                    <CardContent className="p-6">
                      <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                        <span className="bg-blue-200 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                          💼
                        </span>
                        Para o Salão
                      </h4>
                      <div className="text-sm text-blue-700 space-y-2">
                        <p>• Notificação de novo agendamento</p>
                        <p>• Dados do cliente</p>
                        <p>• Serviço solicitado</p>
                        <p>• Data e horário</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h4 className="font-medium text-yellow-800 mb-3 flex items-center">
                    <span className="bg-yellow-200 text-yellow-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      ⚡
                    </span>
                    Automático e Instantâneo
                  </h4>
                  <div className="text-sm text-yellow-700 space-y-2">
                    <p>
                      ✅ Ativado automaticamente quando o WhatsApp está
                      conectado
                    </p>
                    <p>
                      ✅ Mensagens enviadas imediatamente após o agendamento
                    </p>
                    <p>✅ Não requer intervenção manual</p>
                    <p>✅ Funciona 24 horas por dia, 7 dias por semana</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-medium text-blue-800 mb-3">
                    📋 Configuração do Número do Salão:
                  </h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Atualmente configurado para: <strong>(11) 3333-4444</strong>
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    Alterar Número do Salão
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppSettings;
