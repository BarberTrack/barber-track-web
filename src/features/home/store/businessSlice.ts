import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Business } from '../types/business.types';
import businessServices from '../services/businessServices';

interface BusinessState {
    businesses: Business[];
    isLoading: boolean;
    error: string | null;
}

const initialState: BusinessState = {
    businesses: [],
    isLoading: false,
    error: null,
};

export const getBusinesses = createAsyncThunk<
    Business[],
    void,
    { rejectValue: string }
>(
    'businesses',
    async (_, { rejectWithValue }) => {
        try {
            const response = await businessServices.getBusinesses();
            return response.data.businesses;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al obtener negocios');
        }
    }
);

export const businessSlice = createSlice({
    name: 'business',
    initialState,
    reducers: {
        clearBusinesses: (state) => {
            state.businesses = [];
            state.error = null;
            state.isLoading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBusinesses.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getBusinesses.fulfilled, (state, action : PayloadAction<Business[]>) => {
                state.isLoading = false;
                state.businesses = action.payload;
            })
            .addCase(getBusinesses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Error al obtener las empresas';                    
            });
    }
});

export const { clearBusinesses } = businessSlice.actions;   
export default businessSlice.reducer;

export const selectBusinesses = (state: { business: BusinessState }) => state.business.businesses;