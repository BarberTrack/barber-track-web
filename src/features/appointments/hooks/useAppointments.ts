import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  fetchAppointments,
  fetchAppointmentsByStatus,
  fetchAppointmentsByBarber,
  clearError,
  updateFilters,
  resetFilters,
  setPage,
  setLimit,
  clearAppointments,
  selectAppointments,
} from '../store/appointmentSlice';
import type { QueryParams, AppointmentStatus } from '../types/appointment.types';

export const useAppointments = (businessId?: string) => {
  const dispatch = useAppDispatch();
  const { 
    appointments, 
    statusStats, 
    pagination, 
    isLoading, 
    error, 
    filters 
  } = useAppSelector(selectAppointments);



  // Cargar citas por businessId
  const loadAppointments = useCallback(async (
    id: string, 
    params?: QueryParams
  ) => {
    try {
      const result = await dispatch(fetchAppointments({ 
        businessId: id, 
        params 
      })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  // Cargar citas por estado
  const loadAppointmentsByStatus = useCallback(async (
    id: string, 
    status: AppointmentStatus, 
    params?: Omit<QueryParams, 'status'>
  ) => {
    try {
      const result = await dispatch(fetchAppointmentsByStatus({ 
        businessId: id, 
        status, 
        params 
      })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);



  // Cargar citas por barbero
  const loadAppointmentsByBarber = useCallback(async (
    id: string,
    barberId: string,
    params?: Omit<QueryParams, 'barberId'>
  ) => {
    try {
      const result = await dispatch(fetchAppointmentsByBarber({ 
        businessId: id, 
        barberId, 
        params 
      })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  // Actualizar filtros
  const updateAppointmentFilters = useCallback((newFilters: Partial<typeof filters>) => {
    dispatch(updateFilters(newFilters));
  }, [dispatch]);

  // Limpiar error
  const clearAppointmentError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Resetear filtros
  const resetAppointmentFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  // Cambiar página
  const changePage = useCallback((page: number) => {
    dispatch(setPage(page));
  }, [dispatch]);

  // Cambiar límite
  const changeLimit = useCallback((limit: number) => {
    dispatch(setLimit(limit));
  }, [dispatch]);

  // Limpiar citas
  const clearAllAppointments = useCallback(() => {
    dispatch(clearAppointments());
  }, [dispatch]);

  // Recargar citas con filtros actuales
  const reloadAppointments = useCallback(() => {
    if (!businessId || businessId.trim() === '') {
      return;
    }
    
    const params = {
      page: filters.page,
      limit: filters.limit,
      ...(filters.status && { status: filters.status }),
      ...(filters.barberId && { barberId: filters.barberId }),
      ...(filters.from && { from: filters.from }),
      ...(filters.to && { to: filters.to }),
    };

    dispatch(fetchAppointments({ businessId, params }));
  }, [dispatch, businessId, filters]);

  // Efecto para cargar citas automáticamente cuando cambie businessId
  useEffect(() => {
    if (businessId && businessId.trim() !== '') {
      reloadAppointments();
    } else {
    }
  }, [businessId, reloadAppointments]);

  return {
    // Estado
    appointments,
    statusStats,
    pagination,
    isLoading,
    error,
    filters,
    
    // Acciones de carga
    loadAppointments,
    loadAppointmentsByStatus,
    loadAppointmentsByBarber,
    reloadAppointments,
    
    // Acciones de filtros
    updateAppointmentFilters,
    resetAppointmentFilters,
    changePage,
    changeLimit,
    
    // Acciones de limpieza
    clearAppointmentError,
    clearAllAppointments,
  };
}; 