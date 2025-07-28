// Tipos base para appointments
export interface Appointment {
  id: string;
  clientId: string;
  businessId: string;
  barberId: string;
  serviceId: string;
  packageId: string | null;
  scheduledDatetime: string;
  durationMinutes: number;
  totalPrice: string;
  status: AppointmentStatus;
  clientNotes: string;
  barberNotes: string | null;
  statusHistory: StatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
  cancelledAt: string | null;
  cancelledById: string | null;
  reminder24hSentAt: string | null;
  reminder2hSentAt: string | null;
  remindersEnabled: boolean;
  business: AppointmentBusiness;
  barber: AppointmentBarber;
  service: AppointmentService;
  package: AppointmentPackage | null;
}

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export interface StatusHistoryItem {
  id: string;
  appointmentId: string;
  status: AppointmentStatus;
  changedAt: string;
  changedBy: string;
  reason?: string;
  notes?: string;
}

export interface AppointmentBusiness {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface AppointmentBarber {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  profileImageUrl: string | null;
}

export interface AppointmentService {
  id: string;
  name: string;
  description: string;
  price: string;
  durationMinutes: number;
  categoryId: string;
}

export interface AppointmentPackage {
  id: string;
  name: string;
  description: string;
  price: string;
  durationMinutes: number;
  services: AppointmentService[];
}

// Tipos para la respuesta de la API
export interface AppointmentsResponse {
  success: boolean;
  message: string;
  data: AppointmentsData;
}

export interface AppointmentsData {
  appointments: Appointment[];
  total: number;
  page: number;
  totalPages: number;
  statusStats: StatusStats;
  filters: ApiFilters;
}

export interface StatusStats {
  scheduled: number;
  confirmed: number;
  in_progress: number;
  completed: number;
  cancelled: number;
}

export interface ApiFilters {
  businessId: string;
  status?: AppointmentStatus;
  from?: string;
  to?: string;
}

// Tipos para filtros y paginación
export interface QueryParams {
  limit?: number;
  page?: number;
  status?: AppointmentStatus;
  barberId?: string;
  from?: string;
  to?: string;
}

export interface PaginationInfo {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export interface FilterState {
  status?: AppointmentStatus;
  barberId?: string;
  page: number;
  limit: number;
  from?: string;
  to?: string;
}

// Tipo para el estado del slice
export interface AppointmentState {
  appointments: Appointment[];
  statusStats: StatusStats;
  pagination: PaginationInfo;
  isLoading: boolean;
  error: string | null;
  filters: FilterState;
} 