import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  fetchStatsData,
  setPeriod,
  setDateRange,
  clearError,
  clearData,
} from '../store/statsSlice';
import type { RootState } from '@/app/store';
import type { Period } from '../types';

// Main hook for stats data
export const useStats = (businessId: string) => {
  const dispatch = useAppDispatch();
  const { data, loading, error, summary } = useAppSelector((state: RootState) => state.stats);
  const { period, dateRange } = useAppSelector((state: RootState) => state.stats.filters);

  const getStats = (options?: {
    period?: Period;
    from?: string;
    to?: string;
  }) => {
    const params = {
      businessId,
      period: options?.period || period,
      from: options?.from || dateRange.from,
      to: options?.to || dateRange.to,
    };
    
    dispatch(fetchStatsData(params));
  };

  const updatePeriod = (newPeriod: Period) => {
    dispatch(setPeriod(newPeriod));
  };

  const updateDateRange = (range: { from: string; to: string }) => {
    dispatch(setDateRange(range));
  };

  const clearStatsError = () => {
    dispatch(clearError());
  };

  const clearStatsData = () => {
    dispatch(clearData());
  };

  return {
    data,
    loading,
    error,
    summary,
    period,
    dateRange,
    getStats,
    updatePeriod,
    updateDateRange,
    clearStatsError,
    clearStatsData,
  };
}; 