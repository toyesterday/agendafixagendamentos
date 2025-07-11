import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Download,
  Filter,
  Clock,
  Scissors,
} from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import AdminLayout from "@/components/AdminLayout";

const Reports = () => {
  const { appointments, clients, services, getDashboardMetrics } =
    useAppStore();
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const metrics = getDashboardMetrics();

  // Revenue by month
  const getRevenueByMonth = () => {
    const monthlyRevenue: { [key: string]: number } = {};

    appointments.forEach((appointment) => {
      const date = new Date(appointment.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!monthlyRevenue[monthKey]) {
        monthlyRevenue[monthKey] = 0;
      }
      monthlyRevenue[monthKey] += appointment.totalPrice;
    });

    return Object.entries(monthlyRevenue)
      .map(([month, revenue]) => ({
        month: month,
        revenue: revenue,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Last 6 months
  };

  // Appointments by day of week
  const getAppointmentsByDayOfWeek = () => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const appointmentsByDay = days.map((day, index) => ({
      day,
      appointments: appointments.filter(
        (appointment) => new Date(appointment.date).getDay() === index,
      ).length,
    }));

    return appointmentsByDay;
  };

  // Services revenue distribution
  const getServicesRevenue = () => {
    const serviceRevenue: { [key: string]: number } = {};

    appointments.forEach((appointment) => {
      const service = services.find((s) => s.id === appointment.serviceId);
      if (service) {
        if (!serviceRevenue[service.name]) {
          serviceRevenue[service.name] = 0;
        }
        serviceRevenue[service.name] += appointment.totalPrice;
      }
    });

    return Object.entries(serviceRevenue).map(([name, revenue]) => ({
      name,
      revenue,
    }));
  };

  // Client acquisition over time
  const getClientAcquisition = () => {
    const clientsByMonth: { [key: string]: number } = {};

    clients.forEach((client) => {
      // Find first appointment for this client
      const firstAppointment = appointments
        .filter((app) => app.clientId === client.id)
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        )[0];

      if (firstAppointment) {
        const date = new Date(firstAppointment.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

        if (!clientsByMonth[monthKey]) {
          clientsByMonth[monthKey] = 0;
        }
        clientsByMonth[monthKey]++;
      }
    });

    return Object.entries(clientsByMonth)
      .map(([month, clients]) => ({
        month,
        clients,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);
  };

  const revenueData = getRevenueByMonth();
  const appointmentsByDay = getAppointmentsByDayOfWeek();
  const servicesRevenue = getServicesRevenue();
  const clientAcquisition = getClientAcquisition();

  const COLORS = [
    "#8b5cf6",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#6366f1",
  ];

  const exportReport = () => {
    const reportData = {
      period: selectedPeriod,
      generated: new Date().toISOString(),
      metrics: {
        totalRevenue: revenueData.reduce((sum, item) => sum + item.revenue, 0),
        totalAppointments: appointments.length,
        totalClients: clients.length,
        activeServices: services.filter((s) => s.isActive).length,
      },
      revenueByMonth: revenueData,
      appointmentsByDay,
      servicesRevenue,
      clientAcquisition,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-agendafixa-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Relatórios e Analytics
            </h1>
            <p className="text-gray-600">
              Acompanhe o desempenho da sua barbearia
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Receita Total
                  </p>
                  <p className="text-2xl font-bold">
                    R${" "}
                    {revenueData
                      .reduce((sum, item) => sum + item.revenue, 0)
                      .toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Total Agendamentos
                  </p>
                  <p className="text-2xl font-bold">{appointments.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Total Clientes
                  </p>
                  <p className="text-2xl font-bold">{clients.length}</p>
                </div>
                <Users className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">
                    Ticket Médio
                  </p>
                  <p className="text-2xl font-bold">
                    R${" "}
                    {appointments.length > 0
                      ? (
                          revenueData.reduce(
                            (sum, item) => sum + item.revenue,
                            0,
                          ) / appointments.length
                        ).toFixed(2)
                      : "0.00"}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Receita por Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `R$ ${Number(value).toFixed(2)}`,
                      "Receita",
                    ]}
                  />
                  <Bar dataKey="revenue" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Appointments by Day */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Agendamentos por Dia da Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={appointmentsByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="appointments" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Services Revenue Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Receita por Serviço</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={servicesRevenue}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {servicesRevenue.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `R$ ${Number(value).toFixed(2)}`,
                      "Receita",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Client Acquisition */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Novos Clientes por Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={clientAcquisition}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="clients"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Services Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Serviços Mais Populares</CardTitle>
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
                    <Badge variant="secondary" className="text-xs">
                      {(
                        (service.revenue /
                          revenueData.reduce(
                            (sum, item) => sum + item.revenue,
                            0,
                          )) *
                        100
                      ).toFixed(1)}
                      % do total
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Reports;
