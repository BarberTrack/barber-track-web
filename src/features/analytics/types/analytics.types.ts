// Dashboard Types
export interface PopularService {
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

export interface Trends {
  appointmentGrowth: number;
  revenueGrowth: number;
}

export interface PeriodInfo {
  period: 'week' | 'month';
  startDate: string;
  endDate: string;
  daysInPeriod: number;
}

export interface DashboardData {
  businessId: string;
  period: 'week' | 'month';
  dashboard: {
    totalAppointments: number;
    totalRevenue: number;
    averageRating: number;
    activeBarbers: number;
    popularServices: PopularService[];
    topBarbers: TopBarber[];
    trends: Trends;
    periodInfo: PeriodInfo;
  };
  timestamp: string;
}

// Reports Types
export interface ReportFilters {
  from: string;
  to: string;
  groupBy: 'week' | 'month';
}

export interface AppointmentData {
  appointments: Array<{
    date: string;
    count: number;
    completed: number;
    cancelled: number;
    revenue: number;
  }>;
}

export interface RevenueData {
  revenue: Array<{
    date: string;
    count: number;
    revenue: number;
    services: number;
    averageTicket: number;
  }>;
}

export interface ServiceData {
  services: Array<{
    count: number;
    revenue: number;
    serviceName: string;
    totalAppointments: number;
    averageRating: number;
    uniqueClients: number;
  }>;
}

export interface PeakHour {
  serviceId: string;
  serviceName: string;
  busiestHour: string;
  busiestHourCount: number;
  totalAppointments: number;
  totalRevenue: number;
}

export interface ReportSummary {
  total: number;
  average: number;
  growth: number;
  uniqueUsers: number;
  uniqueServices: number;
}

export interface ChartDataPoint {
  label?: string;
  value: number;
}

export interface ReportData {
  businessId: string;
  type: 'appointments' | 'revenue' | 'services';
  filters: ReportFilters;
  reportData: AppointmentData | RevenueData | ServiceData;
  peakHours?: PeakHour[];
  summary: ReportSummary;
  chartData: ChartDataPoint[];
  generatedAt: string;
}

// API Response Types
export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

export interface ReportResponse {
  success: boolean;
  message: string;
  data: ReportData;
}

// State Types
export interface AnalyticsState {
  dashboard: {
    data: DashboardData | null;
    loading: boolean;
    error: string | null;
  };
  reports: {
    data: ReportData | null;
    loading: boolean;
    error: string | null;
  };
  filters: {
    period: 'week' | 'month';
    reportType: 'appointments' | 'revenue' | 'services';
    dateRange: {
      from: string;
      to: string;
    };
    groupBy: 'week' | 'month';
  };
}

// Component Props Types
export interface AnalyticsHeaderProps {
  data: DashboardData | null;
  loading: boolean;
}

export interface TrendsSectionProps {
  reportData: ReportData | null;
  loading: boolean;
}

export interface ServicesAnalyticsProps {
  services: PopularService[];
  loading: boolean;
}

export interface BarbersRankingProps {
  barbers: TopBarber[];
  loading: boolean;
}

export interface FiltersPanelProps {
  period: 'week' | 'month';
  reportType: 'appointments' | 'revenue' | 'services';
  dateRange: { from: string; to: string };
  groupBy: 'week' | 'month';
  onPeriodChange: (period: 'week' | 'month') => void;
  onReportTypeChange: (type: 'appointments' | 'revenue' | 'services') => void;
  onDateRangeChange: (range: { from: string; to: string }) => void;
  onGroupByChange: (groupBy: 'week' | 'month') => void;
}
