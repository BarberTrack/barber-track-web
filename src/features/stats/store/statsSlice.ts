import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { statsService } from '../services/statsService';
import type { StatsState, Period, StatsSummaryType } from '../types';

// Helper function to get date range for last year
const getLastYearDateRange = () => {
  const now = new Date();
  const from = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString().split('T')[0];
  const to = new Date().toISOString().split('T')[0];
  return { from, to };
};

// Helper function to calculate summary
const calculateSummary = (data: any[]): StatsSummaryType => {
  if (!data || data.length === 0) {
    return { total: 0, average: 0, growth: 0, peak: 0, lowest: 0 };
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);
  const average = total / data.length;
  const counts = data.map(item => item.count);
  const peak = Math.max(...counts);
  const lowest = Math.min(...counts);

  // Calculate growth (last vs first)
  const firstCount = data[0]?.count || 0;
  const lastCount = data[data.length - 1]?.count || 0;
  const growth = firstCount > 0 ? ((lastCount - firstCount) / firstCount) * 100 : 0;

  return { total, average, growth, peak, lowest };
};

const initialState: StatsState = {
  data: null,
  loading: false,
  error: null,
  filters: {
    period: 'month',
    dateRange: getLastYearDateRange(),
  },
  summary: null,
};

// Async thunks
export const fetchStatsData = createAsyncThunk(
  'stats/fetchStatsData',
  async ({ businessId, period, from, to }: { 
    businessId: string; 
    period: Period; 
    from: string; 
    to: string; 
  }) => {
    const response = await statsService.getStatsData(businessId, period, from, to);
    if (!response.success) {
      throw new Error(response.message || 'Error al obtener datos de estadísticas');
    }
    return response.data;
  }
);

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    // Filter actions
    setPeriod: (state, action: PayloadAction<Period>) => {
      state.filters.period = action.payload;
    },
    setDateRange: (state, action: PayloadAction<{ from: string; to: string }>) => {
      state.filters.dateRange = action.payload;
    },
    
    // Clear actions
    clearError: (state) => {
      state.error = null;
    },
    clearData: (state) => {
      state.data = null;
      state.summary = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatsData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.summary = calculateSummary(action.payload);
        state.error = null;
      })
      .addCase(fetchStatsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar estadísticas';
      });
  },
});

export const {
  setPeriod,
  setDateRange,
  clearError,
  clearData,
} = statsSlice.actions;

export default statsSlice.reducer; 