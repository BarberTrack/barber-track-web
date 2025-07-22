import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  AnalyticsState, 
  DashboardData, 
  ServiceTrendsData, 
  AnalyticsQueryParams 
} from '../types/analytics.types';
import { analyticsService } from '../services/analyticsService';

const initialState: AnalyticsState = {
  // Dashboard data
  dashboardData: null,
  isDashboardLoading: false,
  dashboardError: null,
  
  // Service trends data
  serviceTrendsData: null,
  isServiceTrendsLoading: false,
  serviceTrendsError: null,
  
  // Metadata
  currentBusinessId: null,
  lastFetchTime: null,
};

// Async thunk para obtener datos del dashboard
export const fetchDashboardData = createAsyncThunk<
  DashboardData,
  { businessId: string; params: AnalyticsQueryParams },
  { rejectValue: string }
>(
  'analytics/fetchDashboardData',
  async ({ businessId, params }, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getDashboardData(businessId, params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener datos del dashboard');
    }
  }
);

// Async thunk para obtener tendencias de servicios
export const fetchServiceTrends = createAsyncThunk<
  ServiceTrendsData,
  { businessId: string; params: AnalyticsQueryParams },
  { rejectValue: string }
>(
  'analytics/fetchServiceTrends',
  async ({ businessId, params }, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getServiceTrends(businessId, params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener tendencias de servicios');
    }
  }
);

// Async thunk para obtener todos los datos de analytics
export const fetchCompleteAnalytics = createAsyncThunk<
  { dashboard: DashboardData; serviceTrends: ServiceTrendsData },
  { businessId: string; params: AnalyticsQueryParams },
  { rejectValue: string }
>(
  'analytics/fetchCompleteAnalytics',
  async ({ businessId, params }, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getCompleteAnalytics(businessId, params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener datos de analytics');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    // Limpiar errores del dashboard
    clearDashboardError: (state) => {
      state.dashboardError = null;
    },

    // Limpiar errores de tendencias de servicios
    clearServiceTrendsError: (state) => {
      state.serviceTrendsError = null;
    },

    // Limpiar todos los errores
    clearAllErrors: (state) => {
      state.dashboardError = null;
      state.serviceTrendsError = null;
    },

    // Limpiar todos los datos
    clearAllData: (state) => {
      state.dashboardData = null;
      state.serviceTrendsData = null;
      state.currentBusinessId = null;
      state.lastFetchTime = null;
      state.dashboardError = null;
      state.serviceTrendsError = null;
    },

    // Actualizar business ID actual
    setCurrentBusinessId: (state, action: PayloadAction<string>) => {
      // Si cambia el business ID, limpiar datos previos
      if (state.currentBusinessId !== action.payload) {
        state.serviceTrendsData = null;
        state.serviceTrendsError = null;
      }
      state.currentBusinessId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchDashboardData
      .addCase(fetchDashboardData.pending, (state) => {
        state.isDashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isDashboardLoading = false;
        state.dashboardData = action.payload;
        state.lastFetchTime = new Date().toISOString();
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isDashboardLoading = false;
        state.dashboardError = action.payload || 'Error al obtener datos del dashboard';
      })

      // fetchServiceTrends
      .addCase(fetchServiceTrends.pending, (state) => {
        state.isServiceTrendsLoading = true;
        state.serviceTrendsError = null;
      })
      .addCase(fetchServiceTrends.fulfilled, (state, action) => {
        state.isServiceTrendsLoading = false;
        state.serviceTrendsData = action.payload;
        state.currentBusinessId = action.payload.businessData.businessId;
        state.lastFetchTime = new Date().toISOString();
      })
      .addCase(fetchServiceTrends.rejected, (state, action) => {
        state.isServiceTrendsLoading = false;
        state.serviceTrendsError = action.payload || 'Error al obtener tendencias de servicios';
      })

      // fetchCompleteAnalytics
      .addCase(fetchCompleteAnalytics.pending, (state) => {
        state.isDashboardLoading = true;
        state.isServiceTrendsLoading = true;
        state.dashboardError = null;
        state.serviceTrendsError = null;
      })
      .addCase(fetchCompleteAnalytics.fulfilled, (state, action) => {
        state.isDashboardLoading = false;
        state.isServiceTrendsLoading = false;
        state.dashboardData = action.payload.dashboard;
        state.serviceTrendsData = action.payload.serviceTrends;
        state.currentBusinessId = action.payload.serviceTrends.businessData.businessId;
        state.lastFetchTime = new Date().toISOString();
      })
      .addCase(fetchCompleteAnalytics.rejected, (state, action) => {
        state.isDashboardLoading = false;
        state.isServiceTrendsLoading = false;
        const error = action.payload || 'Error al obtener datos de analytics';
        state.dashboardError = error;
        state.serviceTrendsError = error;
      });
  },
});

// Export actions
export const {
  clearDashboardError,
  clearServiceTrendsError,
  clearAllErrors,
  clearAllData,
  setCurrentBusinessId,
} = analyticsSlice.actions;

// Selector
export const selectAnalytics = (state: { analytics: AnalyticsState }) => state.analytics;

// Export reducer
export default analyticsSlice.reducer; 