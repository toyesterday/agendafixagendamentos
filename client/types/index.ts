export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: string;
  image?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate?: string;
  address?: string;
  notes?: string;
  totalAppointments: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  date: string;
  time: string;
  status:
    | "pending"
    | "confirmed"
    | "in-progress"
    | "completed"
    | "cancelled"
    | "no-show";
  notes?: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  // Populated fields
  client?: Client;
  service?: Service;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  minQuantity: number;
  price: number;
  cost: number;
  supplier?: string;
  barcode?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  date: string;
  appointmentId?: string;
  productId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Populated fields
  appointment?: Appointment;
  product?: Product;
}

export interface BusinessConfig {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  openingHours: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  timeSlotDuration: number; // in minutes
  advanceBookingDays: number;
  cancellationHours: number;
  theme: "light" | "dark";
  notifications: {
    email: boolean;
    whatsapp: boolean;
    sms: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppConfig {
  id: string;
  salonName: string;
  salonAddress: string;
  salonPhone: string;
  adminPhone: string; // Número que recebe notificações do salão

  // Templates de mensagem
  clientMessageTemplate: string;
  salonMessageTemplate: string;

  // Configurações
  autoSendToClient: boolean;
  autoSendToSalon: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface BookingData {
  services: {
    serviceId: string;
    quantity: number;
  }[];
  date: string;
  time: string;
  clientData: {
    name: string;
    email: string;
    phone: string;
    notes?: string;
  };
  totalPrice: number;
  totalDuration: number;
}

export interface DashboardMetrics {
  todayAppointments: number;
  weekAppointments: number;
  monthRevenue: number;
  totalClients: number;
  pendingAppointments: number;
  lowStockProducts: number;
  recentAppointments: Appointment[];
  revenueChart: {
    period: string;
    income: number;
    expenses: number;
  }[];
  topServices: {
    serviceId: string;
    serviceName: string;
    count: number;
    revenue: number;
  }[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  // Authentication
  isAuthenticated: boolean;
  user: User | null;

  // Main data
  clients: Client[];
  services: Service[];
  appointments: Appointment[];
  products: Product[];
  transactions: Transaction[];
  businessConfig: BusinessConfig | null;

  // Booking flow
  bookingData: Partial<BookingData>;
  currentBookingStep: number;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  // Client actions
  addClient: (
    client: Omit<
      Client,
      "id" | "createdAt" | "updatedAt" | "totalAppointments" | "totalSpent"
    >,
  ) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClient: (id: string) => Client | undefined;

  // Service actions
  addService: (
    service: Omit<Service, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  getService: (id: string) => Service | undefined;
  getActiveServices: () => Service[];

  // Appointment actions
  addAppointment: (
    appointment: Omit<Appointment, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  getAppointment: (id: string) => Appointment | undefined;
  getAppointmentsByDate: (date: string) => Appointment[];
  getAvailableTimeSlots: (date: string, serviceId: string) => string[];

  // Product actions
  addProduct: (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  getLowStockProducts: () => Product[];

  // Transaction actions
  addTransaction: (
    transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionsByDateRange: (
    startDate: string,
    endDate: string,
  ) => Transaction[];

  // Booking flow actions
  updateBookingData: (data: Partial<BookingData>) => void;
  setBookingStep: (step: number) => void;
  resetBooking: () => void;
  addServiceToBooking: (serviceId: string) => void;
  removeServiceFromBooking: (serviceId: string) => void;
  submitBooking: () => Promise<boolean>;

  // Dashboard actions
  getDashboardMetrics: () => DashboardMetrics;

  // Business config actions
  updateBusinessConfig: (config: Partial<BusinessConfig>) => void;

  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export type BookingStep = 1 | 2 | 3 | 4;

export interface NotificationTemplate {
  type: "confirmation" | "reminder" | "cancellation";
  channel: "email" | "whatsapp" | "sms";
  subject?: string;
  message: string;
}
