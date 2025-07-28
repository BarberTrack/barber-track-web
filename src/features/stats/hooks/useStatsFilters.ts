import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setPeriod, setDateRange } from '../store/statsSlice';
import type { RootState } from '@/app/store';
import type { Period } from '../types';

// Hook for managing stats filters
export const useStatsFilters = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state: RootState) => state.stats.filters);

  const updatePeriod = (newPeriod: Period) => {
    dispatch(setPeriod(newPeriod));
  };

  const updateDateRange = (range: { from: string; to: string }) => {
    dispatch(setDateRange(range));
  };

  const getQuickDateRange = (range: 'lastWeek' | 'lastMonth' | 'last3Months' | 'lastYear') => {
    const now = new Date();
    let from: Date;
    
    switch (range) {
      case 'lastWeek':
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'lastMonth':
        from = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'last3Months':
        from = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case 'lastYear':
        from = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
    }
    
    return {
      from: from.toISOString().split('T')[0],
      to: now.toISOString().split('T')[0],
    };
  };

  const setQuickDateRange = (range: 'lastWeek' | 'lastMonth' | 'last3Months' | 'lastYear') => {
    const dateRange = getQuickDateRange(range);
    updateDateRange(dateRange);
  };

  return {
    ...filters,
    updatePeriod,
    updateDateRange,
    getQuickDateRange,
    setQuickDateRange,
  };
}; 