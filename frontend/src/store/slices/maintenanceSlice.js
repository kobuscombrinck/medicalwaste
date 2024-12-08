import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  maintenanceRecords: [],
  totalTasks: 0,
  inProgress: 0,
  completed: 0,
  highPriority: 0,
  selectedTask: null,
  status: 'idle',
  error: null,
};

export const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    setMaintenanceRecords: (state, action) => {
      state.maintenanceRecords = action.payload;
      state.totalTasks = action.payload.length;
      state.inProgress = action.payload.filter(task => task.status === 'In Progress').length;
      state.completed = action.payload.filter(task => task.status === 'Completed').length;
      state.highPriority = action.payload.filter(task => task.priority === 'High').length;
    },
    addMaintenanceTask: (state, action) => {
      state.maintenanceRecords.push(action.payload);
      state.totalTasks++;
      if (action.payload.status === 'In Progress') state.inProgress++;
      if (action.payload.status === 'Completed') state.completed++;
      if (action.payload.priority === 'High') state.highPriority++;
    },
    updateMaintenanceTask: (state, action) => {
      const index = state.maintenanceRecords.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        const oldTask = state.maintenanceRecords[index];
        const newTask = action.payload;

        // Update status counts
        if (oldTask.status !== newTask.status) {
          if (oldTask.status === 'In Progress') state.inProgress--;
          if (oldTask.status === 'Completed') state.completed--;
          if (newTask.status === 'In Progress') state.inProgress++;
          if (newTask.status === 'Completed') state.completed++;
        }

        // Update priority counts
        if (oldTask.priority !== newTask.priority) {
          if (oldTask.priority === 'High') state.highPriority--;
          if (newTask.priority === 'High') state.highPriority++;
        }

        state.maintenanceRecords[index] = newTask;
      }
    },
    deleteMaintenanceTask: (state, action) => {
      const task = state.maintenanceRecords.find(t => t.id === action.payload);
      if (task) {
        if (task.status === 'In Progress') state.inProgress--;
        if (task.status === 'Completed') state.completed--;
        if (task.priority === 'High') state.highPriority--;
        state.maintenanceRecords = state.maintenanceRecords.filter(t => t.id !== action.payload);
        state.totalTasks--;
      }
    },
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.status = 'failed';
    },
  },
});

// Action creators
export const {
  setMaintenanceRecords,
  addMaintenanceTask,
  updateMaintenanceTask,
  deleteMaintenanceTask,
  setSelectedTask,
  setStatus,
  setError,
} = maintenanceSlice.actions;

// Thunks
export const fetchMaintenanceTasks = () => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    // TODO: Implement API call to fetch maintenance tasks
    // const response = await api.getMaintenanceTasks();
    // dispatch(setMaintenanceRecords(response.data));
    dispatch(setStatus('succeeded'));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const createMaintenanceTask = (taskData) => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    // TODO: Implement API call to create maintenance task
    // const response = await api.createMaintenanceTask(taskData);
    // dispatch(addMaintenanceTask(response.data));
    dispatch(setStatus('succeeded'));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const updateMaintenanceTaskDetails = (id, taskData) => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    // TODO: Implement API call to update maintenance task
    // const response = await api.updateMaintenanceTask(id, taskData);
    // dispatch(updateMaintenanceTask(response.data));
    dispatch(setStatus('succeeded'));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const removeMaintenanceTask = (id) => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    // TODO: Implement API call to delete maintenance task
    // await api.deleteMaintenanceTask(id);
    dispatch(deleteMaintenanceTask(id));
    dispatch(setStatus('succeeded'));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// Selectors
export const selectAllMaintenanceTasks = (state) => state.maintenance.maintenanceRecords;
export const selectTotalTasks = (state) => state.maintenance.totalTasks;
export const selectInProgressTasks = (state) => state.maintenance.inProgress;
export const selectCompletedTasks = (state) => state.maintenance.completed;
export const selectHighPriorityTasks = (state) => state.maintenance.highPriority;
export const selectSelectedTask = (state) => state.maintenance.selectedTask;
export const selectMaintenanceStatus = (state) => state.maintenance.status;
export const selectMaintenanceError = (state) => state.maintenance.error;

export default maintenanceSlice.reducer;
