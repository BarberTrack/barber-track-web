import { apiClient } from '@/shared/utils/apiClient';
import type { 
  DashboardData, 
  ServiceTrendsData,
  AnalyticsQueryParams 
} from '../types/analytics.types';

class AnalyticsService {
  private readonly basePath = '/analytics';

  /**
   * Obtener datos del dashboard de analytics
   */
  async getDashboardData(businessId: string, params: AnalyticsQueryParams): Promise<DashboardData> {
    try {
      if (!businessId || businessId.trim() === '') {
        throw new Error('Business ID es requerido');
      }

      const response = await apiClient.get<DashboardData>(
        `${this.basePath}/dashboard`,
        {
          params: {
            businessId: businessId,
            period: params.period,
          }
        }
      );
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al obtener datos del dashboard');
    }
  }

  /**
   * Obtener tendencias de servicios por businessId
   */
  async getServiceTrends(
    businessId: string, 
    params: AnalyticsQueryParams
  ): Promise<ServiceTrendsData> {
    try {
      if (!businessId || businessId.trim() === '') {
        throw new Error('Business ID es requerido');
      }

      const response = await apiClient.get<ServiceTrendsData>(
        `${this.basePath}/ml-data/service-trends/${businessId}`,
        {
          params: {
            period: params.period,
            includeZoneComparison: params.includeZoneComparison
          }
        }
      );
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error al obtener tendencias de servicios');
    }
  }

  /**
   * Obtener ambos conjuntos de datos al mismo tiempo
   */
  async getCompleteAnalytics(
    businessId: string, 
    params: AnalyticsQueryParams
  ): Promise<{ dashboard: DashboardData; serviceTrends: ServiceTrendsData }> {
    try {
      const [dashboardData, serviceTrendsData] = await Promise.all([
        this.getDashboardData(businessId, params),
        this.getServiceTrends(businessId, params)
      ]);

      return {
        dashboard: dashboardData,
        serviceTrends: serviceTrendsData
      };
    } catch (error: any) {
      throw new Error(error.message || 'Error al obtener datos de analytics');
    }
  }
}

export const analyticsService = new AnalyticsService(); 