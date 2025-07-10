import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  AppState,
  Client,
  Service,
  Appointment,
  Transaction,
  BookingData,
  DashboardMetrics,
  BusinessConfig,
} from "../types";
import {
  sampleUser,
  sampleClients,
  sampleServices,
  sampleAppointments,
  sampleTransactions,
  sampleBusinessConfig,
} from "./sampleData";

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Authentication state
      isAuthenticated: false,
      user: null,

      // Main data
      clients: sampleClients,
      services: sampleServices,
      appointments: sampleAppointments,
      transactions: sampleTransactions,
      businessConfig: sampleBusinessConfig,

      // Booking flow state
      bookingData: {},
      currentBookingStep: 1,

      // UI state
      isLoading: false,
      error: null,

      // Authentication actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (email === "admin@agendafixa.com" && password === "admin123") {
          set({
            isAuthenticated: true,
            user: sampleUser,
            isLoading: false,
          });
          return true;
        } else {
          set({
            error: "Email ou senha inválidos",
            isLoading: false,
          });
          return false;
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          error: null,
        });
      },

      // Client actions
      addClient: (clientData) => {
        const newClient: Client = {
          ...clientData,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          totalAppointments: 0,
          totalSpent: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          clients: [...state.clients, newClient],
        }));
      },

      updateClient: (id, clientData) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id
              ? {
                  ...client,
                  ...clientData,
                  updatedAt: new Date().toISOString(),
                }
              : client,
          ),
        }));
      },

      deleteClient: (id) => {
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id),
        }));
      },

      getClient: (id) => {
        return get().clients.find((client) => client.id === id);
      },

      // Service actions
      addService: (serviceData) => {
        const newService: Service = {
          ...serviceData,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          services: [...state.services, newService],
        }));
      },

      updateService: (id, serviceData) => {
        set((state) => ({
          services: state.services.map((service) =>
            service.id === id
              ? {
                  ...service,
                  ...serviceData,
                  updatedAt: new Date().toISOString(),
                }
              : service,
          ),
        }));
      },

      deleteService: (id) => {
        set((state) => ({
          services: state.services.filter((service) => service.id !== id),
        }));
      },

      getService: (id) => {
        return get().services.find((service) => service.id === id);
      },

      getActiveServices: () => {
        return get().services.filter((service) => service.active);
      },

      // Appointment actions
      addAppointment: (appointmentData) => {
        const newAppointment: Appointment = {
          ...appointmentData,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          appointments: [...state.appointments, newAppointment],
        }));
      },

      updateAppointment: (id, appointmentData) => {
        set((state) => ({
          appointments: state.appointments.map((appointment) =>
            appointment.id === id
              ? {
                  ...appointment,
                  ...appointmentData,
                  updatedAt: new Date().toISOString(),
                }
              : appointment,
          ),
        }));
      },

      deleteAppointment: (id) => {
        set((state) => ({
          appointments: state.appointments.filter(
            (appointment) => appointment.id !== id,
          ),
        }));
      },

      getAppointment: (id) => {
        return get().appointments.find((appointment) => appointment.id === id);
      },

      getAppointmentsByDate: (date) => {
        return get().appointments.filter(
          (appointment) => appointment.date === date,
        );
      },

      getAvailableTimeSlots: (date, serviceId) => {
        const { appointments, services, businessConfig } = get();
        const service = services.find((s) => s.id === serviceId);
        if (!service || !businessConfig) return [];

        const dayOfWeek = new Date(date).getDay();
        const days = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ];
        const dayConfig = businessConfig.openingHours[days[dayOfWeek]];

        if (dayConfig.closed) return [];

        const bookedTimes = appointments
          .filter((apt) => apt.date === date && apt.status !== "cancelled")
          .map((apt) => apt.time);

        const slots = [];
        const startTime = parseInt(dayConfig.open.replace(":", ""));
        const endTime = parseInt(dayConfig.close.replace(":", ""));
        const slotDuration = businessConfig.timeSlotDuration;

        for (let time = startTime; time < endTime; time += slotDuration) {
          const hours = Math.floor(time / 100);
          const minutes = time % 100;
          const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

          if (!bookedTimes.includes(timeString)) {
            slots.push(timeString);
          }
        }

        return slots;
      },

      // Transaction actions
      addTransaction: (transactionData) => {
        const newTransaction: Transaction = {
          ...transactionData,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }));
      },

      updateTransaction: (id, transactionData) => {
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === id
              ? {
                  ...transaction,
                  ...transactionData,
                  updatedAt: new Date().toISOString(),
                }
              : transaction,
          ),
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter(
            (transaction) => transaction.id !== id,
          ),
        }));
      },

      getTransactionsByDateRange: (startDate, endDate) => {
        return get().transactions.filter(
          (transaction) =>
            transaction.date >= startDate && transaction.date <= endDate,
        );
      },

      // Booking flow actions
      updateBookingData: (data) => {
        set((state) => ({
          bookingData: { ...state.bookingData, ...data },
        }));
      },

      setBookingStep: (step) => {
        set({ currentBookingStep: step });
      },

      resetBooking: () => {
        set({ bookingData: { services: [] }, currentBookingStep: 1 });
      },

      // New action to add/remove services from booking
      addServiceToBooking: (serviceId: string) => {
        set((state) => {
          const currentServices = state.bookingData.services || [];
          const existingService = currentServices.find(
            (s) => s.serviceId === serviceId,
          );

          let newServices;
          if (existingService) {
            // Increase quantity
            newServices = currentServices.map((s) =>
              s.serviceId === serviceId
                ? { ...s, quantity: s.quantity + 1 }
                : s,
            );
          } else {
            // Add new service
            newServices = [...currentServices, { serviceId, quantity: 1 }];
          }

          // Calculate totals
          const { services: allServices } = state;
          const totalPrice = newServices.reduce((sum, service) => {
            const serviceData = allServices.find(
              (s) => s.id === service.serviceId,
            );
            return sum + (serviceData?.price || 0) * service.quantity;
          }, 0);

          const totalDuration = newServices.reduce((sum, service) => {
            const serviceData = allServices.find(
              (s) => s.id === service.serviceId,
            );
            return sum + (serviceData?.duration || 0) * service.quantity;
          }, 0);

          return {
            bookingData: {
              ...state.bookingData,
              services: newServices,
              totalPrice,
              totalDuration,
            },
          };
        });
      },

      removeServiceFromBooking: (serviceId: string) => {
        set((state) => {
          const currentServices = state.bookingData.services || [];
          const existingService = currentServices.find(
            (s) => s.serviceId === serviceId,
          );

          if (!existingService) return state;

          let newServices;
          if (existingService.quantity > 1) {
            // Decrease quantity
            newServices = currentServices.map((s) =>
              s.serviceId === serviceId
                ? { ...s, quantity: s.quantity - 1 }
                : s,
            );
          } else {
            // Remove service
            newServices = currentServices.filter(
              (s) => s.serviceId !== serviceId,
            );
          }

          // Calculate totals
          const { services: allServices } = state;
          const totalPrice = newServices.reduce((sum, service) => {
            const serviceData = allServices.find(
              (s) => s.id === service.serviceId,
            );
            return sum + (serviceData?.price || 0) * service.quantity;
          }, 0);

          const totalDuration = newServices.reduce((sum, service) => {
            const serviceData = allServices.find(
              (s) => s.id === service.serviceId,
            );
            return sum + (serviceData?.duration || 0) * service.quantity;
          }, 0);

          return {
            bookingData: {
              ...state.bookingData,
              services: newServices,
              totalPrice,
              totalDuration,
            },
          };
        });
      },

      submitBooking: async () => {
        const { bookingData, addAppointment, addClient, clients, services } =
          get();

        if (
          !bookingData.services?.length ||
          !bookingData.date ||
          !bookingData.time ||
          !bookingData.clientData
        ) {
          return false;
        }

        set({ isLoading: true });

        try {
          // Check if client exists
          let clientId = clients.find(
            (c) => c.email === bookingData.clientData!.email,
          )?.id;

          if (!clientId) {
            // Create new client
            const newClient: Client = {
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: bookingData.clientData!.name,
              email: bookingData.clientData!.email,
              phone: bookingData.clientData!.phone,
              totalAppointments: 0,
              totalSpent: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            addClient(newClient);
            clientId = newClient.id;
          }

          // Create appointments for each service
          let appointmentCounter = 0;
          for (const bookingService of bookingData.services) {
            for (let i = 0; i < bookingService.quantity; i++) {
              // Add a unique suffix to ensure different IDs even in same millisecond
              const uniqueId = `${Date.now()}-${appointmentCounter}-${Math.random().toString(36).substr(2, 9)}`;

              const newAppointment: Appointment = {
                id: uniqueId,
                clientId,
                serviceId: bookingService.serviceId,
                date: bookingData.date,
                time: bookingData.time,
                status: "pending",
                totalPrice:
                  services.find((s) => s.id === bookingService.serviceId)
                    ?.price || 0,
                notes: bookingData.clientData.notes,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };

              set((state) => ({
                appointments: [...state.appointments, newAppointment],
              }));

              appointmentCounter++;
            }
          }

          set({ isLoading: false });
          return true;
        } catch (error) {
          set({ isLoading: false, error: "Erro ao confirmar agendamento" });
          return false;
        }
      },

      // Dashboard actions
      getDashboardMetrics: (): DashboardMetrics => {
        const { appointments, clients, transactions, services } = get();
        const today = new Date().toISOString().split("T")[0];
        const thisMonth = new Date().toISOString().slice(0, 7);

        const todayAppointments = appointments.filter(
          (apt) => apt.date === today,
        ).length;
        const weekAppointments = appointments.filter((apt) => {
          const aptDate = new Date(apt.date);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return aptDate >= weekAgo;
        }).length;

        const monthRevenue = transactions
          .filter((t) => t.type === "income" && t.date.startsWith(thisMonth))
          .reduce((sum, t) => sum + t.amount, 0);

        const pendingAppointments = appointments.filter(
          (apt) => apt.status === "pending",
        ).length;

        const recentAppointments = appointments
          .filter(
            (apt, index, arr) =>
              arr.findIndex((a) => a.id === apt.id) === index,
          ) // Remove any duplicates
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 5);

        // Mock revenue chart data
        const revenueChart = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
          const dateStr = date.toISOString().split("T")[0];
          const income = transactions
            .filter((t) => t.type === "income" && t.date === dateStr)
            .reduce((sum, t) => sum + t.amount, 0);
          const expenses = transactions
            .filter((t) => t.type === "expense" && t.date === dateStr)
            .reduce((sum, t) => sum + t.amount, 0);

          return {
            period: date.toLocaleDateString("pt-BR", { weekday: "short" }),
            income,
            expenses,
          };
        }).reverse();

        // Top services
        const serviceStats = services
          .map((service) => {
            const serviceAppointments = appointments.filter(
              (apt) => apt.serviceId === service.id,
            );
            return {
              serviceId: service.id,
              serviceName: service.name,
              count: serviceAppointments.length,
              revenue: serviceAppointments.reduce(
                (sum, apt) => sum + apt.totalPrice,
                0,
              ),
            };
          })
          .filter((service) => service.count > 0) // Only include services with appointments
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 3);

        return {
          todayAppointments,
          weekAppointments,
          monthRevenue,
          totalClients: clients.length,
          pendingAppointments,
          recentAppointments,
          revenueChart,
          topServices: serviceStats,
        };
      },

      // Business config actions
      updateBusinessConfig: (config) => {
        set((state) => ({
          businessConfig: state.businessConfig
            ? {
                ...state.businessConfig,
                ...config,
                updatedAt: new Date().toISOString(),
              }
            : null,
        }));
      },

      // Utility actions
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },
    }),
    {
      name: "agenda-fixa-store",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        clients: state.clients,
        services: state.services,
        appointments: state.appointments,
        transactions: state.transactions,
        businessConfig: state.businessConfig,
      }),
    },
  ),
);
