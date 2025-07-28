import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PromotionState, PromotionsResponse, UpdatePromotionsRequest } from '../types/promotion.types';
import { promotionService } from '../services/promotionService';

const initialState: PromotionState = {
  promotions: [],
  isLoading: false,
  error: null,
  success: false,
};

export const fetchPromotions = createAsyncThunk<
  PromotionsResponse,
  string,
  { rejectValue: string }
>(
  'promotions/fetchPromotions',
  async (businessId, { rejectWithValue }) => {
    try {
      const response = await promotionService.getPromotions(businessId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener las promociones');
    }
  }
);

export const updatePromotions = createAsyncThunk<
  PromotionsResponse,
  { businessId: string; data: UpdatePromotionsRequest },
  { rejectValue: string }
>(
  'promotions/updatePromotions',
  async ({ businessId, data }, { rejectWithValue }) => {
    try {
      const response = await promotionService.updatePromotions(businessId, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al actualizar las promociones');
    }
  }
);

const promotionSlice = createSlice({
  name: 'promotions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetState: (state) => {
      state.promotions = [];
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromotions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPromotions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.promotions = action.payload.data.promotions;
      })
      .addCase(fetchPromotions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error desconocido';
      })
      .addCase(updatePromotions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePromotions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.success = true;
        state.promotions = action.payload.data.promotions;
      })
      .addCase(updatePromotions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error desconocido';
        state.success = false;
      });
  },
});

export const { clearError, clearSuccess, resetState } = promotionSlice.actions;
export default promotionSlice.reducer;

export const selectPromotions = (state: { promotions: PromotionState }) => state.promotions.promotions;
export const selectIsLoading = (state: { promotions: PromotionState }) => state.promotions.isLoading;
export const selectError = (state: { promotions: PromotionState }) => state.promotions.error;
export const selectSuccess = (state: { promotions: PromotionState }) => state.promotions.success;
