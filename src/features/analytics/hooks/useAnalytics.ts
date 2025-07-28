
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  fetchDashboard,
  fetchReports,
  setPeriod,
  setReportType,
  setDateRange,
  setGroupBy,
  clearDashboardError,
  clearReportsError,
  clearAllErrors,
} from '../store/analyticsSlice';
import type { RootState } from '@/app/store';

// Hook for dashboard data
export const useAnalyticsDashboard = (businessId: string) => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state: RootState) => state.analytics.dashboard);
  const { period } = useAppSelector((state: RootState) => state.analytics.filters);

  const getDashboard = (newPeriod?: 'week' | 'month') => {
    const periodToUse = newPeriod || period;
    dispatch(fetchDashboard({ businessId, period: periodToUse }));
  };

  const clearError = () => {
    dispatch(clearDashboardError());
  };

  return {
    data,
    loading,
    error,
    period,
    getDashboard,
    clearError,
  };
};

// Hook for reports data
export const useAnalyticsReports = (businessId: string) => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state: RootState) => state.analytics.reports);
  const { reportType, dateRange, groupBy } = useAppSelector((state: RootState) => state.analytics.filters);

  const getReports = (options?: {
    type?: 'appointments' | 'revenue' | 'services';
    from?: string;
    to?: string;
    groupBy?: 'week' | 'month';
  }) => {
    const params = {
      businessId,
      type: options?.type || reportType,
      from: options?.from || dateRange.from,
      to: options?.to || dateRange.to,
      groupBy: options?.groupBy || groupBy,
    };
    
    dispatch(fetchReports(params));
  };

  const clearError = () => {
    dispatch(clearReportsError());
  };

  return {
    data,
    loading,
    error,
    reportType,
    dateRange,
    groupBy,
    getReports,
    clearError,
  };
};

// Hook for managing filters
export const useAnalyticsFilters = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state: RootState) => state.analytics.filters);

  const updatePeriod = (period: 'week' | 'month') => {
    dispatch(setPeriod(period));
  };

  const updateReportType = (type: 'appointments' | 'revenue' | 'services') => {
    dispatch(setReportType(type));
  };

  const updateDateRange = (range: { from: string; to: string }) => {
    dispatch(setDateRange(range));
  };

  const updateGroupBy = (groupBy: 'week' | 'month') => {
    dispatch(setGroupBy(groupBy));
  };

  const clearErrors = () => {
    dispatch(clearAllErrors());
  };

  return {
    ...filters,
    updatePeriod,
    updateReportType,
    updateDateRange,
    updateGroupBy,
    clearErrors,
  };
};

// Hook for transforming chart data
export const useChartData = () => {
  const formatChartData = (data: any[], type: 'line' | 'bar' | 'pie' = 'line') => {
    if (!data || data.length === 0) return [];

    switch (type) {
      case 'line':
      case 'bar':
        return data.map((item) => ({
          name: item.label ? new Date(item.label).toLocaleDateString('es-ES', { 
            month: 'short', 
            day: 'numeric' 
          }) : item.serviceName || 'N/A',
          value: item.value || item.revenue || item.totalAppointments || 0,
          revenue: item.revenue || 0,
          appointments: item.totalAppointments || item.count || 0,
        }));
      
      case 'pie':
        return data.map((item, index) => ({
          name: item.serviceName || item.barberName || `Item ${index + 1}`,
          value: item.revenue || item.totalAppointments || item.value || 0,
          fill: `hsl(${200 + index * 30}, 70%, 50%)`,
        }));
      
      default:
        return data;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-MX').format(value);
  };

  return {
    formatChartData,
    formatCurrency,
    formatPercentage,
    formatNumber,
  };
};
