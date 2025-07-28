import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/shadcn/select';
import { Button } from '@/shared/components/shadcn/button';
import { Calendar, Filter, BarChart3 } from 'lucide-react';
import type { FiltersPanelProps } from '../types';

export const FiltersPanel = ({
  period,
  reportType,
  dateRange,
  groupBy,
  onPeriodChange,
  onReportTypeChange,
  onDateRangeChange,
  onGroupByChange,
}: FiltersPanelProps) => {
  
  const handleQuickDateRange = (range: 'lastMonth' | 'last3Months' | 'lastYear') => {
    const now = new Date();
    let from: Date;
    
    switch (range) {
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
    
    onDateRangeChange({
      from: from.toISOString().split('T')[0],
      to: now.toISOString().split('T')[0],
    });
  };

  return (
    <Card className="bg-gray-900 border-blue-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-blue-400 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtros y Configuración
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dashboard Period */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Período del Dashboard
          </label>
          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="week" className="text-gray-200 focus:bg-blue-900">
                Esta Semana
              </SelectItem>
              <SelectItem value="month" className="text-gray-200 focus:bg-blue-900">
                Este Mes
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Report Type */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Tipo de Reporte
          </label>
          <Select value={reportType} onValueChange={onReportTypeChange}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="appointments" className="text-gray-200 focus:bg-blue-900">
                Citas
              </SelectItem>
              <SelectItem value="revenue" className="text-gray-200 focus:bg-blue-900">
                Ingresos
              </SelectItem>
              <SelectItem value="services" className="text-gray-200 focus:bg-blue-900">
                Servicios
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Group By */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-300">
            Agrupar por
          </label>
          <Select value={groupBy} onValueChange={onGroupByChange}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="week" className="text-gray-200 focus:bg-blue-900">
                Semana
              </SelectItem>
              <SelectItem value="month" className="text-gray-200 focus:bg-blue-900">
                Mes
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Date Ranges */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-300">
            Rangos Rápidos
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
      </CardContent>
    </Card>
  );
};
