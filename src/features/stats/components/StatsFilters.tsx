import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/shadcn/select';
import { Button } from '@/shared/components/shadcn/button';
import { Calendar, Filter, Clock } from 'lucide-react';
import { useStatsFilters } from '../hooks';
import type { StatsFiltersProps, Period } from '../types';

export const StatsFilters = ({
  period,
  dateRange,
  onPeriodChange,
  onDateRangeChange,
}: StatsFiltersProps) => {
  const { getQuickDateRange } = useStatsFilters();
  
  const handleQuickDateRange = (range: 'lastWeek' | 'lastMonth' | 'last3Months' | 'lastYear') => {
    const newRange = getQuickDateRange(range);
    onDateRangeChange(newRange);
  };

  const periodOptions: { value: Period; label: string }[] = [
    { value: 'day', label: 'Por Día' },
    { value: 'week', label: 'Por Semana' },
    { value: 'month', label: 'Por Mes' },
    { value: 'year', label: 'Por Año' },
  ];

  return (
    <Card className="bg-gray-900 border-blue-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-blue-400 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtros de Estadísticas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Period Selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Agrupar por Período
          </label>
          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {periodOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value} 
                  className="text-gray-200 focus:bg-blue-900"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Date Ranges */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Rangos Rápidos
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickDateRange('lastWeek')}
              className="border-gray-700 text-gray-300 hover:bg-blue-900 hover:border-blue-600"
            >
              Última Semana
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickDateRange('lastMonth')}
              className="border-gray-700 text-gray-300 hover:bg-blue-900 hover:border-blue-600"
            >
              Último Mes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickDateRange('last3Months')}
              className="border-gray-700 text-gray-300 hover:bg-blue-900 hover:border-blue-600"
            >
              3 Meses
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickDateRange('lastYear')}
              className="border-gray-700 text-gray-300 hover:bg-blue-900 hover:border-blue-600"
            >
              Último Año
            </Button>
          </div>
        </div>

        {/* Current Date Range Display */}
        <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400 mb-1">Rango actual:</p>
          <p className="text-sm text-blue-300">
            {new Date(dateRange.from).toLocaleDateString('es-ES')} - {' '}
            {new Date(dateRange.to).toLocaleDateString('es-ES')}
          </p>
        </div>

        {/* Period Info */}
        <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400 mb-1">Agrupación:</p>
          <p className="text-sm text-green-300">
            {periodOptions.find(opt => opt.value === period)?.label}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}; 