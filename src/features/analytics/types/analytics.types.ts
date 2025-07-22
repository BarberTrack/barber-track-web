// Tipos para el endpoint /analytics/dashboard
export interface DashboardOverview {
  totalAppointments: number;
  completedAppointments: number;
  revenue: number;
  averageRating: number;
}

export interface DashboardTrends {
  appointmentGrowth: number;
  revenueGrowth: number;
}

export interface TopService {
  serviceName: string;
  totalAppointments: number;
  revenue: number;
  averageRating: number;
}

export interface TopBarber {
  barberName: string;
  totalAppointments: number;
  revenue: number;
  averageRating: number;
}

export interface DashboardData {
  overview: DashboardOverview;
  trends: DashboardTrends;
  topServices: TopService[];
  topBarbers: TopBarber[];
  period: string;
  generatedAt: string;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

// Tipos para el endpoint /analytics/ml-data/service-trends/{businessId}
export interface BusinessData {
  businessId: string;
  businessName: string;
  location: string;
}

export interface ServiceTrendData {
  serviceId: string;
  serviceName: string;
  currentPeriodBookings: number;
  previousPeriodBookings: number;
  avgPrice: number;
  totalRevenue: number;
  completionRate: number | null;
  avgRating: number | null;
  popularTimeSlots: string[];
}

export interface ZoneMetrics {
  businessesInZone: number;
  avgServiceDemand: Record<string, any>;
  competitorPricing: Record<string, any>;
}

export interface ServiceTrendsData {
  businessData: BusinessData;
  servicesTrendData: ServiceTrendData[];
  zoneMetrics: ZoneMetrics;
  period: string;
  generatedAt: string;
}

export interface ServiceTrendsResponse {
  success: boolean;
  message: string;
  data: ServiceTrendsData;
}

// Tipos para parámetros de consulta
export interface AnalyticsQueryParams {
  period: 'year';
  includeZoneComparison: boolean;
}

// Estado del slice de analytics
export interface AnalyticsState {
  // Dashboard data
  dashboardData: DashboardData | null;
  isDashboardLoading: boolean;
  dashboardError: string | null;
  
  // Service trends data
  serviceTrendsData: ServiceTrendsData | null;
  isServiceTrendsLoading: boolean;
  serviceTrendsError: string | null;
  
  // Último businessId usado para cache
  currentBusinessId: string | null;
  lastFetchTime: string | null;
} 