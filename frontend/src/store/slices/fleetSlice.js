import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock initial fleet data
const initialFleetData = [
  {
    id: 1,
    fleetNumber: 'FLT001',
    registrationNumber: 'ABC123GP',
    make: 'Toyota',
    model: 'Hino 300',
    division: 'Medical Waste',
    driver: 'John Doe',
    licenseExpiryDate: '2024-12-31',
    yearAcquired: 2022,
    kmReadingOnDelivery: 0,
    dateAssetDisposed: '',
    status: 'active',
    notes: 'Regular maintenance up to date',
    maintenanceHistory: [],
    trafficFines: [
      {
        id: 'TF001',
        date: '2024-01-15',
        location: 'Main Road, Johannesburg',
        offence: 'Speeding',
        amount: 1500.00,
        status: 'unpaid',
        dueDate: '2024-03-15',
        driver: 'John Doe'
      }
    ]
  }
];

// Async thunks for fleet management
export const fetchFleetVehicles = createAsyncThunk(
  'fleet/fetchVehicles',
  async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(initialFleetData);
      }, 500);
    });
  }
);

export const addVehicle = createAsyncThunk(
  'fleet/addVehicle',
  async (vehicleData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: Date.now(),
      ...vehicleData,
      maintenanceHistory: [],
      trafficFines: []
    };
  }
);

export const updateVehicleStatus = createAsyncThunk(
  'fleet/updateVehicleStatus',
  async ({ vehicleId, status }) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: vehicleId, status });
      }, 500);
    });
  }
);

export const scheduleMaintenance = createAsyncThunk(
  'fleet/scheduleMaintenance',
  async ({ vehicleId, maintenanceDetails }) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMaintenance = {
          ...maintenanceDetails,
          id: `m${Math.floor(Math.random() * 1000)}`,
          date: new Date().toISOString().split('T')[0],
          status: 'Scheduled'
        };
        resolve({ vehicleId, maintenance: newMaintenance });
      }, 500);
    });
  }
);

export const addTrafficFine = createAsyncThunk(
  'fleet/addTrafficFine',
  async ({ vehicleId, fineData }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      vehicleId,
      fine: {
        id: 'TF' + Date.now(),
        ...fineData,
        status: 'unpaid'
      }
    };
  }
);

const initialState = {
  vehicles: [
    {
      id: 1,
      vehicleNumber: 'V001',
      type: 'Truck',
      model: 'Toyota Hino',
      status: 'Active',
      maintenanceHistory: [],
      trafficFines: [
        {
          id: 'TF001',
          date: '2024-01-15',
          location: 'Main Road, Johannesburg',
          offence: 'Speeding',
          amount: 1500.00,
          status: 'unpaid',
          dueDate: '2024-03-15',
          driver: 'John Doe'
        }
      ]
    }
  ],
  selectedVehicle: null,
  status: 'idle',
  error: null
};

const fleetSlice = createSlice({
  name: 'fleet',
  initialState,
  reducers: {
    setSelectedVehicle: (state, action) => {
      state.selectedVehicle = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Vehicles
      .addCase(fetchFleetVehicles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFleetVehicles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vehicles = action.payload;
      })
      .addCase(fetchFleetVehicles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Add Vehicle
      .addCase(addVehicle.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addVehicle.fulfilled, (state, action) => {
        state.status = 'idle';
        state.vehicles.push(action.payload);
      })
      .addCase(addVehicle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Update Vehicle Status
      .addCase(updateVehicleStatus.fulfilled, (state, action) => {
        const vehicle = state.vehicles.find(v => v.id === action.payload.id);
        if (vehicle) {
          vehicle.status = action.payload.status;
        }
      })
      
      // Schedule Maintenance
      .addCase(scheduleMaintenance.fulfilled, (state, action) => {
        const vehicle = state.vehicles.find(v => v.id === action.payload.vehicleId);
        if (vehicle) {
          vehicle.maintenanceHistory.push(action.payload.maintenance);
        }
      })
      
      // Add Traffic Fine
      .addCase(addTrafficFine.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addTrafficFine.fulfilled, (state, action) => {
        state.status = 'idle';
        const vehicle = state.vehicles.find(v => v.id === action.payload.vehicleId);
        if (vehicle) {
          if (!vehicle.trafficFines) vehicle.trafficFines = [];
          vehicle.trafficFines.push(action.payload.fine);
        }
      })
      .addCase(addTrafficFine.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { setSelectedVehicle } = fleetSlice.actions;
export default fleetSlice.reducer;
