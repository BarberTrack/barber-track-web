import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Barber, BarberCreateRequestModel, BarberUpdateRequestModel, BarberDeleteResponseModel } from '../types/barber.type';
import businessServices from '../services/businessServices';

interface BarbersState {
    barbers: Barber[];
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    error: string | null;
}

const initialState: BarbersState = {
    barbers: [],
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    error: null,
}

export const getBarbersByBusinessId = createAsyncThunk<
    Barber[],
    string,
    { rejectValue: string }
>(
    'barbers/getBarbersByBusinessId',
    async (businessId, { rejectWithValue }) => {
        try {
            const response = await businessServices.getBarbersByBusinessId(businessId);
            return response; // response ya ES el array de barberos
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al obtener barberos');
        }
    });

export const createBarber = createAsyncThunk<
    Barber,
    BarberCreateRequestModel,
    { rejectValue: string }
>(
    'barbers/createBarber',
    async (barber, { rejectWithValue }) => {      
        try {
            const response = await businessServices.createBarber(barber);
            return response; // response ya ES el objeto Barber creado
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al crear barbero');
        }
    }); 

export const updateBarber = createAsyncThunk<
    Barber,
    { barberId: string; barberData: BarberUpdateRequestModel },
    { rejectValue: string }
>(
    'barbers/updateBarber',
    async ({ barberId, barberData }, { rejectWithValue }) => {
        try {
            const response = await businessServices.updateBarberById(barberId, barberData);
            return response; // response ya ES el objeto Barber actualizado
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al actualizar barbero');
        }
    });

export const deleteBarberById = createAsyncThunk<
    BarberDeleteResponseModel,
    string,
    { rejectValue: string }
>(
    'barbers/deleteBarberById',
    async (barberId, { rejectWithValue }) => {
        try {
            const response = await businessServices.deleteBarberById(barberId);
            return response;
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al eliminar barbero');
        }
    });     

export const barbersSlice = createSlice({
    name: 'barbers',
    initialState,
    reducers: {
        clearBarbers: (state) => {
            state.barbers = [];
            state.error = null; 
            state.isLoading = false;
            state.isCreating = false;
            state.isUpdating = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Barbers cases
            .addCase(getBarbersByBusinessId.pending, (state) => {       
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getBarbersByBusinessId.fulfilled, (state, action: PayloadAction<Barber[]>) => {
                state.isLoading = false;
                state.barbers = action.payload;
            })  
            .addCase(getBarbersByBusinessId.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Error al obtener barberos';
            })
            // Create Barber cases
            .addCase(createBarber.pending, (state) => {
                state.isCreating = true;
                state.error = null;
            })
            .addCase(createBarber.fulfilled, (state, action: PayloadAction<Barber>) => {
                state.isCreating = false;
                state.barbers.push(action.payload);
            })
            .addCase(createBarber.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.payload as string || 'Error al crear barbero';   
            })
            // Update Barber cases
            .addCase(updateBarber.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(updateBarber.fulfilled, (state, action: PayloadAction<Barber>) => {
                state.isUpdating = false;
                const index = state.barbers.findIndex(barber => barber.id === action.payload.id);
                if (index !== -1) {
                    state.barbers[index] = action.payload;
                }
            })
            .addCase(updateBarber.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload as string || 'Error al actualizar barbero';
            })
            // Delete Barber cases
            .addCase(deleteBarberById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteBarberById.fulfilled, (state) => {
                state.isLoading = false;
                // No necesitamos actualizar el array aquí si se recarga después
            })
            .addCase(deleteBarberById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string || 'Error al eliminar barbero';
            });
    }
}); 

export const { clearBarbers } = barbersSlice.actions;
export default barbersSlice.reducer;

// Selectors
export const selectBarbers = (state: { barbers: BarbersState }) => state.barbers.barbers;
export const selectBarbersLoading = (state: { barbers: BarbersState }) => state.barbers.isLoading;
export const selectBarbersCreating = (state: { barbers: BarbersState }) => state.barbers.isCreating;
export const selectBarbersUpdating = (state: { barbers: BarbersState }) => state.barbers.isUpdating;
export const selectBarbersError = (state: { barbers: BarbersState }) => state.barbers.error; 