import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Scissors,
  MessageCircle,
  Settings,
} from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import AdminLayout from "@/components/AdminLayout";

const Dashboard = () => {
  const { getDashboardMetrics, user, appointments, clients, services } =
    useAppStore();

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
      setWhatsappStatus({
        connected: false,
        error: "WhatsApp service not available",
      });
    }
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
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bem-vindo de volta, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Aqui está um resumo das atividades da sua barbearia hoje.
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
