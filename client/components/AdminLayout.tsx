import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  Scissors,
  MessageCircle,
  Settings,
  TrendingUp,
  LayoutDashboard,
  LogOut,
  FileText,
  Palette,
  Layout,
} from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { getThemeClasses } from "@/types/themes";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout, currentTheme } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const themeClasses = getThemeClasses(currentTheme);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      id: "appointments",
      label: "Agendamentos",
      icon: Calendar,
      path: "/admin/appointments",
    },
    {
      id: "clients",
      label: "Clientes",
      icon: Users,
      path: "/admin/clients",
    },
    {
      id: "services",
      label: "Serviços",
      icon: Scissors,
      path: "/admin/services",
    },
    {
      id: "reports",
      label: "Relatórios",
      icon: TrendingUp,
      path: "/admin/reports",
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: MessageCircle,
      path: "/admin/whatsapp",
    },
    {
      id: "whatsapp-config",
      label: "Config WhatsApp",
      icon: Settings,
      path: "/admin/whatsapp-config",
    },
    {
      id: "theme-settings",
      label: "Configurar Tema",
      icon: Palette,
      path: "/admin/theme-settings",
    },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`${themeClasses.primaryButton} p-2 rounded-lg`}>
              <Scissors className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">AgendaFixa</h1>
              <p className="text-xs text-gray-600">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? themeClasses.navActive
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div
              className={`w-8 h-8 ${themeClasses.primaryButton} rounded-full flex items-center justify-center`}
            >
              <span className="text-white text-sm font-bold">
                {user?.name?.charAt(0) || "A"}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {navigationItems.find((item) => isActivePath(item.path))
                  ?.label || "Dashboard"}
              </h2>
              <p className="text-sm text-gray-600">
                Gerencie sua barbearia de forma completa
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/booking">
                <Button className={themeClasses.primaryButton}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
