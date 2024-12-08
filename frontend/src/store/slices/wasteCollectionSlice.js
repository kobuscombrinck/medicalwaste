import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock initial waste collection data
const initialState = {
  routes: [
    {
      id: 'R001',
      status: 'Planned',
      date: '2024-02-20',
      estimatedWeight: 5000, // kg
      actualWeight: 4750, // kg
      trucks: [
        {
          id: 'T001',
          plateNumber: 'MW-001',
          type: 'Hazardous Waste',
          estimatedWeight: 2500,
          actualWeight: 2400
        },
        {
          id: 'T002',
          plateNumber: 'MW-002',
          type: 'Biohazard',
          estimatedWeight: 2500,
          actualWeight: 2350
        }
      ],
      containers: [
        {
          id: 'C001',
          type: 'Sharps',
          estimatedWeight: 1500,
          actualWeight: 1400
        },
        {
          id: 'C002',
          type: 'Infectious',
          estimatedWeight: 1500,
          actualWeight: 1450
        }
      ],
      facilities: [
        {
          id: 'F001',
          name: 'Central Hospital Waste Facility',
          estimatedWeight: 2500,
          actualWeight: 2400
        },
        {
          id: 'F002',
          name: 'Research Institute Disposal',
          estimatedWeight: 2500,
          actualWeight: 2350
        }
      ]
    }
  ],
  selectedRoute: null,
  status: 'idle',
  error: null,
  weightViewMode: 'total' // default view mode
};

// Async thunks
export const fetchWasteCollectionRoutes = createAsyncThunk(
  'wasteCollection/fetchRoutes',
  async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(initialState.routes);
      }, 500);
    });
  }
);

export const createWasteCollectionRoute = createAsyncThunk(
  'wasteCollection/createRoute',
  async (routeData) => {
    // Simulate route creation
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRoute = {
          ...routeData,
          id: `R${Math.floor(Math.random() * 1000)}`,
          status: 'Planned'
        };
        resolve(newRoute);
      }, 500);
    });
  }
);

export const updateRouteStatus = createAsyncThunk(
  'wasteCollection/updateRouteStatus',
  async ({ routeId, status }) => {
    // Simulate route status update
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: routeId, status });
      }, 500);
    });
  }
);

const wasteCollectionSlice = createSlice({
  name: 'wasteCollection',
  initialState,
  reducers: {
    setSelectedRoute: (state, action) => {
      state.selectedRoute = action.payload;
    },
    setWeightViewMode: (state, action) => {
      state.weightViewMode = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Routes
      .addCase(fetchWasteCollectionRoutes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWasteCollectionRoutes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.routes = action.payload;
      })
      .addCase(fetchWasteCollectionRoutes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Create Route
      .addCase(createWasteCollectionRoute.fulfilled, (state, action) => {
        state.routes.push(action.payload);
      })
      
      // Update Route Status
      .addCase(updateRouteStatus.fulfilled, (state, action) => {
        const route = state.routes.find(r => r.id === action.payload.id);
        if (route) {
          route.status = action.payload.status;
        }
      });
  }
});

export const { 
  setSelectedRoute, 
  setWeightViewMode 
} = wasteCollectionSlice.actions;

export default wasteCollectionSlice.reducer;
