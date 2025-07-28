import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn/card';
import { Badge } from '@/shared/components/shadcn/badge';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Scissors, TrendingUp, Star } from 'lucide-react';
import { useChartData } from '../hooks';
import type { ServicesAnalyticsProps } from '../types';

export const ServicesAnalytics = ({ services, loading }: ServicesAnalyticsProps) => {
  const { formatChartData, formatCurrency, formatNumber } = useChartData();

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

  if (!services || services.length === 0) {
    return (
      <Card className="bg-gray-900 border-blue-800">
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-400">No hay datos de servicios disponibles</p>
        </CardContent>
      </Card>
    );
  }

  const pieData = formatChartData(services, 'pie');
  const barData = formatChartData(services, 'bar');

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm font-semibold">{data.name}</p>
          <p className="text-blue-400">{formatNumber(data.appointments)} citas</p>
          <p className="text-green-400">{formatCurrency(data.revenue)}</p>
        </div>
      );
    }
    return null;
  };

  const renderPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm font-semibold">{data.name}</p>
          <p className="text-blue-400">{formatCurrency(data.value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gray-900 border-blue-800">
      <CardHeader>
        <CardTitle className="text-blue-400 flex items-center gap-2">
          <Scissors className="w-5 h-5" />
          Servicios Populares
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-4">Distribución de Ingresos</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={renderPieTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-4">Citas por Servicio</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={10}
                />
                <Tooltip content={renderTooltip} />
                <Bar 
                  dataKey="appointments" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Detalles por Servicio</h4>
          <div className="space-y-2">
            {services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <h5 className="text-sm font-medium text-gray-200">{service.serviceName}</h5>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-gray-400">
                        {formatNumber(service.totalAppointments)} citas
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-gray-400">
                        {service.averageRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-400">
                    {formatCurrency(service.revenue)}
                  </p>
                  <Badge variant="outline" className="text-xs border-blue-600 text-blue-400">
                    {((service.revenue / services.reduce((sum, s) => sum + s.revenue, 0)) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 