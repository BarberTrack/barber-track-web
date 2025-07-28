import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { analyticsService } from '../services/analyticsService';
import type { AnalyticsState } from '../types';

// Helper function to get date range for last year
const getLastYearDateRange = () => {
  const now = new Date();
  const from = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString().split('T')[0];
  const to = new Date().toISOString().split('T')[0];
  return { from, to };
};

const initialState: AnalyticsState = {
  dashboard: {
    data: null,
    loading: false,
    error: null,
  },
  reports: {
    data: null,
    loading: false,
    error: null,
  },
  filters: {
    period: 'week',
    reportType: 'appointments',
    dateRange: getLastYearDateRange(),
    groupBy: 'month',
  },
};

// Async thunks
export const fetchDashboard = createAsyncThunk(
  'analytics/fetchDashboard',
  async ({ businessId, period }: { businessId: string; period: 'week' | 'month' }) => {
    const response = await analyticsService.getDashboard(businessId, period);
    if (!response.success) {
      throw new Error(response.message || 'Error al obtener datos del dashboard');
    }
    return response.data;
  }
);

export const fetchReports = createAsyncThunk(
  'analytics/fetchReports',
  async ({
    businessId,
    type,
    from,
    to,
    groupBy,
  }: {
    businessId: string;
    type: 'appointments' | 'revenue' | 'services';
    from: string;
    to: string;
    groupBy: 'week' | 'month';
  }) => {
    const response = await analyticsService.getReports(businessId, type, from, to, groupBy);
    if (!response.success) {
      throw new Error(response.message || 'Error al obtener reportes');
    }
    return response.data;
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    // Filter actions
    setPeriod: (state, action: PayloadAction<'week' | 'month'>) => {
      state.filters.period = action.payload;
    },
    setReportType: (state, action: PayloadAction<'appointments' | 'revenue' | 'services'>) => {
      state.filters.reportType = action.payload;
    },
    setDateRange: (state, action: PayloadAction<{ from: string; to: string }>) => {
      state.filters.dateRange = action.payload;
    },
    setGroupBy: (state, action: PayloadAction<'week' | 'month'>) => {
      state.filters.groupBy = action.payload;
    },
    
    // Clear actions
    clearDashboardError: (state) => {
      state.dashboard.error = null;
    },
    clearReportsError: (state) => {
      state.reports.error = null;
    },
    clearAllErrors: (state) => {
      state.dashboard.error = null;
      state.reports.error = null;
    },
  },
  extraReducers: (builder) => {
    // Dashboard cases
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.dashboard.loading = true;
        state.dashboard.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.dashboard.loading = false;
        state.dashboard.data = action.payload;
        state.dashboard.error = null;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.dashboard.loading = false;
        state.dashboard.error = action.error.message || 'Error al cargar dashboard';
      })
      
      // Reports cases
      .addCase(fetchReports.pending, (state) => {
        state.reports.loading = true;
        state.reports.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.reports.loading = false;
        state.reports.data = action.payload;
        state.reports.error = null;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.reports.loading = false;
        state.reports.error = action.error.message || 'Error al cargar reportes';
      });
  },
});

export const {
  setPeriod,
  setReportType,
  setDateRange,
  setGroupBy,
  clearDashboardError,
  clearReportsError,
  clearAllErrors,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;