import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { CreateBusinessState, CreateBusinessData, CreateBusinessResponse } from '../types/business.types';
import { createBusinessService } from '../services/createBusinessService';

const initialState: CreateBusinessState = {
  isLoading: false,
  error: null,
  success: false,
};

// Async thunk para crear negocio
export const createBusiness = createAsyncThunk<
  CreateBusinessResponse,
  CreateBusinessData,
  { rejectValue: string }
>(
  'createBusiness/create',
  async (businessData, { rejectWithValue }) => {
    try {
      const response = await createBusinessService.createBusiness(businessData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al crear el negocio');
    }
  }
);

const createBusinessSlice = createSlice({
  name: 'createBusiness',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createBusiness.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(createBusiness.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error desconocido';
        state.success = false;
      });
  },
});

export const { clearError, clearSuccess, resetState } = createBusinessSlice.actions;
export default createBusinessSlice.reducer;

// Selectors
export const selectCreateBusiness = (state: { createBusiness: CreateBusinessState }) => state.createBusiness;
export const selectIsLoading = (state: { createBusiness: CreateBusinessState }) => state.createBusiness.isLoading;
export const selectError = (state: { createBusiness: CreateBusinessState }) => state.createBusiness.error;
export const selectSuccess = (state: { createBusiness: CreateBusinessState }) => state.createBusiness.success; 