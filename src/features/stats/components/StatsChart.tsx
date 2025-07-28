import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/shadcn/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useStatsChart } from '../hooks';
import type { StatsChartProps } from '../types';

export const StatsChart = ({ data, loading, period }: StatsChartProps) => {
  const { formatStatsChartData, formatNumber } = useStatsChart();

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

  if (!data || data.length === 0) {
    return (
      <Card className="bg-gray-900 border-blue-800">
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-400">No hay datos disponibles para mostrar en el gráfico</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = formatStatsChartData(data, period);

  const renderTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm">{label}</p>
          <p className="text-blue-400 font-semibold">
            {formatNumber(data.value)} citas
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gray-900 border-blue-800">
      <CardHeader>
        <CardTitle className="text-blue-400 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Tendencias de Citas por {period === 'day' ? 'Día' : period === 'week' ? 'Semana' : period === 'month' ? 'Mes' : 'Año'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="line" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="line" className="data-[state=active]:bg-blue-900">
              Línea
            </TabsTrigger>
            <TabsTrigger value="area" className="data-[state=active]:bg-blue-900">
              Área
            </TabsTrigger>
            <TabsTrigger value="bar" className="data-[state=active]:bg-blue-900">
              Barras
            </TabsTrigger>
          </TabsList>

          <TabsContent value="line" className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip content={renderTooltip} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="area" className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip content={renderTooltip} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="bar" className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip content={renderTooltip} />
                <Bar 
                  dataKey="value" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}; 