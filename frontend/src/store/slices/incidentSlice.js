import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  incidents: [],
  totalIncidents: 0,
  highSeverity: 0,
  underInvestigation: 0,
  resolved: 0,
  selectedIncident: null,
  status: 'idle',
  error: null,
};

export const incidentSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    setIncidents: (state, action) => {
      state.incidents = action.payload;
      state.totalIncidents = action.payload.length;
      state.highSeverity = action.payload.filter(inc => inc.severity === 'High').length;
      state.underInvestigation = action.payload.filter(inc => inc.status === 'Under Investigation').length;
      state.resolved = action.payload.filter(inc => inc.status === 'Resolved').length;
    },
    addIncident: (state, action) => {
      state.incidents.push(action.payload);
      state.totalIncidents++;
      if (action.payload.severity === 'High') state.highSeverity++;
      if (action.payload.status === 'Under Investigation') state.underInvestigation++;
      if (action.payload.status === 'Resolved') state.resolved++;
    },
    updateIncident: (state, action) => {
      const index = state.incidents.findIndex(inc => inc.id === action.payload.id);
      if (index !== -1) {
        const oldIncident = state.incidents[index];
        const newIncident = action.payload;

        // Update severity counts
        if (oldIncident.severity !== newIncident.severity) {
          if (oldIncident.severity === 'High') state.highSeverity--;
          if (newIncident.severity === 'High') state.highSeverity++;
        }

        // Update status counts
        if (oldIncident.status !== newIncident.status) {
          if (oldIncident.status === 'Under Investigation') state.underInvestigation--;
          if (oldIncident.status === 'Resolved') state.resolved--;
          if (newIncident.status === 'Under Investigation') state.underInvestigation++;
          if (newIncident.status === 'Resolved') state.resolved++;
        }

        state.incidents[index] = newIncident;
      }
    },
    deleteIncident: (state, action) => {
      const incident = state.incidents.find(inc => inc.id === action.payload);
      if (incident) {
        if (incident.severity === 'High') state.highSeverity--;
        if (incident.status === 'Under Investigation') state.underInvestigation--;
        if (incident.status === 'Resolved') state.resolved--;
        state.incidents = state.incidents.filter(inc => inc.id !== action.payload);
        state.totalIncidents--;
      }
    },
    setSelectedIncident: (state, action) => {
      state.selectedIncident = action.payload;
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
  setIncidents,
  addIncident,
  updateIncident,
  deleteIncident,
  setSelectedIncident,
  setStatus,
  setError,
} = incidentSlice.actions;

// Thunks
export const fetchIncidents = () => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    // TODO: Implement API call to fetch incidents
    // const response = await api.getIncidents();
    // dispatch(setIncidents(response.data));
    dispatch(setStatus('succeeded'));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const createIncident = (incidentData) => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    // TODO: Implement API call to create incident
    // const response = await api.createIncident(incidentData);
    // dispatch(addIncident(response.data));
    dispatch(setStatus('succeeded'));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const updateIncidentDetails = (id, incidentData) => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    // TODO: Implement API call to update incident
    // const response = await api.updateIncident(id, incidentData);
    // dispatch(updateIncident(response.data));
    dispatch(setStatus('succeeded'));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const removeIncident = (id) => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    // TODO: Implement API call to delete incident
    // await api.deleteIncident(id);
    dispatch(deleteIncident(id));
    dispatch(setStatus('succeeded'));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// Selectors
export const selectAllIncidents = (state) => state.incidents.incidents;
export const selectTotalIncidents = (state) => state.incidents.totalIncidents;
export const selectHighSeverityIncidents = (state) => state.incidents.highSeverity;
export const selectUnderInvestigationIncidents = (state) => state.incidents.underInvestigation;
export const selectResolvedIncidents = (state) => state.incidents.resolved;
export const selectSelectedIncident = (state) => state.incidents.selectedIncident;
export const selectIncidentStatus = (state) => state.incidents.status;
export const selectIncidentError = (state) => state.incidents.error;

export default incidentSlice.reducer;
