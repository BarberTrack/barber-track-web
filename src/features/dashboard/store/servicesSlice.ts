import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Services, ServiceCreateRequest, ServiceCreateResponse, ServiceDeleteResponseModel, Service, ServiceUpdateRequest, ServiceUpdateResponse } from '../types/services.type';
import businessServices from '../services/businessServices';

interface ServicesState {
    services: Services | null;
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    error: string | null;
}

const initialState: ServicesState = {
    services: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
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

export const updateService = createAsyncThunk<
    ServiceUpdateResponse & { serviceId: string },
    { serviceId: string; serviceData: ServiceUpdateRequest },
    { rejectValue: string }
>(
    'services/updateService',
    async ({ serviceId, serviceData }, { rejectWithValue }) => {
        try {
            const response = await businessServices.updateServiceById(serviceId, serviceData);
            return { ...response, serviceId };
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al actualizar servicio');
        }
    });

export const deleteServiceById = createAsyncThunk<
    ServiceDeleteResponseModel,
    string,
    { rejectValue: string }
>(
    'services/deleteServiceById',
    async (serviceId, { rejectWithValue }) => {
        try {
            const response = await businessServices.deleteServiceById(serviceId);
            return response;
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al eliminar servicio');
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
            state.isUpdating = false;
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
                    // Convert the response service to match the Service type with empty barberAssignments
                    const newService: Service = {
                        ...action.payload.service,
                        price: action.payload.service.price.toString(), // Convert number to string
                        imageUrl: action.payload.service.imageUrl, // Keep imageUrl from response
                        barberAssignments: [], // Add empty array as required by Service type
                        createdAt: action.payload.service.createdAt, // Keep as string
                        updatedAt: action.payload.service.updatedAt // Keep as string
                    };
                    state.services.services.push(newService);
                }
            })
            .addCase(createService.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.payload as string || 'Error al crear servicio';
            })
            // Update Service cases
            .addCase(updateService.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(updateService.fulfilled, (state, action) => {
                state.isUpdating = false;
                // Update the service in the array
                if (state.services && action.payload.service) {
                    const serviceIndex = state.services.services.findIndex(
                        service => service.id === action.payload.serviceId
                    );
                    if (serviceIndex !== -1) {
                        // Convert the response service to match the Service type
                        const updatedService: Service = {
                            ...action.payload.service,
                            price: action.payload.service.price.toString(), // Convert number to string
                            imageUrl: action.payload.service.imageUrl, // Keep imageUrl from response
                            barberAssignments: state.services.services[serviceIndex].barberAssignments, // Keep existing assignments
                            createdAt: action.payload.service.createdAt, // Keep as string
                            updatedAt: action.payload.service.updatedAt // Keep as string
                        };
                        state.services.services[serviceIndex] = updatedService;
                    }
                }
            })
            .addCase(updateService.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload as string || 'Error al actualizar servicio';
            })
            // Delete Service cases
            .addCase(deleteServiceById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteServiceById.fulfilled, (state) => {
                state.isLoading = false;
                // Remove the deleted service from the array if needed
            })
            .addCase(deleteServiceById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string || 'Error al eliminar servicio';
            });
    }
}); 

export const { clearServices } = servicesSlice.actions;
export default servicesSlice.reducer;

// Selectors
export const selectServices = (state: { services: ServicesState }) => state.services.services;
export const selectServicesLoading = (state: { services: ServicesState }) => state.services.isLoading;
export const selectServicesCreating = (state: { services: ServicesState }) => state.services.isCreating;
export const selectServicesUpdating = (state: { services: ServicesState }) => state.services.isUpdating;
export const selectServicesError = (state: { services: ServicesState }) => state.services.error; 