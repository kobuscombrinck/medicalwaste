import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Async thunks
export const fetchDeliveries = createAsyncThunk(
  'deliveries/fetchDeliveries',
  async ({ page = 1, limit = 10, search = '', status = '', date = null }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/deliveries`, {
        params: { page, limit, search, status, date },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch deliveries');
    }
  }
);

export const createDelivery = createAsyncThunk(
  'deliveries/createDelivery',
  async (deliveryData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/deliveries`, deliveryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create delivery');
    }
  }
);

export const updateDelivery = createAsyncThunk(
  'deliveries/updateDelivery',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/deliveries/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update delivery');
    }
  }
);

export const deleteDelivery = createAsyncThunk(
  'deliveries/deleteDelivery',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/deliveries/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete delivery');
    }
  }
);

export const updateDeliveryStatus = createAsyncThunk(
  'deliveries/updateDeliveryStatus',
  async ({ id, status, notes }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/deliveries/${id}/status`, {
        status,
        notes,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update delivery status');
    }
  }
);

export const assignDriver = createAsyncThunk(
  'deliveries/assignDriver',
  async ({ deliveryId, driverId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/deliveries/${deliveryId}/assign-driver`, {
        driverId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign driver');
    }
  }
);

export const generateManifest = createAsyncThunk(
  'deliveries/generateManifest',
  async (deliveryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/deliveries/${deliveryId}/manifest`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate manifest');
    }
  }
);

const initialState = {
  deliveries: [],
  totalCount: 0,
  currentPage: 1,
  loading: false,
  error: null,
  selectedDelivery: null,
  manifestGenerating: false,
  manifestError: null,
};

const deliverySlice = createSlice({
  name: 'deliveries',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSelectedDelivery: (state, action) => {
      state.selectedDelivery = action.payload;
    },
    clearError: (state) => {
      state.error = null;
      state.manifestError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch deliveries
      .addCase(fetchDeliveries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveries = action.payload.deliveries;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchDeliveries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create delivery
      .addCase(createDelivery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDelivery.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveries.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createDelivery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update delivery
      .addCase(updateDelivery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDelivery.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.deliveries.findIndex(
          (delivery) => delivery.id === action.payload.id
        );
        if (index !== -1) {
          state.deliveries[index] = action.payload;
        }
      })
      .addCase(updateDelivery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete delivery
      .addCase(deleteDelivery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDelivery.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveries = state.deliveries.filter(
          (delivery) => delivery.id !== action.payload
        );
        state.totalCount -= 1;
      })
      .addCase(deleteDelivery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update delivery status
      .addCase(updateDeliveryStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeliveryStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.deliveries.findIndex(
          (delivery) => delivery.id === action.payload.id
        );
        if (index !== -1) {
          state.deliveries[index] = action.payload;
        }
      })
      .addCase(updateDeliveryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Assign driver
      .addCase(assignDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignDriver.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.deliveries.findIndex(
          (delivery) => delivery.id === action.payload.id
        );
        if (index !== -1) {
          state.deliveries[index] = action.payload;
        }
      })
      .addCase(assignDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Generate manifest
      .addCase(generateManifest.pending, (state) => {
        state.manifestGenerating = true;
        state.manifestError = null;
      })
      .addCase(generateManifest.fulfilled, (state) => {
        state.manifestGenerating = false;
      })
      .addCase(generateManifest.rejected, (state, action) => {
        state.manifestGenerating = false;
        state.manifestError = action.payload;
      });
  },
});

export const { setCurrentPage, setSelectedDelivery, clearError } = deliverySlice.actions;

export const selectDeliveries = (state) => state.deliveries.deliveries;
export const selectTotalCount = (state) => state.deliveries.totalCount;
export const selectCurrentPage = (state) => state.deliveries.currentPage;
export const selectLoading = (state) => state.deliveries.loading;
export const selectError = (state) => state.deliveries.error;
export const selectSelectedDelivery = (state) => state.deliveries.selectedDelivery;
export const selectManifestGenerating = (state) => state.deliveries.manifestGenerating;
export const selectManifestError = (state) => state.deliveries.manifestError;

export default deliverySlice.reducer;
