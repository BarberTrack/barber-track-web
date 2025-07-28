import type { StatsDataPoint, StatsChartData, Period } from '../types';

// Hook for transforming stats chart data
export const useStatsChart = () => {
  const formatStatsChartData = (data: StatsDataPoint[], period: Period = 'month'): StatsChartData[] => {
    if (!data || data.length === 0) return [];

    return data.map((item) => ({
      name: formatDateLabel(item.date, period),
      value: item.count,
      count: item.count,
      date: item.date,
    }));
  };

  const formatDateLabel = (dateString: string, period: Period): string => {
    const date = new Date(dateString);
    
    switch (period) {
      case 'day':
        return date.toLocaleDateString('es-ES', { 
          weekday: 'short',
          month: 'short', 
          day: 'numeric' 
        });
      case 'week':
        return `Sem ${getWeekOfYear(date)}`;
      case 'month':
        return date.toLocaleDateString('es-ES', { 
          month: 'short', 
          year: '2-digit' 
        });
      case 'year':
        return date.getFullYear().toString();
      default:
        return date.toLocaleDateString('es-ES', { 
          month: 'short', 
          day: 'numeric' 
        });
    }
  };

  const getWeekOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + start.getDay()) / 7);
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('es-MX').format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const getChartColor = (index: number = 0): string => {
    const colors = [
      '#3B82F6', // blue-500
      '#10B981', // emerald-500
      '#F59E0B', // amber-500
      '#EF4444', // red-500
      '#8B5CF6', // violet-500
      '#06B6D4', // cyan-500
    ];
    return colors[index % colors.length];
  };

  return {
    formatStatsChartData,
    formatDateLabel,
    formatNumber,
    formatPercentage,
    getChartColor,
  };
}; 