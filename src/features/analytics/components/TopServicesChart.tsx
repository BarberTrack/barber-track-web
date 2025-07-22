import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/shadcn/card';
import type { DashboardData } from '../types';

interface TopServicesChartProps {
  dashboardData?: DashboardData | null;
}

export const TopServicesChart = ({ dashboardData }: TopServicesChartProps) => {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-blue-400">Servicios Más Populares</CardTitle>
        <CardDescription className="text-slate-400">Citas por servicio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-72 overflow-y-auto space-y-4 pr-2">
          {dashboardData?.topServices?.slice(0, 10).map((service, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1 gap-2">
                  <span 
                    className="text-sm font-medium text-white truncate max-w-[200px]"
                    title={service.serviceName}
                  >
                    {service.serviceName}
                  </span>
                  <span className="text-sm text-slate-400 flex-shrink-0">
                    {service.totalAppointments} citas
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((service.totalAppointments / (dashboardData?.topServices?.[0]?.totalAppointments || 1)) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
          {dashboardData?.topServices && dashboardData.topServices.length === 0 && (
            <div className="text-center text-slate-400 py-8">
              No hay datos de servicios disponibles
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 