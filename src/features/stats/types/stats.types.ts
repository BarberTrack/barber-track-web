// Period Types
export type Period = 'day' | 'week' | 'month' | 'year';

// Stats Data Types
export interface StatsDataPoint {
  period: string;
  count: number;
  date: string;
}

export interface StatsResponse {
  success: boolean;
  message: string;
  data: StatsDataPoint[];
}

export interface StatsFiltersType {
  businessId: string;
  period: Period;
  dateRange: {
    from: string;
    to: string;
  };
}

export interface StatsSummaryType {
  total: number;
  average: number;
  growth: number;
  peak: number;
  lowest: number;
}

export interface StatsChartData {
  name: string;
  value: number;
  count: number;
  date: string;
}

// State Types
export interface StatsState {
  data: StatsDataPoint[] | null;
  loading: boolean;
  error: string | null;
  filters: {
    period: Period;
    dateRange: {
      from: string;
      to: string;
    };
  };
  summary: StatsSummaryType | null;
}

// Component Props Types
export interface StatsHeaderProps {
  data: StatsDataPoint[] | null;
  summary: StatsSummaryType | null;
  loading: boolean;
}

export interface StatsFiltersProps {
  period: Period;
  dateRange: { from: string; to: string };
  onPeriodChange: (period: Period) => void;
  onDateRangeChange: (range: { from: string; to: string }) => void;
}

export interface StatsChartProps {
  data: StatsDataPoint[] | null;
  loading: boolean;
  period: Period;
}

export interface StatsSummaryProps {
  summary: StatsSummaryType | null;
  loading: boolean;
} 