import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import customerReducer from './slices/customerSlice';
import containerReducer from './slices/containerSlice';
import deliveryReducer from './slices/deliverySlice';
import vehicleReducer from './slices/vehicleSlice';
import driverReducer from './slices/driverSlice';
import incidentReducer from './slices/incidentSlice';
import uiReducer from './slices/uiSlice';

const rootReducer = {
  auth: authReducer,
  customer: customerReducer,
  container: containerReducer,
  deliveries: deliveryReducer,
  delivery: deliveryReducer,
  vehicle: vehicleReducer,
  driver: driverReducer,
  incident: incidentReducer,
  ui: uiReducer,
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/fulfilled', 'auth/refreshToken/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.token', 'payload.refreshToken'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.token', 'auth.refreshToken'],
      },
    }),
});

export default store;
