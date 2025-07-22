import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/shadcn/card';
import { Badge } from '@/shared/components/shadcn/badge';
import { Clock } from 'lucide-react';
import type { ServiceTrendsData } from '../types';

interface ServiceTrendsGridProps {
  serviceTrendsData?: ServiceTrendsData | null;
}

export const ServiceTrendsGrid = ({ serviceTrendsData }: ServiceTrendsGridProps) => {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-blue-400">Tendencias de Servicios</CardTitle>
        <CardDescription className="text-slate-400">
          Análisis detallado de reservas y ingresos por servicio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {serviceTrendsData?.servicesTrendData?.map((service, index) => (
            <div key={index} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h4 className="font-semibold text-white mb-2 truncate" title={service.serviceName}>
                {service.serviceName}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Reservas:</span>
                  <span className="text-white">{service.currentPeriodBookings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Precio Promedio:</span>
                  <span className="text-white">${service.avgPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ingresos:</span>
                  <span className="text-blue-400 font-semibold">${service.totalRevenue.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-700 pt-2">
                  <span className="text-slate-400 text-xs">Horarios populares:</span>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {service.popularTimeSlots?.map((time, timeIndex) => (
                      <Badge key={timeIndex} variant="secondary" className="text-xs bg-blue-900 text-blue-200">
                        <Clock className="h-3 w-3 mr-1" />
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 