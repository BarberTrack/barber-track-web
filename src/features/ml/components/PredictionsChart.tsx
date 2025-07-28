import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/shadcn/card"
import { Scatter, ScatterChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"
import type { ChartData } from "../types"

interface PredictionsChartProps {
  chartData: ChartData;
  loading?: boolean;
}

export const PredictionsChart = ({ chartData, loading = false }: PredictionsChartProps) => {
  if (loading) {
    return (
      <Card className="bg-gray-900 border-blue-800">
        <CardHeader>
          <div className="h-6 bg-gray-700 rounded animate-pulse w-64" />
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-800 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const scatterData = chartData.confidenceChart.data.datasets[0]?.data.map(point => ({
    x: parseFloat(point.x),
    y: point.y,
    name: `${point.x} citas`
  })) || [];

  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-blue-600 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium">Predicción: {data.x.toFixed(2)} citas</p>
          <p className="text-blue-400">Confianza: {data.y}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gray-900 border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <TrendingUp className="h-5 w-5 text-yellow-500" />
          Confianza vs Predicciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart data={scatterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                type="number"
                dataKey="x"
                name="Citas Predichas"
                stroke="#9CA3AF"
                label={{ value: 'Citas Predichas', position: 'insideBottom', offset: -10, style: { fill: '#9CA3AF' } }}
              />
              <YAxis 
                type="number"
                dataKey="y"
                name="Confianza"
                stroke="#9CA3AF"
                domain={[0, 100]}
                label={{ value: 'Confianza (%)', angle: -90, position: 'insideLeft', style: { fill: '#9CA3AF' } }}
              />
              <Tooltip content={renderTooltip} />
              <Scatter 
                dataKey="y" 
                fill="#FDE047" 
                stroke="#F59E0B"
                strokeWidth={2}
                r={6}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-gray-400">
          <p>• Puntos más altos indican mayor confianza en la predicción</p>
          <p>• Dispersión horizontal muestra rango de predicciones</p>
        </div>
      </CardContent>
    </Card>
  );
}; 