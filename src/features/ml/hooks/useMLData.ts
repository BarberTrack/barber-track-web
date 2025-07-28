import { useState, useEffect } from 'react';
import { mlService } from '../services/mlService';
import type { MLData, ServiceTrendsResponse, PromotionPredictionsResponse } from '../types';

export const useMLData = (businessId: string) => {
  const [data, setData] = useState<MLData>({
    serviceTrends: null,
    promotionPredictions: null,
    loading: true,
    error: null,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMLData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setData(prev => ({ ...prev, loading: true, error: null }));
      }

      const mlData = await mlService.getMLData(businessId);
      
      setData({
        serviceTrends: mlData.serviceTrends,
        promotionPredictions: mlData.promotionPredictions,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setData(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchServiceTrends = async (): Promise<ServiceTrendsResponse | null> => {
    try {
      const serviceTrends = await mlService.getServiceTrends(businessId);
      setData(prev => ({
        ...prev,
        serviceTrends,
        error: null,
      }));
      return serviceTrends;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al obtener tendencias';
      setData(prev => ({ ...prev, error: errorMessage }));
      return null;
    }
  };

  const fetchPromotionPredictions = async (): Promise<PromotionPredictionsResponse | null> => {
    try {
      const promotionPredictions = await mlService.getPromotionPredictions(businessId);
      
      setData(prev => ({
        ...prev,
        promotionPredictions,
        error: null,
      }));
      return promotionPredictions;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al obtener promociones';
      setData(prev => ({ ...prev, error: errorMessage }));
      return null;
    }
  };

  const refresh = () => {
    fetchMLData(true);
  };

  useEffect(() => {
    if (businessId) {
      fetchMLData();
    }
  }, [businessId]);

  return {
    ...data,
    isRefreshing,
    refresh,
    fetchServiceTrends,
    fetchPromotionPredictions,
  };
}; 