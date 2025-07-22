import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/shadcn/card';
import { Star } from 'lucide-react';
import type { DashboardData } from '../types';

interface BarberRankingTableProps {
  dashboardData?: DashboardData | null;
}

export const BarberRankingTable = ({ dashboardData }: BarberRankingTableProps) => {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-blue-400">Ranking de Barberos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
          {dashboardData?.topBarbers?.slice(0, 15).map((barber, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p 
                    className="font-medium text-white truncate max-w-[180px]"
                    title={barber.barberName}
                  >
                    {barber.barberName}
                  </p>
                  <p className="text-sm text-slate-400">{barber.totalAppointments} citas</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-cyan-400">${barber.revenue}</p>
                <div className="flex items-center gap-1 justify-end">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-sm text-slate-300">{barber.averageRating}</span>
                </div>
              </div>
            </div>
          ))}
          {dashboardData?.topBarbers && dashboardData.topBarbers.length === 0 && (
            <div className="text-center text-slate-400 py-8">
              No hay datos de barberos disponibles
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 