import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';
import businessReducer from '../features/home/store/businessSlice';
import dashboardBusinessReducer from '../features/dashboard/store/businessSlice';
import barbersReducer from '../features/dashboard/store/barbersSlice';
import servicesReducer from '../features/dashboard/store/servicesSlice';
import reviewsReducer from '../features/dashboard/store/reviewsSlice';
import createBusinessReducer from '../features/createBusiness/store/createBusinessSlice';
import appointmentReducer from '../features/appointments/store/appointmentSlice';
import analyticsReducer from '../features/analytics/store/analyticsSlice';
import promotionsReducer from '../features/promotions/store/promotionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    business: businessReducer,
    dashboardBusiness: dashboardBusinessReducer,
    barbers: barbersReducer,
    services: servicesReducer,
    reviews: reviewsReducer,
    createBusiness: createBusinessReducer,
    appointments: appointmentReducer,
    analytics: analyticsReducer,
    promotions: promotionsReducer,
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