import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    name: '',
    email: '',
    role: '',
    avatar: null,
  },
  preferences: {
    language: 'English',
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      incidents: true,
      maintenance: true,
      system: false,
    },
  },
  status: 'idle',
  error: null,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    updateLanguage: (state, action) => {
      state.preferences.language = action.payload;
    },
    updateTheme: (state, action) => {
      state.preferences.theme = action.payload;
    },
    updateNotificationSettings: (state, action) => {
      state.preferences.notifications = {
        ...state.preferences.notifications,
        ...action.payload,
      };
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
  updateUserProfile,
  updateLanguage,
  updateTheme,
  updateNotificationSettings,
  setStatus,
  setError,
} = settingsSlice.actions;

// Thunks
export const saveSettings = (settings) => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    // TODO: Implement API call to save settings
    // const response = await api.saveSettings(settings);
    dispatch(updateUserProfile(settings.user));
    dispatch(updateLanguage(settings.preferences.language));
    dispatch(updateTheme(settings.preferences.theme));
    dispatch(updateNotificationSettings(settings.preferences.notifications));
    dispatch(setStatus('succeeded'));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// Selectors
export const selectUserProfile = (state) => state.settings.user;
export const selectPreferences = (state) => state.settings.preferences;
export const selectSettingsStatus = (state) => state.settings.status;
export const selectSettingsError = (state) => state.settings.error;

export default settingsSlice.reducer;
