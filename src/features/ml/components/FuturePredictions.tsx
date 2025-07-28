import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/shadcn/card"
import { Badge } from "@/shared/components/shadcn/badge"
import { Progress } from "@/shared/components/shadcn/progress"
import { Calendar, TrendingUp, TrendingDown, Target } from "lucide-react"
import type { ServicePrediction, ServiceAnalytic } from "../types"

interface FuturePredictionsProps {
  predictions: ServicePrediction[];
  serviceAnalytics: ServiceAnalytic[];
  loading?: boolean;
}

export const FuturePredictions = ({ predictions, serviceAnalytics, loading = false }: FuturePredictionsProps) => {
  if (loading) {
    return (
      <Card className="bg-gray-900 border-blue-800">
        <CardHeader>
          <div className="h-6 bg-gray-700 rounded animate-pulse w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-800 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group predictions by service
  const predictionsByService = predictions.reduce((acc, prediction) => {
    if (!acc[prediction.serviceId]) {
      acc[prediction.serviceId] = [];
    }
    acc[prediction.serviceId].push(prediction);
    return acc;
  }, {} as Record<string, ServicePrediction[]>);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit"
    });
  };

  const getServiceName = (serviceId: string) => {
    const service = serviceAnalytics.find(s => s.serviceId === serviceId);
    return service?.serviceName.replace(/Servicio\s+/, '') || serviceId.substring(0, 8);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return "text-green-400";
    if (confidence >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getTrendIcon = (current: number, next: number) => {
    if (next > current) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (next < current) return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <Target className="h-4 w-4 text-blue-400" />;
  };

  return (
    <Card className="bg-gray-900 border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Calendar className="h-5 w-5 text-blue-500" />
          Predicciones Futuras por Servicio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(predictionsByService).map(([serviceId, servicePredictions]) => {
            const sortedPredictions = servicePredictions.sort((a, b) => 
              new Date(a.predictionDate).getTime() - new Date(b.predictionDate).getTime()
            );
            
            const bestPrediction = sortedPredictions.reduce((max, p) => 
              parseFloat(p.predictedAppointments) > parseFloat(max.predictedAppointments) ? p : max
            );
            
            const worstPrediction = sortedPredictions.reduce((min, p) => 
              parseFloat(p.predictedAppointments) < parseFloat(min.predictedAppointments) ? p : min
            );

            return (
              <div key={serviceId} className="border border-blue-800/50 rounded-lg p-4 bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {getServiceName(serviceId)}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600/20 text-blue-400 border-blue-600">
                      {servicePredictions.length} predicciones
                    </Badge>
                    <Badge className="bg-green-600/20 text-green-400 border-green-600">
                      Máx: {bestPrediction.predictedAppointments}
                    </Badge>
                    <Badge className="bg-red-600/20 text-red-400 border-red-600">
                      Mín: {worstPrediction.predictedAppointments}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sortedPredictions.slice(0, 6).map((prediction, index) => {
                    const confidence = parseFloat(prediction.confidenceInterval) * 100;
                    const predicted = parseFloat(prediction.predictedAppointments);
                    const lowerBound = parseFloat(prediction.predictionLowerBound);
                    const upperBound = parseFloat(prediction.predictionUpperBound);
                    const nextPrediction = sortedPredictions[index + 1];
                    const nextPredicted = nextPrediction ? parseFloat(nextPrediction.predictedAppointments) : predicted;

                    return (
                      <div key={prediction.id} className="bg-gray-900 border border-blue-800/30 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white">
                            {formatDate(prediction.predictionDate)}
                          </span>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(predicted, nextPredicted)}
                            <span className={`text-xs font-medium ${getConfidenceColor(confidence)}`}>
                              {confidence.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-center">
                            <span className="text-2xl font-bold text-blue-400">
                              {predicted.toFixed(1)}
                            </span>
                            <span className="text-sm text-gray-400 ml-1">citas</span>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>Rango:</span>
                              <span>{lowerBound.toFixed(1)} - {upperBound.toFixed(1)}</span>
                            </div>
                            <Progress 
                              value={confidence} 
                              className="h-1 bg-gray-700"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {sortedPredictions.length > 6 && (
                  <div className="mt-3 text-center">
                    <span className="text-sm text-gray-400">
                      +{sortedPredictions.length - 6} predicciones más
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}; 