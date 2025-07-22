import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn/card';
import { Star } from 'lucide-react';
import type { DashboardData } from '../types';

interface ServiceRankingTableProps {
  dashboardData?: DashboardData | null;
}

export const ServiceRankingTable = ({ dashboardData }: ServiceRankingTableProps) => {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-blue-400">Ranking de Servicios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
          {dashboardData?.topServices?.slice(0, 15).map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p 
                    className="font-medium text-white truncate max-w-[180px]"
                    title={service.serviceName}
                  >
                    {service.serviceName}
                  </p>
                  <p className="text-sm text-slate-400">{service.totalAppointments} citas</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-blue-400">${service.revenue}</p>
                <div className="flex items-center gap-1 justify-end">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-sm text-slate-300">{service.averageRating}</span>
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