import { apiClient } from '@/shared/utils/apiClient';
import type { DashboardResponse, ReportResponse } from '../types';

const BASE_URL = '/analytics';

export const analyticsService = {
  // Get dashboard data
  getDashboard: async (businessId: string, period: 'week' | 'month' = 'week'): Promise<DashboardResponse> => {
    const response = await apiClient.get(`${BASE_URL}/dashboard`, {
      params: {
        businessId,
        period
      }
    });
    return response.data as DashboardResponse;
  },

  // Get reports data
  getReports: async (
    businessId: string,
    type: 'appointments' | 'revenue' | 'services',
    from: string,
    to: string,
    groupBy: 'week' | 'month' = 'month'
  ): Promise<ReportResponse> => {
    const response = await apiClient.get(`${BASE_URL}/reports`, {
      params: {
        businessId,
        type,
        from,
        to,
        groupBy
      }
    });
    return response.data as ReportResponse;
  }
};
