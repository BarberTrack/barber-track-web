import { Card, CardContent } from '@/shared/components/shadcn/card';
import { Button } from '@/shared/components/shadcn/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorCardProps {
  type: 'no-business-id' | 'no-data' | 'custom';
  message?: string;
  onRefresh?: () => void;
  showRefreshButton?: boolean;
}

export const ErrorCard = ({ 
  type, 
  message, 
  onRefresh, 
  showRefreshButton = false 
}: ErrorCardProps) => {
  const getErrorConfig = () => {
    switch (type) {
      case 'no-business-id':
        return {
          message: 'No se ha proporcionado un ID de negocio válido.',
          cardClass: 'border-red-800 bg-red-950/50',
          textClass: 'text-red-400',
        };
      case 'no-data':
        return {
          message: 'No se pudieron cargar los datos de analytics.',
          cardClass: 'border-yellow-800 bg-yellow-950/50',
          textClass: 'text-yellow-400',
        };
      case 'custom':
        return {
          message: message || 'Ha ocurrido un error.',
          cardClass: 'border-red-800 bg-red-950/50',
          textClass: 'text-red-400',
        };
      default:
        return {
          message: 'Error desconocido.',
          cardClass: 'border-red-800 bg-red-950/50',
          textClass: 'text-red-400',
        };
    }
  };

  const { message: errorMessage, cardClass, textClass } = getErrorConfig();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <Card className={cardClass}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-2 ${textClass}`}>
                <AlertCircle className="h-4 w-4" />
                <span>{errorMessage}</span>
              </div>
              {showRefreshButton && onRefresh && (
                <Button 
                  onClick={onRefresh}
                  variant="outline"
                  size="sm"
                  className={`border-yellow-600 text-yellow-400 hover:bg-yellow-950 ${
                    type === 'no-data' ? '' : 'border-red-600 text-red-400 hover:bg-red-950'
                  }`}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reintentar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 