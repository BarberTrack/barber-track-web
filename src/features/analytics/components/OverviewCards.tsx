import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn/card';
import { 
  CalendarDays, 
  DollarSign, 
  Star, 
  BarChart3 
} from 'lucide-react';
import type { DashboardData, ServiceTrendsData } from '../types';

interface OverviewCardsProps {
  dashboardData?: DashboardData | null;
  serviceTrendsData?: ServiceTrendsData | null;
}

export const OverviewCards = ({ dashboardData, serviceTrendsData }: OverviewCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Total de Citas</CardTitle>
          <CalendarDays className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {dashboardData?.overview.totalAppointments || 0}
          </div>
          <p className="text-xs text-slate-400">
            {dashboardData?.overview.completedAppointments || 0} completadas
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Ingresos</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            ${dashboardData?.overview.revenue || 0}
          </div>
          <p className="text-xs text-slate-400">
            {dashboardData?.trends.revenueGrowth === 0 
              ? "Sin cambios" 
              : `${dashboardData?.trends.revenueGrowth}%`
            }
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Calificación Promedio</CardTitle>
          <Star className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {dashboardData?.overview.averageRating || 0}
          </div>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(dashboardData?.overview.averageRating || 0)
                    ? "text-yellow-400 fill-current"
                    : "text-slate-600"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Competencia en Zona</CardTitle>
          <BarChart3 className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {serviceTrendsData?.zoneMetrics.businessesInZone || 0}
          </div>
          <p className="text-xs text-slate-400">negocios similares</p>
        </CardContent>
      </Card>
    </div>
  );
}; 