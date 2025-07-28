export { Analytics_page } from './page/Analytics_page';

export {
  AnalyticsHeader,
  FiltersPanel,
  TrendsSection,
  ServicesAnalytics,
  BarbersRanking,
  PeakHoursChart,
} from './components';

export {
  useAnalyticsDashboard,
  useAnalyticsReports,
  useAnalyticsFilters,
  useChartData,
} from './hooks';

export { analyticsService } from './services/analyticsService';

export {
  fetchDashboard,
  fetchReports,
  setPeriod,
  setReportType,
  setDateRange,
  setGroupBy,
  clearDashboardError,
  clearReportsError,
  clearAllErrors,
} from './store/analyticsSlice';

export type {
  DashboardData,
  ReportData,
  PopularService,
  TopBarber,
  Trends,
  PeriodInfo,
  ReportFilters,
  AppointmentData,
  RevenueData,
  ServiceData,
  PeakHour,
  ReportSummary,
  ChartDataPoint,
  DashboardResponse,
  ReportResponse,
  AnalyticsState,
  AnalyticsHeaderProps,
  TrendsSectionProps,
  ServicesAnalyticsProps,
  BarbersRankingProps,
  FiltersPanelProps,
} from './types'; 