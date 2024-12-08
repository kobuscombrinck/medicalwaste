import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import store from '../store';

const initialState = {
  staff: [],
  totalStaff: 0,
  activeStaff: 0,
  drivers: 0,
  selectedStaffMember: null,
  driverFines: [],
  status: 'idle',
  error: null,
};

export const getDriverFines = createAsyncThunk(
  'staff/getDriverFines',
  async (driverName) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get fleet state to find fines
    const fleetState = store.getState().fleet;
    const allFines = fleetState.vehicles.reduce((fines, vehicle) => {
      const driverFines = vehicle.trafficFines?.filter(fine => 
        fine.driver.toLowerCase() === driverName.toLowerCase()
      ) || [];
      return [...fines, ...driverFines.map(fine => ({
        ...fine,
        vehicleNumber: vehicle.vehicleNumber
      }))];
    }, []);

    return allFines;
  }
);

export const addStaffMember = createAsyncThunk(
  'staff/addStaffMember',
  async (staffData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: Date.now(),
      ...staffData,
      status: 'Active'
    };
  }
);

export const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setStaff: (state, action) => {
      state.staff = action.payload;
      state.totalStaff = action.payload.length;
      state.activeStaff = action.payload.filter(s => s.status === 'Active').length;
      state.drivers = action.payload.filter(s => s.role === 'Driver').length;
    },
    updateStaffMember: (state, action) => {
      const index = state.staff.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        const oldStaff = state.staff[index];
        const newStaff = action.payload;

        // Update status counts
        if (oldStaff.status !== newStaff.status) {
          if (oldStaff.status === 'Active') state.activeStaff--;
          if (newStaff.status === 'Active') state.activeStaff++;
        }

        // Update role counts
        if (oldStaff.role !== newStaff.role) {
          if (oldStaff.role === 'Driver') state.drivers--;
          if (newStaff.role === 'Driver') state.drivers++;
        }

        state.staff[index] = newStaff;
      }
    },
    deleteStaffMember: (state, action) => {
      const staffMember = state.staff.find(s => s.id === action.payload);
      if (staffMember) {
        if (staffMember.status === 'Active') state.activeStaff--;
        if (staffMember.role === 'Driver') state.drivers--;
        state.staff = state.staff.filter(s => s.id !== action.payload);
        state.totalStaff--;
      }
    },
    setSelectedStaffMember: (state, action) => {
      state.selectedStaffMember = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.status = 'failed';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDriverFines.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getDriverFines.fulfilled, (state, action) => {
        state.status = 'idle';
        state.driverFines = action.payload;
      })
      .addCase(getDriverFines.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addStaffMember.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addStaffMember.fulfilled, (state, action) => {
        state.status = 'idle';
        state.staff.push(action.payload);
        state.totalStaff++;
        if (action.payload.status === 'Active') state.activeStaff++;
        if (action.payload.role === 'Driver') state.drivers++;
      })
      .addCase(addStaffMember.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

// Action creators
export const {
  setStaff,
  updateStaffMember,
  deleteStaffMember,
  setSelectedStaffMember,
  setStatus,
  setError,
} = staffSlice.actions;

// Thunks
export const fetchStaff = () => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    // TODO: Implement API call to fetch staff
    // const response = await api.getStaff();
    // dispatch(setStaff(response.data));
    dispatch(setStatus('succeeded'));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const createStaffMember = (staffData) => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    // TODO: Implement API call to create staff member
    // const response = await api.createStaffMember(staffData);
    // dispatch(addStaffMember(response.data));
    dispatch(setStatus('succeeded'));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const updateStaffMemberDetails = (id, staffData) => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    // TODO: Implement API call to update staff member
    // const response = await api.updateStaffMember(id, staffData);
    // dispatch(updateStaffMember(response.data));
    dispatch(setStatus('succeeded'));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const removeStaffMember = (id) => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    // TODO: Implement API call to delete staff member
    // await api.deleteStaffMember(id);
    dispatch(deleteStaffMember(id));
    dispatch(setStatus('succeeded'));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// Selectors
export const selectAllStaff = (state) => state.staff.staff;
export const selectTotalStaff = (state) => state.staff.totalStaff;
export const selectActiveStaff = (state) => state.staff.activeStaff;
export const selectDrivers = (state) => state.staff.drivers;
export const selectSelectedStaffMember = (state) => state.staff.selectedStaffMember;
export const selectStaffStatus = (state) => state.staff.status;
export const selectStaffError = (state) => state.staff.error;
export const selectDriverFines = (state) => state.staff.driverFines;

export default staffSlice.reducer;
