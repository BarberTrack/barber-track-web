import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Reviews, ReviewsParams } from '../types/reviews.type';
import businessServices from '../services/businessServices';

interface ReviewsState {
    reviews: Reviews | null;
    isLoading: boolean;
    error: string | null;
    currentPage: number;
    totalReviews: number;
    filters: {
        status: 'approved' | 'rejected' | 'pending' | 'all';
        limit: number;
    };
}

const initialState: ReviewsState = {
    reviews: null,
    isLoading: false,
    error: null,
    currentPage: 1,
    totalReviews: 0,
    filters: {
        status: 'all',
        limit: 10,
    },
}

export const getReviewsByBusinessId = createAsyncThunk<
    Reviews,
    string,
    { rejectValue: string }
>(
    'reviews/getReviewsByBusinessId',
    async (businessId, { rejectWithValue }) => {
        try {
            const response = await businessServices.getReviewsByBusinessId(businessId);
            
            // Validate response structure
            if (!response || typeof response !== 'object') {
                return rejectWithValue('Respuesta inválida del servidor');
            }
            
            // Ensure we have the required fields with defaults
            const validatedResponse: Reviews = {
                reviews: response.reviews || [],
                averageRating: response.averageRating || 0,
                totalReviews: response.totalReviews || 0,
            };
            
            return validatedResponse;
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al obtener reviews');
        }
    });

export const getReviewsWithFilters = createAsyncThunk<
    Reviews,
    ReviewsParams,
    { rejectValue: string }
>(
    'reviews/getReviewsWithFilters',
    async (params, { rejectWithValue }) => {
        try {
            const response = await businessServices.getReviews(params);
            
            // Validate response structure
            if (!response || typeof response !== 'object') {
                return rejectWithValue('Respuesta inválida del servidor');
            }
            
            // Ensure we have the required fields with defaults
            const validatedResponse: Reviews = {
                reviews: response.reviews || [],
                averageRating: response.averageRating || 0,
                totalReviews: response.totalReviews || 0,
            };
            
            return validatedResponse;
        }
        catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error al obtener reviews');
        }
    });

export const reviewsSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        clearReviews: (state) => {
            state.reviews = null;
            state.error = null; 
            state.isLoading = false;
            state.currentPage = 1;
            state.totalReviews = 0;
        },
        setFilters: (state, action: PayloadAction<{ status?: 'approved' | 'rejected' | 'pending' | 'all'; limit?: number }>) => {
            if (action.payload.status !== undefined) {
                state.filters.status = action.payload.status;
            }
            if (action.payload.limit !== undefined) {
                state.filters.limit = action.payload.limit;
            }
            state.currentPage = 1; // Reset to first page when filters change
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Reviews cases (legacy)
            .addCase(getReviewsByBusinessId.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getReviewsByBusinessId.fulfilled, (state, action: PayloadAction<Reviews>) => {
                state.isLoading = false;
                state.reviews = action.payload;
                state.totalReviews = action.payload?.totalReviews || 0;
            })
            .addCase(getReviewsByBusinessId.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Error al obtener reviews';
            })
            // Get Reviews with Filters cases
            .addCase(getReviewsWithFilters.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getReviewsWithFilters.fulfilled, (state, action: PayloadAction<Reviews>) => {
                state.isLoading = false;
                state.reviews = action.payload;
                state.totalReviews = action.payload?.totalReviews || 0;
            })
            .addCase(getReviewsWithFilters.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Error al obtener reviews';
            });
    }
});

export const { clearReviews, setFilters, setCurrentPage } = reviewsSlice.actions;

export default reviewsSlice.reducer;

// Selectors
export const selectReviews = (state: { reviews: ReviewsState }) => state.reviews.reviews;
export const selectReviewsLoading = (state: { reviews: ReviewsState }) => state.reviews.isLoading;
export const selectReviewsError = (state: { reviews: ReviewsState }) => state.reviews.error;
export const selectCurrentPage = (state: { reviews: ReviewsState }) => state.reviews.currentPage;
export const selectTotalReviews = (state: { reviews: ReviewsState }) => state.reviews.totalReviews;
export const selectReviewsFilters = (state: { reviews: ReviewsState }) => state.reviews.filters; 