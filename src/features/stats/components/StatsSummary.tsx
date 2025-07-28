import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn/card';
import { TrendingUp, TrendingDown, Calculator } from 'lucide-react';
import { useStatsChart } from '../hooks';
import type { StatsSummaryProps } from '../types';

export const StatsSummary = ({ summary, loading }: StatsSummaryProps) => {
  const { formatNumber, formatPercentage } = useStatsChart();

  if (loading) {
    return (
      <Card className="bg-gray-900 border-blue-800">
        <CardHeader>
          <div className="h-6 bg-gray-700 rounded animate-pulse w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 bg-gray-700 rounded animate-pulse w-24" />
                <div className="h-6 bg-gray-700 rounded animate-pulse w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card className="bg-gray-900 border-blue-800">
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-gray-400">No hay datos de resumen disponibles</p>
        </CardContent>
      </Card>
    );
  }

  const isPositiveGrowth = summary.growth > 0;

  return (
    <Card className="bg-gray-900 border-blue-800">
      <CardHeader>
        <CardTitle className="text-blue-400 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Resumen Estadístico
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Total */}
          <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
            <span className="text-gray-400 text-sm">Total de Citas</span>
            <span className="text-gray-200 font-semibold text-lg">
              {formatNumber(summary.total)}
            </span>
          </div>

          {/* Average */}
          <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
            <span className="text-gray-400 text-sm">Promedio por Período</span>
            <span className="text-gray-200 font-semibold">
              {formatNumber(Math.round(summary.average))}
            </span>
          </div>

          {/* Growth */}
          <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
            <span className="text-gray-400 text-sm">Crecimiento</span>
            <div className="flex items-center gap-2">
              {summary.growth !== 0 && (
                <>
                  {isPositiveGrowth ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                </>
              )}
              <span className={`font-semibold ${
                summary.growth === 0 ? 'text-gray-400' :
                isPositiveGrowth ? 'text-green-400' : 'text-red-400'
              }`}>
                {summary.growth === 0 ? 'Sin cambios' : formatPercentage(Math.abs(summary.growth))}
              </span>
            </div>
          </div>

          {/* Peak and Lowest */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-800 rounded-lg text-center">
              <p className="text-gray-400 text-xs mb-1">Pico Máximo</p>
              <p className="text-orange-400 font-semibold">
                {formatNumber(summary.peak)}
              </p>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg text-center">
              <p className="text-gray-400 text-xs mb-1">Valor Mínimo</p>
              <p className="text-purple-400 font-semibold">
                {formatNumber(summary.lowest)}
              </p>
            </div>
          </div>

          {/* Additional Insights */}
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
            <p className="text-blue-300 text-xs">
              <strong>Rango:</strong> {formatNumber(summary.peak - summary.lowest)} citas entre el máximo y mínimo
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 