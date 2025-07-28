import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn/card';
import { Badge } from '@/shared/components/shadcn/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, Scissors } from 'lucide-react';
import { useChartData } from '../hooks';
import type { PeakHour } from '../types';

interface PeakHoursChartProps {
  peakHours: PeakHour[];
  loading: boolean;
}

export const PeakHoursChart = ({ peakHours, loading }: PeakHoursChartProps) => {
  const { formatCurrency, formatNumber } = useChartData();

  if (loading) {
    return (
      <Card className="bg-gray-900 border-blue-800">
        <CardHeader>
          <div className="h-6 bg-gray-700 rounded animate-pulse w-48" />
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-800 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (!peakHours || peakHours.length === 0) {
    return (
      <Card className="bg-gray-900 border-blue-800">
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-400">No hay datos de horas pico disponibles</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = peakHours.map(hour => ({
    name: hour.serviceName,
    hour: hour.busiestHour,
    count: hour.busiestHourCount,
    revenue: hour.totalRevenue,
    appointments: hour.totalAppointments,
  }));

  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm font-semibold">{data.name}</p>
          <p className="text-blue-400">Hora pico: {data.hour}</p>
          <p className="text-green-400">{formatNumber(data.count)} citas en esa hora</p>
          <p className="text-yellow-400">{formatCurrency(data.revenue)}</p>
        </div>
      );
    }
    return null;
  };

  const getHourColor = (hour: string) => {
    const hourNum = parseInt(hour.split(':')[0]);
    if (hourNum >= 9 && hourNum <= 12) return '#10B981';
    if (hourNum >= 13 && hourNum <= 17) return '#3B82F6';
    if (hourNum >= 18 && hourNum <= 21) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <Card className="bg-gray-900 border-blue-800">
      <CardHeader>
        <CardTitle className="text-blue-400 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Análisis de Horas Pico
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-4">Citas por Hora Pico</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF"
                fontSize={10}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={10}
              />
              <Tooltip content={renderTooltip} />
              <Bar 
                dataKey="count" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Detalles por Servicio</h4>
          <div className="space-y-2">
            {peakHours.map((peak, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-900/20">
                    <Scissors className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-200">{peak.serviceName}</h5>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-400" />
                        <span className="text-xs text-gray-400">
                          Hora pico: {peak.busiestHour}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-gray-400">
                          {formatNumber(peak.busiestHourCount)} citas
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-green-400">
                    {formatCurrency(peak.totalRevenue)}
                  </p>
                  <Badge 
                    variant="outline" 
                    className="text-xs border-blue-600 text-blue-400"
                    style={{ borderColor: getHourColor(peak.busiestHour) }}
                  >
                    {peak.busiestHour}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-800 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-gray-400">Total Citas</p>
            <p className="text-lg font-bold text-blue-400">
              {formatNumber(peakHours.reduce((sum, p) => sum + p.totalAppointments, 0))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Ingresos Totales</p>
            <p className="text-lg font-bold text-green-400">
              {formatCurrency(peakHours.reduce((sum, p) => sum + p.totalRevenue, 0))}
            </p>
          </div>
        </div>

        <div className="p-4 bg-blue-900/10 rounded-lg border border-blue-800">
          <h5 className="text-sm font-medium text-blue-400 mb-2">Horarios Recomendados</h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-300">Mañana (9:00-12:00)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-300">Tarde (13:00-17:00)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-gray-300">Noche (18:00-21:00)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 