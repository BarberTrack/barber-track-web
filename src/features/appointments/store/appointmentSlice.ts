import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  AppointmentState, 
  AppointmentsData, 
  QueryParams,
  FilterState,
  AppointmentStatus 
} from '../types/appointment.types';
import { appointmentService } from '../services/appointmentService';

const initialState: AppointmentState = {
  appointments: [],
  statusStats: {
    scheduled: 0,
    completed: 0,
    cancelled: 0,
  },
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  },
  isLoading: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
  },
};

// Async thunk para obtener citas por businessId
export const fetchAppointments = createAsyncThunk<
  AppointmentsData,
  { businessId: string; params?: QueryParams },
  { rejectValue: string }
>(
  'appointments/fetchAppointments',
  async ({ businessId, params }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAppointmentsByBusinessId(businessId, params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener las citas');
    }
  }
);

// Async thunk para obtener citas por estado
export const fetchAppointmentsByStatus = createAsyncThunk<
  AppointmentsData,
  { businessId: string; status: AppointmentStatus; params?: Omit<QueryParams, 'status'> },
  { rejectValue: string }
>(
  'appointments/fetchAppointmentsByStatus',
  async ({ businessId, status, params }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAppointmentsByStatus(businessId, status, params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener las citas por estado');
    }
  }
);



// Async thunk para obtener citas por barbero
export const fetchAppointmentsByBarber = createAsyncThunk<
  AppointmentsData,
  { businessId: string; barberId: string; params?: Omit<QueryParams, 'barberId'> },
  { rejectValue: string }
>(
  'appointments/fetchAppointmentsByBarber',
  async ({ businessId, barberId, params }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAppointmentsByBarber(businessId, barberId, params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener las citas del barbero');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    // Limpiar errores
    clearError: (state) => {
      state.error = null;
    },

    // Actualizar filtros
    updateFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    // Resetear filtros
    resetFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 10,
      };
    },

    // Cambiar página
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
      state.pagination.page = action.payload;
    },

    // Cambiar límite de elementos por página
    setLimit: (state, action: PayloadAction<number>) => {
      state.filters.limit = action.payload;
      state.pagination.limit = action.payload;
    },

    // Limpiar appointments
    clearAppointments: (state) => {
      state.appointments = [];
      state.pagination = {
        page: 1,
        totalPages: 1,
        total: 0,
        limit: 10,
      };
      state.statusStats = {
        scheduled: 0,
        completed: 0,
        cancelled: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAppointments
      .addCase(fetchAppointments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // action.payload ya es la parte 'data' extraída por el servicio (AppointmentsData)
        const responseData = action.payload;
        
        state.appointments = responseData?.appointments || [];
        
        // Mapear statusStats de la API a nuestra estructura
        const apiStats = responseData?.statusStats;
        state.statusStats = {
          scheduled: apiStats?.scheduled || 0,
          completed: apiStats?.completed || 0,
          cancelled: apiStats?.cancelled || 0,
        };
        
        state.pagination = {
          page: responseData?.page || 1,
          totalPages: responseData?.totalPages || 1,
          total: responseData?.total || 0,
          limit: state.filters.limit,
        };
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error al obtener las citas';
      })

      // fetchAppointmentsByStatus
      .addCase(fetchAppointmentsByStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentsByStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // action.payload ya es la parte 'data' extraída por apiClient
        const responseData = action.payload;
        
        state.appointments = responseData?.appointments || [];
        
        // Mapear statusStats de la API a nuestra estructura
        const apiStats = responseData?.statusStats;
        state.statusStats = {
          scheduled: apiStats?.scheduled || 0,
          completed: apiStats?.completed || 0,
          cancelled: apiStats?.cancelled || 0,
        };
        
        state.pagination = {
          page: responseData?.page || 1,
          totalPages: responseData?.totalPages || 1,
          total: responseData?.total || 0,
          limit: state.filters.limit,
        };
      })
      .addCase(fetchAppointmentsByStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error al obtener las citas por estado';
      })



      // fetchAppointmentsByBarber
      .addCase(fetchAppointmentsByBarber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentsByBarber.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // action.payload ya es la parte 'data' extraída por apiClient
        const responseData = action.payload;
        
        state.appointments = responseData?.appointments || [];
        
        // Mapear statusStats de la API a nuestra estructura
        const apiStats = responseData?.statusStats;
        state.statusStats = {
          scheduled: apiStats?.scheduled || 0,
          completed: apiStats?.completed || 0,
          cancelled: apiStats?.cancelled || 0,
        };
        
        state.pagination = {
          page: responseData?.page || 1,
          totalPages: responseData?.totalPages || 1,
          total: responseData?.total || 0,
          limit: state.filters.limit,
        };
      })
      .addCase(fetchAppointmentsByBarber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error al obtener las citas del barbero';
      });
  },
});

// Export actions
export const {
  clearError,
  updateFilters,
  resetFilters,
  setPage,
  setLimit,
  clearAppointments,
} = appointmentSlice.actions;

// Selector
export const selectAppointments = (state: { appointments: AppointmentState }) => state.appointments;

// Export reducer
export default appointmentSlice.reducer; 