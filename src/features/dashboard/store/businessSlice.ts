import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Business, BusinessesDeleteResponseModel, BusinessUpdateRequestModel } from '../types/business.type';
import businessServices from '../services/businessServices';

interface BusinessState {
    business: Business | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: BusinessState = {
    business: null,
    isLoading: false,
    error: null,
}

export const getBusinessById = createAsyncThunk<
    Business,
    string,
    { rejectValue: string }
>(
    'business/getBusinessById',
    async (businessId, { rejectWithValue }) => {
        try {
            const response = await businessServices.getBusinessesById(businessId);
            return response; // response ahora es directamente el objeto Business
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al obtener negocio');
        }
    });

export const deleteBusinessById = createAsyncThunk<
    BusinessesDeleteResponseModel,
    string,
    { rejectValue: string }
>(
    'business/deleteBusinessById',
    async (businessId, { rejectWithValue }) => {
        try {
            const response = await businessServices.deleteBusinessById(businessId);
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Error al eliminar negocio'
            );
        }
    }
);    

export const updateBusinessById = createAsyncThunk<
    Business,
    { businessId: string, business: BusinessUpdateRequestModel },
    { rejectValue: string }
>(
    'business/updateBusinessById',
    async ({businessId, business}, { rejectWithValue }) => {
        try {
            const response = await businessServices.updateBusinessById(businessId, business);
            return response.data;
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al actualizar negocio');
        }
    });

export const businessSlice = createSlice({
    name: 'business',
    initialState,
    reducers: {
        clearBusiness: (state) => {
            state.business = null;
            state.error = null;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Business cases
            .addCase(getBusinessById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getBusinessById.fulfilled, (state, action: PayloadAction<Business>) => {
                state.isLoading = false;
                state.business = action.payload;
            })
            .addCase(getBusinessById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Error al obtener negocio';
            })
            // Delete Business cases
            .addCase(deleteBusinessById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteBusinessById.fulfilled, (state) => {
                state.isLoading = false;
                state.business = null;
            })
            .addCase(deleteBusinessById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Error al eliminar negocio';
            })
            // Update Business cases
            .addCase(updateBusinessById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateBusinessById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.business = action.payload;
            })
            .addCase(updateBusinessById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Error al actualizar negocio';
            });
    }
}); 

export const { clearBusiness } = businessSlice.actions;
export default businessSlice.reducer;

// Selectors
export const selectBusiness = (state: { dashboardBusiness: BusinessState }) => state.dashboardBusiness.business;
export const selectBusinessLoading = (state: { dashboardBusiness: BusinessState }) => state.dashboardBusiness.isLoading;
export const selectBusinessError = (state: { dashboardBusiness: BusinessState }) => state.dashboardBusiness.error;
