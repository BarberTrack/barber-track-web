import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Reviews } from '../types/reviews.type';
import businessServices from '../services/businessServices';

interface ReviewsState {
    reviews: Reviews | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: ReviewsState = {
    reviews: null,
    isLoading: false,
    error: null,
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
            return response; // response ya ES el objeto Reviews {reviews: [], statistics: {}}
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
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Reviews cases
            .addCase(getReviewsByBusinessId.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getReviewsByBusinessId.fulfilled, (state, action: PayloadAction<Reviews>) => {
                state.isLoading = false;
                state.reviews = action.payload;
            })
            .addCase(getReviewsByBusinessId.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Error al obtener reviews';
            });
    }
}); 

export const { clearReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer;

// Selectors
export const selectReviews = (state: { reviews: ReviewsState }) => state.reviews.reviews;
export const selectReviewsLoading = (state: { reviews: ReviewsState }) => state.reviews.isLoading;
export const selectReviewsError = (state: { reviews: ReviewsState }) => state.reviews.error; 