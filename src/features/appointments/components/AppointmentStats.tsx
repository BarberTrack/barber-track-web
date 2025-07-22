import { Card, CardContent } from '@/shared/components/shadcn/card';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import type { StatusStats } from '../types/appointment.types';

interface AppointmentStatsProps {
  statusStats: StatusStats;
  isLoading?: boolean;
}

const statCards = [
  {
    key: 'scheduled' as keyof StatusStats,
    title: 'Programadas',
    icon: Calendar,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-900',
  },
  {
    key: 'completed' as keyof StatusStats,
    title: 'Completadas',
    icon: CheckCircle,
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    textColor: 'text-emerald-900',
  },
  {
    key: 'cancelled' as keyof StatusStats,
    title: 'Canceladas',
    icon: XCircle,
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
    textColor: 'text-red-900',
  },
];

export const AppointmentStats = ({ statusStats, isLoading }: AppointmentStatsProps) => {
  // Calcular total
  const total = Object.values(statusStats).reduce((sum, count) => sum + count, 0);


  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.key} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((stat) => {
        const count = statusStats[stat.key];
        const percentage = total > 0 ? (count / total) * 100 : 0;
        return (
          <Card key={stat.key} className={`${stat.bgColor} border-none`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className={`text-sm font-medium ${stat.textColor} opacity-80`}>
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-bold ${stat.textColor}`}>
                      {count}
                    </span>
                    {total > 0 && (
                      <span className={`text-xs ${stat.textColor} opacity-60`}>
                        {percentage.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}; 