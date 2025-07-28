import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn/card';
import { Badge } from '@/shared/components/shadcn/badge';
import { Separator } from '@/shared/components/shadcn/separator';
import { TrendingUp, TrendingDown, Calendar, BarChart3, Target, Activity } from 'lucide-react';
import { useStatsChart } from '../hooks';
import type { StatsHeaderProps } from '../types';

export const StatsHeader = ({ data, summary, loading }: StatsHeaderProps) => {
  const { formatNumber, formatPercentage } = useStatsChart();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-gray-900 border-blue-800">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-700 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-700 rounded animate-pulse mb-2" />
              <div className="h-3 bg-gray-700 rounded animate-pulse w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data || !summary) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No hay datos de estadísticas disponibles</p>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Citas',
      value: formatNumber(summary.total),
      icon: Calendar,
      trend: summary.growth,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
    },
    {
      title: 'Promedio por Período',
      value: formatNumber(Math.round(summary.average)),
      icon: BarChart3,
      trend: 0,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20',
    },
    {
      title: 'Pico Máximo',
      value: formatNumber(summary.peak),
      icon: Target,
      trend: 0,
      color: 'text-orange-400',
      bgColor: 'bg-orange-900/20',
    },
    {
      title: 'Valor Mínimo',
      value: formatNumber(summary.lowest),
      icon: Activity,
      trend: 0,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-200">
            Estadísticas de Citas
          </h2>
          <p className="text-blue-300 text-sm sm:text-base">
            Análisis de tendencias de citas agrupadas por período
          </p>
        </div>
        <Badge variant="outline" className="border-blue-600 text-blue-400 w-fit">
          {data.length} períodos analizados
        </Badge>
      </div>

      <Separator className="bg-blue-800" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          const isPositiveTrend = kpi.trend > 0;
          const hasTrend = kpi.trend !== 0;
          
          return (
            <Card key={index} className="bg-gray-900 border-blue-800 hover:border-blue-600 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400 flex items-center justify-between">
                  {kpi.title}
                  <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                    <Icon className={`w-4 h-4 ${kpi.color}`} />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-gray-200">
                    {kpi.value}
                  </p>
                  
                  {hasTrend && (
                    <div className="flex items-center gap-1">
                      {isPositiveTrend ? (
                        <TrendingUp className="w-3 h-3 text-green-400" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-400" />
                      )}
                      <span className={`text-xs ${
                        isPositiveTrend ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {formatPercentage(Math.abs(kpi.trend))}
                      </span>
                      <span className="text-xs text-gray-500">
                        vs período anterior
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}; 