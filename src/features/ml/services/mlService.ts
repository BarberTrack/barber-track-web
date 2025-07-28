import axios from 'axios';
import type { ServiceTrendsResponse, PromotionPredictionsResponse } from '../types';

class MLService {

  private readonly SERVICE_TRENDS_BASE_URL = import.meta.env.VITE_SERVICE_TRENDS_BASE_URL || 'https://service-trends-production.up.railway.app/api/ml';
  private readonly PROMOTIONS_BASE_URL = import.meta.env.VITE_PROMOTIONS_BASE_URL || 'https://ml-promotions-production.up.railway.app/api/ml';

  /**
   * Obtiene las tendencias de servicios para un negocio específico
   */
  async getServiceTrends(businessId: string): Promise<ServiceTrendsResponse> {
    try {
      const response = await axios.get<ServiceTrendsResponse>(
        `${this.SERVICE_TRENDS_BASE_URL}/service-trends/dashboard/${businessId}`,
        {
          timeout: 15000,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('❌ ML Service - Error fetching service trends:', error);
      throw new Error('Error al obtener las tendencias de servicios');
    }
  }

  /**
   * Obtiene las predicciones de promociones para un negocio específico
   */
  async getPromotionPredictions(businessId: string): Promise<PromotionPredictionsResponse> {
    try {
      const response = await axios.get<PromotionPredictionsResponse>(
        `${this.PROMOTIONS_BASE_URL}/promotion-predictions/dashboard`,
        {
          params: { businessId },
          timeout: 15000,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('❌ ML Service - Error fetching promotion predictions:', error);
      throw new Error('Error al obtener las predicciones de promociones');
    }
  }

  /**
   * Obtiene tanto las tendencias de servicios como las predicciones de promociones
   */
  async getMLData(businessId: string): Promise<{
    serviceTrends: ServiceTrendsResponse;
    promotionPredictions: PromotionPredictionsResponse;
  }> {
    try {
      const [serviceTrends, promotionPredictions] = await Promise.all([
        this.getServiceTrends(businessId),
        this.getPromotionPredictions(businessId),
      ]);

      return {
        serviceTrends,
        promotionPredictions,
      };
    } catch (error) {
      console.error('❌ ML Service - Error fetching ML data:', error);
      throw new Error('Error al obtener los datos de ML');
    }
  }
}

export const mlService = new MLService(); 