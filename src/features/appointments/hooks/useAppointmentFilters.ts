import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  updateFilters,
  resetFilters,
  setPage,
  setLimit,
  setFromDate,
  setToDate,
  setDateRange,
  selectAppointments,
} from '../store/appointmentSlice';
import type { AppointmentStatus } from '../types/appointment.types';

export const useAppointmentFilters = () => {
  const dispatch = useAppDispatch();
  const { filters, pagination } = useAppSelector(selectAppointments);

  // Actualizar estado del filtro
  const updateStatus = useCallback((status?: AppointmentStatus) => {
    dispatch(updateFilters({ status, page: 1 })); // Reset page when filter changes
  }, [dispatch]);



  // Actualizar barbero
  const updateBarber = useCallback((barberId?: string) => {
    dispatch(updateFilters({ barberId, page: 1 })); // Reset page when filter changes
  }, [dispatch]);

  // Cambiar página
  const changePage = useCallback((page: number) => {
    dispatch(setPage(page));
  }, [dispatch]);

  // Cambiar límite por página
  const changeLimit = useCallback((limit: number) => {
    dispatch(setLimit(limit));
    dispatch(setPage(1)); // Reset to first page when limit changes
  }, [dispatch]);

  // Establecer fecha desde
  const updateFromDate = useCallback((date?: string) => {
    dispatch(setFromDate(date));
  }, [dispatch]);

  // Establecer fecha hasta
  const updateToDate = useCallback((date?: string) => {
    dispatch(setToDate(date));
  }, [dispatch]);

  // Establecer rango de fechas
  const updateDateRange = useCallback((from?: string, to?: string) => {
    dispatch(setDateRange({ from, to }));
  }, [dispatch]);

  // Utilidades para rangos de fecha comunes
  const setTodayRange = useCallback(() => {
    const today = new Date();
    const from = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const to = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999).toISOString();
    dispatch(setDateRange({ from, to }));
  }, [dispatch]);

  const setThisWeekRange = useCallback(() => {
    const today = new Date();
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const lastDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    
    const from = new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), firstDayOfWeek.getDate()).toISOString();
    const to = new Date(lastDayOfWeek.getFullYear(), lastDayOfWeek.getMonth(), lastDayOfWeek.getDate(), 23, 59, 59, 999).toISOString();
    dispatch(setDateRange({ from, to }));
  }, [dispatch]);

  const setThisMonthRange = useCallback(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const from = firstDayOfMonth.toISOString();
    const to = new Date(lastDayOfMonth.getFullYear(), lastDayOfMonth.getMonth(), lastDayOfMonth.getDate(), 23, 59, 59, 999).toISOString();
    dispatch(setDateRange({ from, to }));
  }, [dispatch]);

  const clearDateFilters = useCallback(() => {
    dispatch(setDateRange({ from: undefined, to: undefined }));
  }, [dispatch]);

  // Limpiar todos los filtros
  const clearAllFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.status || 
      filters.barberId ||
      filters.from ||
      filters.to
    );
  }, [filters.status, filters.barberId, filters.from, filters.to]);

  // Obtener query params para la API
  const getQueryParams = useCallback(() => {
    return {
      page: filters.page,
      limit: filters.limit,
      ...(filters.status && { status: filters.status }),
      ...(filters.barberId && { barberId: filters.barberId }),
      ...(filters.from && { from: filters.from }),
      ...(filters.to && { to: filters.to }),
    };
  }, [filters]);

  // Información de paginación para UI
  const paginationInfo = useMemo(() => {
    const { page, totalPages, total, limit } = pagination;
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    
    return {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      startItem: start,
      endItem: end,
      hasPrevious: page > 1,
      hasNext: page < totalPages,
      previousPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
  }, [pagination]);

  // Array de páginas para mostrar en la paginación
  const pageNumbers = useMemo(() => {
    const { currentPage, totalPages } = paginationInfo;
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [paginationInfo]);

  return {
    // Estado actual
    filters,
    pagination,
    hasActiveFilters,
    paginationInfo,
    pageNumbers,
    
    // Acciones de filtros
    updateStatus,
    updateBarber,
    clearAllFilters,
    
    // Acciones de filtros de fecha
    updateFromDate,
    updateToDate,
    updateDateRange,
    setTodayRange,
    setThisWeekRange,
    setThisMonthRange,
    clearDateFilters,
    
    // Acciones de paginación
    changePage,
    changeLimit,
    
    // Utilidades
    getQueryParams,
  };
}; 