// Service Trends API Types
export interface ServiceTrendsModel {
  id: string;
  modelType: string;
  modelName: string;
  version: string;
  status: string;
  isActive: boolean;
  trainingDataStartDate: string;
  trainingDataEndDate: string;
  trainingRecordsCount: number;
  validationAccuracy: string;
  mapeScore: string;
  trainedAt: string;
  createdAt: string;
}

export interface TrendsDataPoint {
  date: string;
  historical?: number;
  predicted?: string;
  confidence?: string;
}

export interface ServicePrediction {
  id: string;
  businessId: string;
  serviceId: string;
  predictionDate: string;
  predictedAppointments: string;
  predictionLowerBound: string;
  predictionUpperBound: string;
  confidenceInterval: string;
  modelVersion: string;
  modelName: string;
  status: string;
  predictedAt: string;
  createdAt: string;
  predictionMetadata?: any;
}

export interface ServicePerformance {
  status: string;
  trend: string;
  demandLevel: string;
  weeklyPattern: string;
  avgDailyAppointments: number;
  totalHistoricalAppointments: number;
  confidenceScore?: number;
}

export interface ServicePredictions {
  avgPredicted?: number;
  maxPredicted: number;
  minPredicted: number;
  totalPredicted?: number;
  bestDay: {
    date: string;
    dayName: string;
    predicted: string;
  };
  worstDay: {
    date: string;
    dayName: string;
    predicted: string;
  };
  weekendVsWeekday: {
    weekendAvg?: number;
    weekdayAvg?: number;
    preference: string;
  };
}

export interface ServiceInsights {
  seasonality: string;
  growthRate: number;
  volatility: string;
  recommendations: string[];
  competitivePosition: string;
}

export interface ServiceAnalytic {
  serviceId: string;
  serviceName: string;
  performance: ServicePerformance;
  predictions: ServicePredictions;
  insights: ServiceInsights;
}

export interface ChartData {
  trendsChart: {
    type: string;
    data: {
      labels: string[];
      datasets: Array<{
        label: string;
        data: (number | string | null)[];
        borderColor: string;
        backgroundColor: string;
        tension?: number;
        borderDash?: number[];
      }>;
    };
    options: any;
  };
  accuracyChart: {
    type: string;
    data: {
      labels: string[];
      datasets: Array<{
        label: string;
        data: number[];
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
      }>;
    };
    options: any;
  };
  confidenceChart: {
    type: string;
    data: {
      datasets: Array<{
        label: string;
        data: Array<{ x: string; y: number }>;
        backgroundColor: string;
        borderColor: string;
      }>;
    };
    options: any;
  };
}

export interface ServiceTrendsAnalytics {
  totalPredictions: number;
  averageAccuracy: number;
  lastTraining: string;
  nextScheduledTraining: string;
  trendsData: TrendsDataPoint[];
  serviceAnalytics: ServiceAnalytic[];
  trendDirection: string;
  demandLevel: string;
  servicePerformance: string;
  weeklyPattern: string;
  topServices: Array<{
    serviceId: string;
    totalAppointments: number;
    avgDaily: number;
  }>;
  recommendations: string[];
}

export interface ServiceTrendsResponse {
  businessId: string;
  predictions: ServicePrediction[];
  models: ServiceTrendsModel[];
  analytics: ServiceTrendsAnalytics;
  charts: ChartData;
}

// Promotion Prediction API Types
export interface PromotionModel {
  id: string;
  modelType: string;
  modelName: string;
  version: string;
  status: string;
  isActive: boolean;
  trainingDataStartDate: string;
  trainingDataEndDate: string;
  trainingRecordsCount: number;
  validationAccuracy: string;
  mapeScore: string;
  trainedAt: string;
  createdAt: string;
}

export interface ExpectedImpact {
  roi: number;
  revenueIncrease: number;
  currentOccupancy: number;
  occupancyIncrease: number;
  predictedOccupancy: number;
}

export interface ActivationConditions {
  targetDate: string;
  targetHour: string | null;
  minOccupancy: number;
}

export interface BusinessPromotion {
  id: string;
  businessId: string;
  promotionType: string;
  title: string;
  description: string;
  discountAmount: number;
  servicesIncluded: string[];
  urgency: string;
  reason: string;
  expectedImpact: ExpectedImpact;
  activationConditions: ActivationConditions;
  confidenceScore: string;
  status: string;
  predictedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessAnalysis {
  totalServices: number;
  servicesWithLowDemand: number;
  servicesWithMediumDemand: number;
  servicesWithHighDemand: number;
  overallOccupancy: number | null;
  recommendedStrategy: string;
}

export interface ServiceAnalysis {
  serviceId: string;
  serviceName: string;
  currentDemand: string;
  recommendedAction: string;
  potentialPromotion: any;
  avgOccupancy: number | null;
  avgPrice: number | null;
}

export interface PromotionTrendsData {
  date: string;
  historicalOccupancy: number | null;
  predictedOccupancy: number | null;
  confidence: string;
  discountAmount: number;
  promotionType: string;
}

export interface PromotionAnalytics {
  totalPromotions: number;
  averageDiscount: number;
  lastTraining: string;
  nextScheduledTraining: string;
  businessAnalysis: BusinessAnalysis;
  trendsData: PromotionTrendsData[];
  serviceAnalysis: ServiceAnalysis[];
}

export interface PromotionPredictionsResponse {
  businessId: string;
  businessPromotions: BusinessPromotion[];
  models: PromotionModel[];
  analytics: PromotionAnalytics;
}

// Combined ML Data Interface
export interface MLData {
  serviceTrends: ServiceTrendsResponse | null;
  promotionPredictions: PromotionPredictionsResponse | null;
  loading: boolean;
  error: string | null;
}

// Additional utility types for the enhanced components
export interface PredictionsByService {
  [serviceId: string]: ServicePrediction[];
}

export interface ServiceDemandAnalysis {
  serviceId: string;
  serviceName: string;
  trendsAnalysis: ServiceAnalytic;
  promotionAnalysis: ServiceAnalysis;
  predictions: ServicePrediction[];
} 