import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppStore } from "./stores/useAppStore";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import BookingRouter from "./components/BookingRouter";
import Dashboard from "./pages/admin/Dashboard";
import WhatsAppSettings from "./pages/admin/WhatsAppSettings";
import WhatsAppConfig from "./pages/admin/WhatsAppConfig";
import ServicesManagement from "./pages/admin/ServicesManagement";
import ClientsManagement from "./pages/admin/ClientsManagement";
import AppointmentsManagement from "./pages/admin/AppointmentsManagement";
import Reports from "./pages/admin/Reports";
import ThemeSettings from "./pages/admin/ThemeSettings";
import FooterSettings from "./pages/admin/FooterSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  return isAuthenticated ? (
    <Navigate to="/admin/dashboard" replace />
  ) : (
    <>{children}</>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Public Booking Flow */}
          <Route path="/booking/*" element={<BookingRouter />} />

          {/* Authentication */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/whatsapp"
            element={
              <ProtectedRoute>
                <WhatsAppSettings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/whatsapp-config"
            element={
              <ProtectedRoute>
                <WhatsAppConfig />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/services"
            element={
              <ProtectedRoute>
                <ServicesManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/clients"
            element={
              <ProtectedRoute>
                <ClientsManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute>
                <AppointmentsManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/theme-settings"
            element={
              <ProtectedRoute>
                <ThemeSettings />
              </ProtectedRoute>
            }
          />

          {/* Redirect /admin to /admin/dashboard */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
