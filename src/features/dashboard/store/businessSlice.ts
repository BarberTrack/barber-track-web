import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Business } from '../types/business.type';
import businessServices from '../services/businessServices';
import type { Barber } from '../types/barber.type';
import type { Services } from '../types/services.type';
import type { Reviews } from '../types/reviews.type';
import type { BusinessesDeleteResponseModel } from '../types/business.type';
import type { BusinessUpdateRequestModel } from '../types/business.type';

interface BusinessState {
    business: Business | null;
    barbers: Barber[] | null;
    services: Services | null;
    reviews: Reviews | null;
    isLoadingBusiness: boolean;
    isLoadingBarbers: boolean;
    isLoadingServices: boolean;
    isLoadingReviews: boolean;
    error: string | null;
}

const initialState: BusinessState = {
    business: null,
    barbers: [],
    services: null,
    reviews: null,
    isLoadingBusiness: false,
    isLoadingBarbers: false,
    isLoadingServices: false,
    isLoadingReviews: false,
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
            return response.data;
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al obtener negocio');
        }
    });

export const getBarbersByBusinessId = createAsyncThunk<
    Barber[],
    string,
    { rejectValue: string }
>(
    'business/getBarbersByBusinessId',
    async (businessId, { rejectWithValue }) => {
        try {
            const response = await businessServices.getBarbersByBusinessId(businessId);
            return response.data;
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al obtener barberos');
        }
    });

export const getServicesByBusinessId = createAsyncThunk<
    Services,
    string,
    { rejectValue: string }
>(
    'business/getServicesByBusinessId',
    async (businessId, { rejectWithValue }) => {    
        try {
            const response = await businessServices.getServicesByBusinessId(businessId);
            return response.data;
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al obtener servicios');
        }
    });

    export const deleteBusinessById = createAsyncThunk<
    BusinessesDeleteResponseModel, // tipo de éxito
    string, // el parámetro que recibes (businessId)
    { rejectValue: string } // tipo de error
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
            const response = await businessServices.updateBusinessById(businessId,business);
            return response.data;
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al actualizar negocio');
        }
        });


export const getReviewsByBusinessId = createAsyncThunk<
    Reviews,
    string,
    { rejectValue: string }
>(
    'business/getReviewsByBusinessId',
    async (businessId, { rejectWithValue }) => {
        try {
            const response = await businessServices.getReviewsByBusinessId(businessId);
            return response.data;
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al obtener reviews');
        }
    });
    export const businessByIdSlice = createSlice({
    name: 'businessById',
    initialState,
    reducers: {
        clearBusiness: (state) => {
            state.business = null;
            state.error = null;
            state.isLoadingBusiness = false;
        },
        clearBarbers: (state) => {
            state.barbers = [];
            state.error = null; 
            state.isLoadingBarbers = false;
        },
        clearServices: (state) => {
            state.services = null;
            state.error = null; 
            state.isLoadingServices = false;
        },
        clearReviews: (state) => {
            state.reviews = null;
            state.error = null; 
            state.isLoadingReviews = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Business cases
            .addCase(getBusinessById.pending, (state) => {
                state.isLoadingBusiness = true;
            })
            .addCase(getBusinessById.fulfilled, (state, action: PayloadAction<Business>) => {
                state.isLoadingBusiness = false;
                state.business = action.payload;
            })
            .addCase(getBusinessById.rejected, (state, action) => {
                state.isLoadingBusiness = false;
                state.error = action.payload || 'Error al obtener negocio';
            })
            // Barbers cases
            .addCase(getBarbersByBusinessId.pending, (state) => {       
                state.isLoadingBarbers = true;
            })
            .addCase(getBarbersByBusinessId.fulfilled, (state, action: PayloadAction<Barber[]>) => {
                state.isLoadingBarbers = false;
                state.barbers = action.payload;
            })  
            .addCase(getBarbersByBusinessId.rejected, (state, action) => {
                state.isLoadingBarbers = false;
                state.error = action.payload || 'Error al obtener barberos';
            })
            // Services cases
            .addCase(getServicesByBusinessId.pending, (state) => {
                state.isLoadingServices = true;
            })
            .addCase(getServicesByBusinessId.fulfilled, (state, action: PayloadAction<Services>) => {
                state.isLoadingServices = false;
                state.services = action.payload;
            })
            .addCase(getServicesByBusinessId.rejected, (state, action) => {
                state.isLoadingServices = false;
                state.error = action.payload || 'Error al obtener servicios';
            })
            // Reviews cases
            .addCase(getReviewsByBusinessId.pending, (state) => {
                state.isLoadingReviews = true;
            })
            .addCase(getReviewsByBusinessId.fulfilled, (state, action: PayloadAction<Reviews>) => {
                state.isLoadingReviews = false;
                state.reviews = action.payload;
            })
            .addCase(getReviewsByBusinessId.rejected, (state, action) => {
                state.isLoadingReviews = false;
                state.error = action.payload || 'Error al obtener reviews';
            })
            // Delete Business cases
            .addCase(deleteBusinessById.pending, (state) => {
                state.isLoadingBusiness = true;
            })
            .addCase(deleteBusinessById.fulfilled, (state, action) => {
                state.isLoadingBusiness = false;
                state.business = null;
            })
            .addCase(deleteBusinessById.rejected, (state, action) => {
                state.isLoadingBusiness = false;
                state.error = action.payload || 'Error al eliminar negocio';
            })
            // Update Business cases
            .addCase(updateBusinessById.pending, (state) => {
                state.isLoadingBusiness = true;
            })
            .addCase(updateBusinessById.fulfilled, (state, action) => {
                state.isLoadingBusiness = false;
                state.business = action.payload;
            })
            .addCase(updateBusinessById.rejected, (state, action) => {
                state.isLoadingBusiness = false;
                state.error = action.payload || 'Error al actualizar negocio';
            });
        }
}); 

export const { clearBusiness, clearBarbers, clearServices, clearReviews } = businessByIdSlice.actions;
export default businessByIdSlice.reducer;

export const selectBusinessById = (state: { businessById: BusinessState }) => state.businessById.business;  
export const selectBarbersByBusinessId = (state: { businessById: BusinessState }) => state.businessById.barbers;
export const selectServicesByBusinessId = (state: { businessById: BusinessState }) => state.businessById.services;
export const selectReviewsByBusinessId = (state: { businessById: BusinessState }) => state.businessById.reviews;
