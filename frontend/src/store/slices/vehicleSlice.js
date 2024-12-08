import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { vehicleAPI } from '../../api/vehicles';

// Async thunks
export const fetchVehicles = createAsyncThunk(
  'vehicles/fetchVehicles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await vehicleAPI.getVehicles();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchVehicle = createAsyncThunk(
  'vehicles/fetchVehicle',
  async (id, { rejectWithValue }) => {
    try {
      const response = await vehicleAPI.getVehicle(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createVehicle = createAsyncThunk(
  'vehicles/createVehicle',
  async (vehicleData, { rejectWithValue }) => {
    try {
      const response = await vehicleAPI.createVehicle(vehicleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateVehicle = createAsyncThunk(
  'vehicles/updateVehicle',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await vehicleAPI.updateVehicle(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteVehicle = createAsyncThunk(
  'vehicles/deleteVehicle',
  async (id, { rejectWithValue }) => {
    try {
      await vehicleAPI.deleteVehicle(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addIncident = createAsyncThunk(
  'vehicles/addIncident',
  async ({ vehicleId, data }, { rejectWithValue }) => {
    try {
      const response = await vehicleAPI.addIncident(vehicleId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadDocument = createAsyncThunk(
  'vehicles/uploadDocument',
  async ({ vehicleId, formData }, { rejectWithValue }) => {
    try {
      const response = await vehicleAPI.uploadDocument(vehicleId, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  vehicles: [],
  selectedVehicle: null,
  loading: false,
  error: null,
  success: false
};

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setSelectedVehicle: (state, action) => {
      state.selectedVehicle = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch vehicles
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch vehicles';
      })

      // Fetch single vehicle
      .addCase(fetchVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVehicle = action.payload;
      })
      .addCase(fetchVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch vehicle';
      })

      // Create vehicle
      .addCase(createVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles.push(action.payload);
        state.success = true;
      })
      .addCase(createVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create vehicle';
      })

      // Update vehicle
      .addCase(updateVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.vehicles.findIndex(v => v._id === action.payload._id);
        if (index !== -1) {
          state.vehicles[index] = action.payload;
        }
        if (state.selectedVehicle?._id === action.payload._id) {
          state.selectedVehicle = action.payload;
        }
        state.success = true;
      })
      .addCase(updateVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update vehicle';
      })

      // Delete vehicle
      .addCase(deleteVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = state.vehicles.filter(v => v._id !== action.payload);
        if (state.selectedVehicle?._id === action.payload) {
          state.selectedVehicle = null;
        }
        state.success = true;
      })
      .addCase(deleteVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete vehicle';
      })

      // Add incident
      .addCase(addIncident.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addIncident.fulfilled, (state, action) => {
        state.loading = false;
        const vehicle = action.payload;
        const index = state.vehicles.findIndex(v => v._id === vehicle._id);
        if (index !== -1) {
          state.vehicles[index] = vehicle;
        }
        if (state.selectedVehicle?._id === vehicle._id) {
          state.selectedVehicle = vehicle;
        }
        state.success = true;
      })
      .addCase(addIncident.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add incident';
      })

      // Upload document
      .addCase(uploadDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.loading = false;
        const vehicle = action.payload;
        const index = state.vehicles.findIndex(v => v._id === vehicle._id);
        if (index !== -1) {
          state.vehicles[index] = vehicle;
        }
        if (state.selectedVehicle?._id === vehicle._id) {
          state.selectedVehicle = vehicle;
        }
        state.success = true;
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to upload document';
      });
  }
});

export const { clearError, clearSuccess, setSelectedVehicle } = vehicleSlice.actions;

export default vehicleSlice.reducer;
