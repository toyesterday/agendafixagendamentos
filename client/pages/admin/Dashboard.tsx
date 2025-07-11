import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  LogOut,
  Bell,
  Scissors,
  MessageCircle,
  Wifi,
  WifiOff,
  Settings,
} from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";

const Dashboard = () => {
  const { getDashboardMetrics, logout, user, appointments, clients, services } =
    useAppStore();
  const navigate = useNavigate();

  const [whatsappStatus, setWhatsappStatus] = useState({
    connected: false,
    error: null,
  });
  const [showAllAppointments, setShowAllAppointments] = useState(false);

  const metrics = getDashboardMetrics();

  useEffect(() => {
    fetchWhatsAppStatus();
  }, []);

  const fetchWhatsAppStatus = async () => {
    try {
      const response = await fetch("/api/whatsapp/status");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setWhatsappStatus(data.data);
      } else {
        setWhatsappStatus({
          connected: false,
          error: "WhatsApp service unavailable",
        });
      }
    } catch (error) {
      console.error("Failed to fetch WhatsApp status:", error);
      // Set default state when WhatsApp service is unavailable
      setWhatsappStatus({
        connected: false,
        error: "WhatsApp service not available",
      });
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleNewAppointment = () => {
    // Navigate to booking flow
    navigate("/booking");
  };

  const handleAddClient = () => {
    // For now, show an alert. In a real app, this would open a modal or navigate to a form
    alert(
      "✨ Funcionalidade em desenvolvimento!\n\n📝 Clientes são criados automaticamente quando fazem agendamentos pelo site.\n\n💡 Em breve: Interface para adicionar clientes manualmente.",
    );
  };

  const handleManageServices = () => {
    // For now, show an alert. In a real app, this would navigate to a services management page
    alert(
      "✨ Funcionalidade em desenvolvimento!\n\n⚙️ Por enquanto, os serviços estão pré-configurados.\n\n💡 Em breve: Interface completa para gerenciar serviços (criar, editar, preços, etc.)",
    );
  };

  const handleReports = () => {
    // For now, show an alert. In a real app, this would navigate to a reports page
    alert(
      "📊 Funcionalidade em desenvolvimento!\n\n📈 Por enquanto, você pode ver as métricas principais aqui no dashboard.\n\n💡 Em breve: Relatórios detalhados com gráficos e exportação.",
    );
  };

  const handleViewAllAppointments = () => {
    setShowAllAppointments(!showAllAppointments);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado";
      case "pending":
        return "Pendente";
      case "completed":
        return "Concluído";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-lg">
                  <Scissors className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    AgendaFixa
                  </h1>
                  <p className="text-sm text-gray-600">Painel Administrativo</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/admin/whatsapp">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  {whatsappStatus.connected ? (
                    <Wifi className="h-4 w-4 text-green-500" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-500" />
                  )}
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp</span>
                </Button>
              </Link>

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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Bem-vindo de volta, {user?.name}!
          </h2>
          <p className="text-gray-600">
            Aqui está um resumo das atividades da sua barbearia hoje.
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Agendamentos Hoje
                  </p>
                  <p className="text-3xl font-bold">
                    {metrics.todayAppointments}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Total de Clientes
                  </p>
                  <p className="text-3xl font-bold">{metrics.totalClients}</p>
                </div>
                <Users className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Receita do Mês
                  </p>
                  <p className="text-3xl font-bold">
                    R$ {metrics.monthRevenue.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Appointments */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Agendamentos Recentes</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewAllAppointments}
                >
                  {showAllAppointments ? "Ver menos" : "Ver todos"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(showAllAppointments
                  ? appointments
                  : metrics.recentAppointments
                ).map((appointment) => {
                  const client = clients.find(
                    (c) => c.id === appointment.clientId,
                  );
                  const service = services.find(
                    (s) => s.id === appointment.serviceId,
                  );

                  return (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {client?.name}
                        </p>
                        <p className="text-sm text-gray-600">{service?.name}</p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {appointment.date}
                          <Clock className="h-3 w-3 ml-3 mr-1" />
                          {appointment.time}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={`${getStatusColor(appointment.status)} border-0`}
                        >
                          {getStatusLabel(appointment.status)}
                        </Badge>
                        <p className="text-sm font-medium text-gray-800 mt-1">
                          R$ {appointment.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Services */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Serviços Mais Populares</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.topServices.map((service, index) => (
                  <div
                    key={service.serviceId}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {service.serviceName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {service.count} agendamentos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        R$ {service.revenue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Button
                  key="new-appointment"
                  onClick={handleNewAppointment}
                  className="h-16 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <div className="text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-1" />
                    <span className="text-sm">Novo Agendamento</span>
                  </div>
                </Button>

                <Button
                  key="add-client"
                  onClick={handleAddClient}
                  className="h-16 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto mb-1" />
                    <span className="text-sm">Adicionar Cliente</span>
                  </div>
                </Button>

                <Button
                  key="manage-services"
                  onClick={handleManageServices}
                  className="h-16 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                >
                  <div className="text-center">
                    <Scissors className="h-6 w-6 mx-auto mb-1" />
                    <span className="text-sm">Gerenciar Serviços</span>
                  </div>
                </Button>

                <Link
                  key="whatsapp-link"
                  to="/admin/whatsapp"
                  className="block"
                >
                  <Button
                    className={`h-16 w-full ${whatsappStatus.connected ? "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" : "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"}`}
                  >
                    <div className="text-center">
                      <MessageCircle className="h-6 w-6 mx-auto mb-1" />
                      <span className="text-sm">WhatsApp</span>
                    </div>
                  </Button>
                </Link>

                <Link
                  key="whatsapp-config-link"
                  to="/admin/whatsapp-config"
                  className="block"
                >
                  <Button className="h-16 w-full bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700">
                    <div className="text-center">
                      <Settings className="h-6 w-6 mx-auto mb-1" />
                      <span className="text-sm">Config WhatsApp</span>
                    </div>
                  </Button>
                </Link>

                <Button
                  key="reports"
                  onClick={handleReports}
                  className="h-16 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  <div className="text-center">
                    <TrendingUp className="h-6 w-6 mx-auto mb-1" />
                    <span className="text-sm">Relatórios</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
