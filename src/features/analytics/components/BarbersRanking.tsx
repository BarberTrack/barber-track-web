import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn/card';
import { Badge } from '@/shared/components/shadcn/badge';
import { Avatar, AvatarFallback } from '@/shared/components/shadcn/avatar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Star, TrendingUp } from 'lucide-react';
import { useChartData } from '../hooks';
import type { BarbersRankingProps } from '../types';

export const BarbersRanking = ({ barbers, loading }: BarbersRankingProps) => {
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

  if (!barbers || barbers.length === 0) {
    return (
      <Card className="bg-gray-900 border-blue-800">
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-gray-400">No hay datos de barberos disponibles</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = formatChartData(barbers, 'bar');

  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm font-semibold">{data.name}</p>
          <p className="text-blue-400">{formatNumber(data.appointments)} citas</p>
          <p className="text-green-400">{formatCurrency(data.revenue)}</p>
          <p className="text-yellow-400">⭐ {data.rating}</p>
        </div>
      );
    }
    return null;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0: return 'text-yellow-400 bg-yellow-900/20';
      case 1: return 'text-gray-300 bg-gray-700/20';
      case 2: return 'text-orange-400 bg-orange-900/20';
      default: return 'text-gray-400 bg-gray-800/20';
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${index + 1}`;
    }
  };

  return (
    <Card className="bg-gray-900 border-blue-800">
      <CardHeader>
        <CardTitle className="text-blue-400 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Ranking de Barberos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-4">Rendimiento por Citas</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
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

          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-4">Ingresos por Barbero</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
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
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={renderTooltip} />
                <Bar 
                  dataKey="revenue" 
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Top Barberos</h4>
          <div className="space-y-2">
            {barbers.map((barber, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getRankColor(index)}`}>
                  <span className="text-xs font-bold">{getRankIcon(index)}</span>
                </div>
                
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-blue-900 text-blue-300 text-sm">
                    {getInitials(barber.barberName)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h5 className="text-sm font-medium text-gray-200">{barber.barberName}</h5>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-gray-400">
                        {formatNumber(barber.totalAppointments)} citas
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-gray-400">
                        {barber.averageRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-green-400">
                    {formatCurrency(barber.revenue)}
                  </p>
                  <Badge variant="outline" className="text-xs border-blue-600 text-blue-400">
                    {((barber.revenue / barbers.reduce((sum, b) => sum + b.revenue, 0)) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-gray-400">Total Citas</p>
            <p className="text-lg font-bold text-blue-400">
              {formatNumber(barbers.reduce((sum, b) => sum + b.totalAppointments, 0))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Ingresos Totales</p>
            <p className="text-lg font-bold text-green-400">
              {formatCurrency(barbers.reduce((sum, b) => sum + b.revenue, 0))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Rating Promedio</p>
            <p className="text-lg font-bold text-yellow-400">
              {(barbers.reduce((sum, b) => sum + b.averageRating, 0) / barbers.length).toFixed(1)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 