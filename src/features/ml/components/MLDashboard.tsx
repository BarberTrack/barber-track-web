import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/shadcn/card"
import { Badge } from "@/shared/components/shadcn/badge"
import { Progress } from "@/shared/components/shadcn/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/shadcn/tabs"
import { Alert, AlertDescription } from "@/shared/components/shadcn/alert"
import { Button } from "@/shared/components/shadcn/button"
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  Users,
  Zap,
  Star,
  Activity,
  RefreshCw,
  Loader2,
  BarChart3,
  Calendar,
  Settings,
  Building2,
  ArrowLeft,
} from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useNavigate } from "react-router"
import { useMLData } from "../hooks"
import { PredictionsChart, FuturePredictions, PromotionActivation } from "./"
import type { ServiceAnalytic, BusinessPromotion } from "../types"

interface MLDashboardProps {
  businessId: string;
  businessName?: string;
}

export default function MLDashboard({ businessId, businessName }: MLDashboardProps) {
  const navigate = useNavigate();
  const { 
    serviceTrends, 
    promotionPredictions, 
    loading, 
    error, 
    isRefreshing, 
    refresh 
  } = useMLData(businessId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    if (status.includes("Preocupante")) return "destructive"
    if (status.includes("Necesita")) return "secondary"
    return "default"
  }

  const getTrendIcon = (trend: string) => {
    if (trend.includes("crecimiento") || trend.includes("📈")) 
      return <TrendingUp className="h-4 w-4 text-green-400" />
    if (trend.includes("declive") || trend.includes("📉")) 
      return <TrendingDown className="h-4 w-4 text-red-400" />
    return <Activity className="h-4 w-4 text-blue-400" />
  }

  const cleanEmojis = (text: string) => {
    return text.replace(/[🔧⚠️📈📉📊🌪️👑🎯🔄🤖🚨🌟]/gu, "").trim()
  }

  const handleBackToDashboard = () => {
    navigate(`/dashboard/${businessId}`);
  }

  if (loading && !serviceTrends && !promotionPredictions) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
              <p className="text-white text-lg">Cargando datos de ML...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !serviceTrends && !promotionPredictions) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
              <p className="text-white text-lg">Error al cargar los datos</p>
              <p className="text-gray-400">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleBackToDashboard} variant="outline" className="border-gray-600 text-gray-400 hover:bg-gray-800">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al Dashboard
                </Button>
                <Button onClick={refresh} className="bg-blue-600 hover:bg-blue-700">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reintentar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header with Business Name and Navigation */}
        <div className="text-center space-y-4">
          {/* Navigation Bar */}
          <div className="flex items-center justify-between w-full">
            <Button
              onClick={handleBackToDashboard}
              variant="outline"
              className="bg-gray-900 border-blue-600 text-blue-400 hover:bg-blue-600/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={refresh}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="bg-gray-900 border-blue-600 text-blue-400 hover:bg-blue-600/10"
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Main Title */}
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <Brain className="h-10 w-10 text-blue-500" />
              Dashboard ML
            </h1>
          </div>
          
          {/* Business Name Section */}
          {businessName && (
            <div className="flex items-center justify-center gap-2 p-4 bg-gray-900 border border-blue-800 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-500" />
              <h2 className="text-2xl font-semibold text-white">{businessName}</h2>
              <Badge className="bg-blue-600/20 text-blue-400 border-blue-600">
                Análisis ML
              </Badge>
            </div>
          )}
          
          <p className="text-gray-400 text-lg">Análisis inteligente de servicios y promociones</p>
        </div>

        {/* Enhanced Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-900 border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Promociones Activas</CardTitle>
              <Zap className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {promotionPredictions?.analytics.totalPromotions || 0}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Descuento promedio: {promotionPredictions?.analytics.averageDiscount || 0}%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Servicios Analizados</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-500">
                {serviceTrends?.analytics.serviceAnalytics.length || 0}
              </div>
              <p className="text-xs text-gray-400 mt-1">En monitoreo continuo</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Predicciones Futuras</CardTitle>
              <Calendar className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {serviceTrends?.analytics.totalPredictions || 0}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Precisión: {serviceTrends?.analytics.averageAccuracy ? (serviceTrends.analytics.averageAccuracy * 100).toFixed(1) : 0}%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Servicios Alta Demanda</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {promotionPredictions?.analytics.businessAnalysis.servicesWithHighDemand || 0}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Total servicios: {promotionPredictions?.analytics.businessAnalysis.totalServices || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-blue-800">
            <TabsTrigger 
              value="trends" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Tendencias
            </TabsTrigger>
            <TabsTrigger 
              value="predictions"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Predicciones
            </TabsTrigger>
            <TabsTrigger 
              value="promotions"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400"
            >
              <Zap className="h-4 w-4 mr-2" />
              Promociones
            </TabsTrigger>
            <TabsTrigger 
              value="activation"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400"
            >
              <Settings className="h-4 w-4 mr-2" />
              Activación
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            {serviceTrends ? (
              <>
                {/* Enhanced Trends Chart */}
                <Card className="bg-gray-900 border-blue-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      Tendencias Históricas vs Predicciones
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Evolución de citas con predicciones futuras y intervalos de confianza
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={serviceTrends.analytics.trendsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={formatDate} 
                            interval="preserveStartEnd"
                            stroke="#9CA3AF"
                          />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #3B82F6',
                              borderRadius: '8px',
                              color: '#fff'
                            }}
                            formatter={(value, name) => [
                              typeof value === 'string' && !isNaN(Number(value)) ? Number(value).toFixed(1) : value,
                              name
                            ]}
                          />
                          <Line
                            type="monotone"
                            dataKey="historical"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            dot={{ fill: "#3B82F6", strokeWidth: 2, r: 5 }}
                            name="Histórico"
                          />
                          <Line
                            type="monotone"
                            dataKey="predicted"
                            stroke="#F59E0B"
                            strokeWidth={3}
                            strokeDasharray="5 5"
                            dot={{ fill: "#F59E0B", strokeWidth: 2, r: 5 }}
                            name="Predicción"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-3 bg-blue-900/20 border border-blue-600/50 rounded">
                        <p className="text-blue-400 font-medium">Tendencia General</p>
                        <p className="text-white">{cleanEmojis(serviceTrends.analytics.trendDirection)}</p>
                      </div>
                      <div className="text-center p-3 bg-purple-900/20 border border-purple-600/50 rounded">
                        <p className="text-purple-400 font-medium">Nivel de Demanda</p>
                        <p className="text-white">{cleanEmojis(serviceTrends.analytics.demandLevel)}</p>
                      </div>
                      <div className="text-center p-3 bg-green-900/20 border border-green-600/50 rounded">
                        <p className="text-green-400 font-medium">Patrón Semanal</p>
                        <p className="text-white">{cleanEmojis(serviceTrends.analytics.weeklyPattern)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Service Analytics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {serviceTrends.analytics.serviceAnalytics.map((service: ServiceAnalytic) => (
                    <Card key={service.serviceId} className="bg-gray-900 border-blue-800">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-white">
                            {cleanEmojis(service.serviceName)}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant={getStatusColor(service.performance.status)} className="bg-blue-600/20 text-blue-400 border-blue-600">
                              {cleanEmojis(service.performance.status)}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription className="flex items-center gap-2 text-gray-400">
                          {getTrendIcon(service.performance.trend)}
                          {cleanEmojis(service.performance.trend)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Promedio Diario</p>
                            <p className="font-semibold text-lg text-white">
                              {service.performance.avgDailyAppointments}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Total Histórico</p>
                            <p className="font-semibold text-lg text-white">
                              {service.performance.totalHistoricalAppointments}
                            </p>
                          </div>
                        </div>

                        {/* Best and Worst Days */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-green-900/20 border border-green-600/50 rounded">
                            <p className="text-xs text-green-400 mb-1">Mejor Día Predicho</p>
                            <p className="text-sm font-medium text-white">
                              {service.predictions.bestDay.predicted} citas
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatDate(service.predictions.bestDay.date)}
                            </p>
                          </div>
                          <div className="p-3 bg-red-900/20 border border-red-600/50 rounded">
                            <p className="text-xs text-red-400 mb-1">Peor Día Predicho</p>
                            <p className="text-sm font-medium text-white">
                              {service.predictions.worstDay.predicted} citas
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatDate(service.predictions.worstDay.date)}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-400 mb-2">Tasa de Crecimiento</p>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={Math.abs(service.insights.growthRate)} 
                              className="flex-1 bg-gray-800" 
                            />
                            <span
                              className={`text-sm font-medium ${
                                service.insights.growthRate > 0 ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {service.insights.growthRate > 0 ? "+" : ""}
                              {service.insights.growthRate.toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-400 mb-2">Recomendaciones Top</p>
                          <div className="space-y-1">
                            {service.insights.recommendations.slice(0, 2).map((rec, i) => (
                              <p key={i} className="text-xs bg-gray-800 border border-blue-800/50 p-2 rounded text-gray-300">
                                {cleanEmojis(rec)}
                              </p>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* System Recommendations */}
                <Card className="bg-gray-900 border-blue-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Star className="h-5 w-5 text-yellow-500" />
                      Recomendaciones del Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {serviceTrends.analytics.recommendations.map((rec, index) => (
                        <Alert key={index} className="bg-gray-800 border-blue-800/50">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <AlertDescription className="text-gray-300">
                            {cleanEmojis(rec)}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-900 border-blue-800">
                <CardContent className="flex items-center justify-center h-64">
                  <p className="text-gray-400">No se pudieron cargar las tendencias de servicios</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="predictions" className="space-y-4">
            {serviceTrends ? (
              <>
                {/* Confidence Chart */}
                <PredictionsChart 
                  chartData={serviceTrends.charts} 
                  loading={loading}
                />

                {/* Future Predictions */}
                <FuturePredictions 
                  predictions={serviceTrends.predictions}
                  serviceAnalytics={serviceTrends.analytics.serviceAnalytics}
                  loading={loading}
                />
              </>
            ) : (
              <Card className="bg-gray-900 border-blue-800">
                <CardContent className="flex items-center justify-center h-64">
                  <p className="text-gray-400">No se pudieron cargar las predicciones</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="promotions" className="space-y-4">
            {promotionPredictions ? (
              <>
                {/* Promotions Cards */}
                <Card className="bg-gray-900 border-blue-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Zap className="h-5 w-5 text-orange-500" />
                      Promociones Recomendadas por IA
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Promociones dinámicas basadas en análisis de demanda y ocupación
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {promotionPredictions.businessPromotions.length > 0 ? (
                      <div className="space-y-4">
                        {promotionPredictions.businessPromotions.map((promotion: BusinessPromotion) => (
                          <div key={promotion.id} className="border border-blue-800/50 rounded-lg p-4 space-y-4 bg-gray-800">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-lg text-white">{promotion.title}</h3>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-red-600/20 text-red-400 border-red-600 animate-pulse">
                                  Urgencia {promotion.urgency}
                                </Badge>
                                <Badge className="bg-blue-600/20 text-blue-400 border-blue-600">
                                  {promotion.discountAmount}% OFF
                                </Badge>
                              </div>
                            </div>

                            <p className="text-sm text-gray-400">{promotion.description}</p>

                            <div className="bg-yellow-900/20 border border-yellow-600/50 rounded p-3">
                              <p className="text-sm font-medium text-yellow-400">Razón del Sistema:</p>
                              <p className="text-sm text-yellow-300">{promotion.reason}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="text-center p-3 bg-blue-900/20 border border-blue-600/50 rounded">
                                <p className="text-sm text-gray-400">ROI Esperado</p>
                                <p className="text-xl font-bold text-blue-400">{promotion.expectedImpact.roi}%</p>
                              </div>
                              <div className="text-center p-3 bg-green-900/20 border border-green-600/50 rounded">
                                <p className="text-sm text-gray-400">Aumento de Ingresos</p>
                                <p className="text-xl font-bold text-green-400">${promotion.expectedImpact.revenueIncrease}</p>
                              </div>
                              <div className="text-center p-3 bg-purple-900/20 border border-purple-600/50 rounded">
                                <p className="text-sm text-gray-400">Confianza del Modelo</p>
                                <p className="text-xl font-bold text-purple-400">
                                  {(Number.parseFloat(promotion.confidenceScore) * 100).toFixed(0)}%
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <p className="text-sm font-medium text-white">Impacto en Ocupación:</p>
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm text-gray-400">
                                  <span>Actual: {(promotion.expectedImpact.currentOccupancy * 100).toFixed(1)}%</span>
                                  <span>Proyectada: {(promotion.expectedImpact.predictedOccupancy * 100).toFixed(1)}%</span>
                                </div>
                                <Progress 
                                  value={promotion.expectedImpact.predictedOccupancy * 100} 
                                  className="h-2 bg-gray-700" 
                                />
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Activar Promoción
                              </Button>
                              <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600/10">
                                Ver Detalles
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400">No hay promociones recomendadas disponibles</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Business Strategy Analysis */}
                <Card className="bg-gray-900 border-blue-800">
                  <CardHeader>
                    <CardTitle className="text-white">Análisis de Estrategia de Negocio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      // Calculate demand statistics dynamically from serviceAnalysis
                      const serviceAnalysis = promotionPredictions.analytics.serviceAnalysis || [];
                      const totalServices = serviceAnalysis.length;
                      const servicesWithHighDemand = serviceAnalysis.filter(s => s.currentDemand.toLowerCase() === 'high').length;
                      const servicesWithMediumDemand = serviceAnalysis.filter(s => s.currentDemand.toLowerCase() === 'medium').length;
                      const servicesWithLowDemand = serviceAnalysis.filter(s => s.currentDemand.toLowerCase() === 'low').length;
                      
                      return (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 border border-blue-800/50 rounded-lg bg-gray-800">
                              <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                              <p className="text-2xl font-bold text-white">
                                {totalServices}
                              </p>
                              <p className="text-sm text-gray-400">Total Servicios</p>
                            </div>
                            <div className="text-center p-4 border border-blue-800/50 rounded-lg bg-gray-800">
                              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                              <p className="text-2xl font-bold text-white">
                                {servicesWithHighDemand}
                              </p>
                              <p className="text-sm text-gray-400">Alta Demanda</p>
                            </div>
                            <div className="text-center p-4 border border-blue-800/50 rounded-lg bg-gray-800">
                              <Activity className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                              <p className="text-2xl font-bold text-white">
                                {servicesWithMediumDemand}
                              </p>
                              <p className="text-sm text-gray-400">Media Demanda</p>
                            </div>
                            <div className="text-center p-4 border border-blue-800/50 rounded-lg bg-gray-800">
                              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
                              <p className="text-2xl font-bold text-white">
                                {servicesWithLowDemand}
                              </p>
                              <p className="text-sm text-gray-400">Baja Demanda</p>
                            </div>
                          </div>
                          
                          <div className="mt-6 text-center p-4 bg-purple-900/20 border border-purple-600/50 rounded-lg">
                            <Target className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                            <p className="text-sm font-medium text-white">
                              {promotionPredictions.analytics.businessAnalysis.recommendedStrategy}
                            </p>
                            <p className="text-xs text-gray-400">Estrategia Recomendada</p>
                          </div>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-900 border-blue-800">
                <CardContent className="flex items-center justify-center h-64">
                  <p className="text-gray-400">No se pudieron cargar las predicciones de promociones</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activation" className="space-y-4">
            {promotionPredictions ? (
              <PromotionActivation 
                promotions={promotionPredictions.businessPromotions}
                serviceAnalysis={promotionPredictions.analytics.serviceAnalysis}
                loading={loading}
              />
            ) : (
              <Card className="bg-gray-900 border-blue-800">
                <CardContent className="flex items-center justify-center h-64">
                  <p className="text-gray-400">No se pudieron cargar los datos de activación</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 