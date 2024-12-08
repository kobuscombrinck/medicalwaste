import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import fleetReducer from './slices/fleetSlice.js';
import staffReducer from './slices/staffSlice';
import wasteCollectionReducer from './slices/wasteCollectionSlice';
import maintenanceReducer from './slices/maintenanceSlice';
import incidentReducer from './slices/incidentSlice';
import settingsReducer from './slices/settingsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    fleet: fleetReducer,
    staff: staffReducer,
    wasteCollection: wasteCollectionReducer,
    maintenance: maintenanceReducer,
    incidents: incidentReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/fulfilled', 'fleet/scheduleMaintenance/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user'],
      },
    }),
});

export default store;
