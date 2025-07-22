import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  fetchDashboardData,
  fetchServiceTrends,
  fetchCompleteAnalytics,
  clearDashboardError,
  clearServiceTrendsError,
  clearAllErrors,
  clearAllData,
  setCurrentBusinessId,
  selectAnalytics,
} from '../store/analyticsSlice';
import type { AnalyticsQueryParams } from '../types/analytics.types';
import { ToastAlert } from '@/shared/components/ToastAlert';

export const useAnalytics = (businessId?: string) => {
  const dispatch = useAppDispatch();
  const {
    dashboardData,
    isDashboardLoading,
    dashboardError,
    serviceTrendsData,
    isServiceTrendsLoading,
    serviceTrendsError,
    currentBusinessId,
    lastFetchTime,
  } = useAppSelector(selectAnalytics);

  // Parámetros fijos según los requisitos
  const defaultParams: AnalyticsQueryParams = useMemo(() => ({
    period: 'year',
    includeZoneComparison: true,
  }), []);

  // Verificar si hay token válido
  const hasValidToken = useCallback(() => {
    const token = localStorage.getItem('barbertrack_token');
    if (!token) {
      ToastAlert.error('Sesión expirada', 'Por favor inicia sesión nuevamente');
      window.location.href = '/';
      return false;
    }
    return true;
  }, []);

  // Cargar datos del dashboard
  const loadDashboardData = useCallback(async (
    id: string,
    params?: AnalyticsQueryParams
  ) => {
    if (!hasValidToken()) return;
    
    if (!id || id.trim() === '') {
      ToastAlert.error('Error', 'Business ID es requerido');
      return;
    }

    try {
      const queryParams = params || defaultParams;
      const result = await dispatch(fetchDashboardData({ 
        businessId: id, 
        params: queryParams 
      })).unwrap();
      return result;
    } catch (error: any) {
      ToastAlert.error('Error', error || 'Error al cargar datos del dashboard');
      throw error;
    }
  }, [dispatch, defaultParams, hasValidToken]);

  // Cargar tendencias de servicios
  const loadServiceTrends = useCallback(async (
    id: string, 
    params?: AnalyticsQueryParams
  ) => {
    if (!hasValidToken()) return;
    
    if (!id || id.trim() === '') {
      ToastAlert.error('Error', 'Business ID es requerido');
      return;
    }

    try {
      const queryParams = params || defaultParams;
      const result = await dispatch(fetchServiceTrends({ 
        businessId: id, 
        params: queryParams 
      })).unwrap();
      return result;
    } catch (error: any) {
      ToastAlert.error('Error', error || 'Error al cargar tendencias de servicios');
      throw error;
    }
  }, [dispatch, defaultParams, hasValidToken]);

  // Cargar todos los datos de analytics
  const loadCompleteAnalytics = useCallback(async (
    id: string, 
    params?: AnalyticsQueryParams
  ) => {
    if (!hasValidToken()) return;
    
    if (!id || id.trim() === '') {
      ToastAlert.error('Error', 'Business ID es requerido');
      return;
    }

    try {
      const queryParams = params || defaultParams;
      const result = await dispatch(fetchCompleteAnalytics({ 
        businessId: id, 
        params: queryParams 
      })).unwrap();
      return result;
    } catch (error: any) {
      ToastAlert.error('Error', error || 'Error al cargar datos de analytics');
      throw error;
    }
  }, [dispatch, defaultParams, hasValidToken]);

  // Recargar todos los datos
  const reloadAnalytics = useCallback((params?: AnalyticsQueryParams) => {
    if (!businessId || businessId.trim() === '') {
      return;
    }
    
    loadCompleteAnalytics(businessId, params);
  }, [businessId, loadCompleteAnalytics]);

  // Limpiar errores específicos
  const clearDashboardErrors = useCallback(() => {
    dispatch(clearDashboardError());
  }, [dispatch]);

  const clearServiceTrendsErrors = useCallback(() => {
    dispatch(clearServiceTrendsError());
  }, [dispatch]);

  const clearErrors = useCallback(() => {
    dispatch(clearAllErrors());
  }, [dispatch]);

  // Limpiar todos los datos
  const clearData = useCallback(() => {
    dispatch(clearAllData());
  }, [dispatch]);

  // Actualizar business ID actual
  const updateCurrentBusinessId = useCallback((id: string) => {
    dispatch(setCurrentBusinessId(id));
  }, [dispatch]);

  // Estados combinados para la UI
  const isLoading = isDashboardLoading || isServiceTrendsLoading;
  const hasError = !!dashboardError || !!serviceTrendsError;
  const hasData = !!dashboardData && !!serviceTrendsData;

  // Información del negocio desde los datos de tendencias
  const businessInfo = useMemo(() => {
    return serviceTrendsData?.businessData || null;
  }, [serviceTrendsData]);

  // Verificar si los datos necesitan actualizarse
  const needsRefresh = useMemo(() => {
    if (!businessId || !lastFetchTime) return true;
    if (currentBusinessId !== businessId) return true;
    
    // Refrescar si los datos tienen más de 5 minutos
    const lastFetch = new Date(lastFetchTime);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastFetch.getTime()) / (1000 * 60);
    
    return diffMinutes > 5;
  }, [businessId, currentBusinessId, lastFetchTime]);

  // Efecto para cargar datos automáticamente
  useEffect(() => {
    if (businessId && businessId.trim() !== '') {
      // Actualizar el business ID actual
      if (currentBusinessId !== businessId) {
        updateCurrentBusinessId(businessId);
      }
      
      // Cargar datos si es necesario
      if (needsRefresh) {
        loadCompleteAnalytics(businessId);
      }
    }
  }, [businessId, currentBusinessId, needsRefresh, loadCompleteAnalytics, updateCurrentBusinessId]);

  // Limpiar datos al desmontar si cambia el business ID
  useEffect(() => {
    return () => {
      if (businessId && currentBusinessId && businessId !== currentBusinessId) {
        clearData();
      }
    };
  }, [businessId, currentBusinessId, clearData]);

  return {
    // Estado de los datos
    dashboardData,
    serviceTrendsData,
    businessInfo,
    
    // Estados de carga
    isDashboardLoading,
    isServiceTrendsLoading,
    isLoading,
    
    // Estados de error
    dashboardError,
    serviceTrendsError,
    hasError,
    
    // Estados combinados
    hasData,
    needsRefresh,
    
    // Metadatos
    currentBusinessId,
    lastFetchTime,
    
    // Acciones de carga
    loadDashboardData,
    loadServiceTrends,
    loadCompleteAnalytics,
    reloadAnalytics,
    
    // Acciones de limpieza
    clearDashboardErrors,
    clearServiceTrendsErrors,
    clearErrors,
    clearData,
    updateCurrentBusinessId,
  };
}; 