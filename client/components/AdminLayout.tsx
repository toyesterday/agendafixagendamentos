import React, { useState } from "react";
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
  Menu,
  X,
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
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

  const currentPageTitle =
    navigationItems.find((item) => isActivePath(item.path))?.label ||
    "Dashboard";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`${themeClasses.primaryButton} p-2 rounded-lg`}>
                <Scissors className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">
                  AgendaFixa
                </h1>
                <p className="text-xs text-gray-600">Admin Panel</p>
              </div>
            </div>
            {/* Close button for mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={closeSidebar}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 overflow-y-auto">
          <div className="space-y-1 sm:space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                    isActive
                      ? themeClasses.navActive
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="font-medium truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-3 sm:p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div
              className={`w-8 h-8 ${themeClasses.primaryButton} rounded-full flex items-center justify-center flex-shrink-0`}
            >
              <span className="text-white text-sm font-bold">
                {user?.name?.charAt(0) || "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.role}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full text-sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>

              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">
                  {currentPageTitle}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  Gerencie sua barbearia de forma completa
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/booking">
                <Button
                  className={`${themeClasses.primaryButton} text-xs sm:text-sm`}
                  size="sm"
                >
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Novo</span>
                  <span className="hidden sm:inline"> Agendamento</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
