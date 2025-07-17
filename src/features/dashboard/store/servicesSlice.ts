import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Services, ServiceCreateRequest, ServiceCreateResponse } from '../types/services.type';
import businessServices from '../services/businessServices';

interface ServicesState {
    services: Services | null;
    isLoading: boolean;
    isCreating: boolean;
    error: string | null;
}

const initialState: ServicesState = {
    services: null,
    isLoading: false,
    isCreating: false,
    error: null,
}

export const getServicesByBusinessId = createAsyncThunk<
    Services,
    string,
    { rejectValue: string }
>(
    'services/getServicesByBusinessId',
    async (businessId, { rejectWithValue }) => {    
        try {
            const response = await businessServices.getServicesByBusinessId(businessId);
            return response; // response ya ES el objeto Services {services: [], packages: []}
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al obtener servicios');
        }
    });

export const createService = createAsyncThunk<
    ServiceCreateResponse,
    ServiceCreateRequest,
    { rejectValue: string }
>(
    'services/createService',
    async (serviceData, { rejectWithValue }) => {
        try {
            const response = await businessServices.createService(serviceData);
            return response;
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al crear servicio');
        }
    });

export const servicesSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {
        clearServices: (state) => {
            state.services = null;
            state.error = null; 
            state.isLoading = false;
            state.isCreating = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Services cases
            .addCase(getServicesByBusinessId.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getServicesByBusinessId.fulfilled, (state, action: PayloadAction<Services>) => {
                state.isLoading = false;
                state.services = action.payload;
            })
            .addCase(getServicesByBusinessId.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Error al obtener servicios';
            })
            // Create Service cases
            .addCase(createService.pending, (state) => {
                state.isCreating = true;
                state.error = null;
            })
            .addCase(createService.fulfilled, (state, action: PayloadAction<ServiceCreateResponse>) => {
                state.isCreating = false;
                // Agregar el nuevo servicio al array de servicios
                if (state.services && action.payload.service) {
                    state.services.services.push(action.payload.service);
                }
            })
            .addCase(createService.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.payload as string || 'Error al crear servicio';
            });
    }
}); 

export const { clearServices } = servicesSlice.actions;
export default servicesSlice.reducer;

// Selectors
export const selectServices = (state: { services: ServicesState }) => state.services.services;
export const selectServicesLoading = (state: { services: ServicesState }) => state.services.isLoading;
export const selectServicesCreating = (state: { services: ServicesState }) => state.services.isCreating;
export const selectServicesError = (state: { services: ServicesState }) => state.services.error; 