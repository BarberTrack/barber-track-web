import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/shadcn/card';
import type { DashboardData } from '../types';

interface TopBarbersChartProps {
  dashboardData?: DashboardData | null;
}

export const TopBarbersChart = ({ dashboardData }: TopBarbersChartProps) => {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-blue-400">Barberos Top</CardTitle>
        <CardDescription className="text-slate-400">Ingresos por barbero</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-72 overflow-y-auto space-y-4 pr-2">
          {dashboardData?.topBarbers?.slice(0, 10).map((barber, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1 gap-2">
                  <span 
                    className="text-sm font-medium text-white truncate max-w-[200px]"
                    title={barber.barberName}
                  >
                    {barber.barberName}
                  </span>
                  <span className="text-sm text-slate-400 flex-shrink-0">
                    ${barber.revenue}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-cyan-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((barber.revenue / (dashboardData?.topBarbers?.[0]?.revenue || 1)) * 100, 100)}%`
                    }}
                  ></div>
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