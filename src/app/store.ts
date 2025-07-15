import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';
import businessReducer from '../features/home/store/businessSlice';
import businessByIdReducer from '../features/dashboard/store/businessSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    business: businessReducer,
    businessById: businessByIdReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 