import { Badge } from '@/shared/components/shadcn/badge';
import { MapPin } from 'lucide-react';

interface AnalyticsHeaderProps {
  businessName?: string;
  location?: string;
}

export const AnalyticsHeader = ({ businessName, location }: AnalyticsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-blue-400">Dashboard de Analíticas</h1>
        <p className="text-slate-400 mt-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {businessName || 'Cargando...'} - {location || ''}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="border-blue-500 text-blue-400">
          Año 2024
        </Badge>
      </div>
    </div>
  );
}; 