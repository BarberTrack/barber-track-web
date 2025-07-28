import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/shadcn/card"
import { Badge } from "@/shared/components/shadcn/badge"
import { Alert, AlertDescription } from "@/shared/components/shadcn/alert"
import { 
  Clock, 
  Calendar, 
  Target, 
  Users, 
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Eye
} from "lucide-react"
import type { BusinessPromotion, ServiceAnalysis } from "../types"

interface PromotionActivationProps {
  promotions: BusinessPromotion[];
  serviceAnalysis: ServiceAnalysis[];
  loading?: boolean;
}

export const PromotionActivation = ({ promotions, serviceAnalysis, loading = false }: PromotionActivationProps) => {
  if (loading) {
    return (
      <Card className="bg-gray-900 border-blue-800">
        <CardHeader>
          <div className="h-6 bg-gray-700 rounded animate-pulse w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-32 bg-gray-800 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!promotions || promotions.length === 0) {
    return (
      <Card className="bg-gray-900 border-blue-800">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto" />
            <p className="text-gray-400">No hay promociones disponibles</p>
            <p className="text-sm text-gray-500">
              El sistema no ha generado recomendaciones de promociones para este negocio.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const getDemandColor = (demand: string) => {
    switch (demand.toLowerCase()) {
      case 'high': return 'text-green-400 bg-green-900/20 border-green-600';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-600';
      case 'low': return 'text-red-400 bg-red-900/20 border-red-600';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-600';
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'promote': return 'text-orange-400 bg-orange-900/20 border-orange-600';
      case 'monitor': return 'text-blue-400 bg-blue-900/20 border-blue-600';
      case 'optimize': return 'text-purple-400 bg-purple-900/20 border-purple-600';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-600';
    }
  };

  const getServiceName = (serviceId: string) => {
    return serviceId.substring(0, 8) + '...';
  };

  return (
    <div className="space-y-6">
      {/* Activation Conditions */}
      <Card className="bg-gray-900 border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Condiciones de Activación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {promotions.map((promotion) => (
              <div key={promotion.id} className="border border-orange-800/50 rounded-lg p-4 bg-orange-900/10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">{promotion.title}</h3>
                  <Badge className="bg-orange-600/20 text-orange-400 border-orange-600">
                    {promotion.urgency}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-800 border border-blue-800/50 rounded">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Fecha Objetivo</p>
                      <p className="font-medium text-white">
                        {formatDate(promotion.activationConditions.targetDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-800 border border-blue-800/50 rounded">
                    <Clock className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Hora Objetivo</p>
                      <p className="font-medium text-white">
                        {promotion.activationConditions.targetHour || 'Cualquier hora'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-800 border border-blue-800/50 rounded">
                    <Target className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Ocupación Mínima</p>
                      <p className="font-medium text-white">
                        {(promotion.activationConditions.minOccupancy * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-400">Servicios Incluidos:</p>
                  <div className="flex flex-wrap gap-2">
                    {promotion.servicesIncluded.map((serviceId) => (
                      <Badge key={serviceId} className="bg-blue-600/20 text-blue-400 border-blue-600">
                        {getServiceName(serviceId)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Alert className="mt-4 bg-yellow-900/20 border-yellow-600/50">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <AlertDescription className="text-yellow-300">
                    <strong>Activación automática:</strong> {promotion.reason}
                  </AlertDescription>
                </Alert>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Service Analysis */}
      {serviceAnalysis && serviceAnalysis.length > 0 && (
        <Card className="bg-gray-900 border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Eye className="h-5 w-5 text-purple-500" />
              Análisis Detallado por Servicio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceAnalysis.map((service) => (
                <div key={service.serviceId} className="border border-blue-800/50 rounded-lg p-4 bg-gray-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-white">
                      {service.serviceName.replace(/Servicio\s+/, '')}
                    </h3>
                    <Users className="h-4 w-4 text-blue-400" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Demanda Actual</span>
                      <Badge className={getDemandColor(service.currentDemand)}>
                        {service.currentDemand}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Acción Recomendada</span>
                      <Badge className={getActionColor(service.recommendedAction)}>
                        {service.recommendedAction}
                      </Badge>
                    </div>

                    {service.avgOccupancy !== null && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Ocupación Promedio</span>
                        <span className="text-white font-medium">
                          {(service.avgOccupancy * 100).toFixed(1)}%
                        </span>
                      </div>
                    )}

                    {service.avgPrice !== null && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Precio Promedio</span>
                        <span className="text-white font-medium">
                          ${service.avgPrice.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {service.potentialPromotion && (
                      <div className="mt-3 p-2 bg-green-900/20 border border-green-600/50 rounded">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-sm text-green-300">Promoción potencial disponible</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-800 border border-blue-800/50 rounded">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <p className="text-sm text-gray-400">Alta Demanda</p>
                <p className="text-xl font-bold text-white">
                  {serviceAnalysis.filter(s => s.currentDemand === 'high').length}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-800 border border-blue-800/50 rounded">
                <Target className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                <p className="text-sm text-gray-400">Demanda Media</p>
                <p className="text-xl font-bold text-white">
                  {serviceAnalysis.filter(s => s.currentDemand === 'medium').length}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-800 border border-blue-800/50 rounded">
                <AlertCircle className="h-6 w-6 mx-auto mb-2 text-red-500" />
                <p className="text-sm text-gray-400">Baja Demanda</p>
                <p className="text-xl font-bold text-white">
                  {serviceAnalysis.filter(s => s.currentDemand === 'low').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 