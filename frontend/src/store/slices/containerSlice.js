import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Async thunks
export const fetchContainers = createAsyncThunk(
  'containers/fetchContainers',
  async ({ page = 1, limit = 10, search = '', status = '' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/containers`, {
        params: { page, limit, search, status },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch containers');
    }
  }
);

export const createContainer = createAsyncThunk(
  'containers/createContainer',
  async (containerData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/containers`, containerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create container');
    }
  }
);

export const updateContainer = createAsyncThunk(
  'containers/updateContainer',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/containers/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update container');
    }
  }
);

export const deleteContainer = createAsyncThunk(
  'containers/deleteContainer',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/containers/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete container');
    }
  }
);

export const assignContainer = createAsyncThunk(
  'containers/assignContainer',
  async ({ containerId, customerId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/containers/${containerId}/assign`, {
        customerId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign container');
    }
  }
);

export const fetchContainerHistory = createAsyncThunk(
  'containers/fetchContainerHistory',
  async (containerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/containers/${containerId}/history`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch container history');
    }
  }
);

const initialState = {
  containers: [],
  totalCount: 0,
  currentPage: 1,
  loading: false,
  error: null,
  selectedContainer: null,
  containerHistory: [],
  historyLoading: false,
  historyError: null,
};

const containerSlice = createSlice({
  name: 'containers',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSelectedContainer: (state, action) => {
      state.selectedContainer = action.payload;
    },
    clearError: (state) => {
      state.error = null;
      state.historyError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch containers
      .addCase(fetchContainers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContainers.fulfilled, (state, action) => {
        state.loading = false;
        state.containers = action.payload.containers;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchContainers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create container
      .addCase(createContainer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContainer.fulfilled, (state, action) => {
        state.loading = false;
        state.containers.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createContainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update container
      .addCase(updateContainer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContainer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.containers.findIndex(
          (container) => container.id === action.payload.id
        );
        if (index !== -1) {
          state.containers[index] = action.payload;
        }
      })
      .addCase(updateContainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete container
      .addCase(deleteContainer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContainer.fulfilled, (state, action) => {
        state.loading = false;
        state.containers = state.containers.filter(
          (container) => container.id !== action.payload
        );
        state.totalCount -= 1;
      })
      .addCase(deleteContainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Assign container
      .addCase(assignContainer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignContainer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.containers.findIndex(
          (container) => container.id === action.payload.id
        );
        if (index !== -1) {
          state.containers[index] = action.payload;
        }
      })
      .addCase(assignContainer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch container history
      .addCase(fetchContainerHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(fetchContainerHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.containerHistory = action.payload;
      })
      .addCase(fetchContainerHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload;
      });
  },
});

export const { setCurrentPage, setSelectedContainer, clearError } = containerSlice.actions;

export const selectContainers = (state) => state.containers.containers;
export const selectTotalCount = (state) => state.containers.totalCount;
export const selectCurrentPage = (state) => state.containers.currentPage;
export const selectLoading = (state) => state.containers.loading;
export const selectError = (state) => state.containers.error;
export const selectSelectedContainer = (state) => state.containers.selectedContainer;
export const selectContainerHistory = (state) => state.containers.containerHistory;
export const selectHistoryLoading = (state) => state.containers.historyLoading;
export const selectHistoryError = (state) => state.containers.historyError;

export default containerSlice.reducer;
