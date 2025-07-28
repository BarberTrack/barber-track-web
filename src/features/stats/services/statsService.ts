import { apiClient } from '@/shared/utils/apiClient';
import type { StatsResponse, Period } from '../types';

const BASE_URL = '/appointments/stats';

export const statsService = {
  // Get stats data for appointments grouped by period
  getStatsData: async (
    businessId: string,
    period: Period = 'month',
    from: string,
    to: string
  ): Promise<StatsResponse> => {
    const response = await apiClient.get(`${BASE_URL}/period`, {
      params: {
        businessId,
        period,
        from,
        to
      }
    });
    return response as StatsResponse;
  }
}; 