import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'MedicalWaste2024!';

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    const { username, password } = credentials;

    // Simulate API call with mock authentication
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
          const user = {
            id: '1',
            username: username,
            name: 'Admin User',
            role: 'Administrator',
            token: btoa(`${username}:${password}`) // Basic token generation
          };
          
          // Store user in localStorage for persistence
          localStorage.setItem('user', JSON.stringify(user));
          
          resolve(user);
        } else {
          reject(rejectWithValue('Invalid username or password'));
        }
      }, 1000); // Simulate network delay
    });
  }
);

// Async thunk for logout
export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('user');
    return null;
  }
);

// Initial state retrieval
const getUserFromLocalStorage = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Create auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getUserFromLocalStorage(),
    token: getUserFromLocalStorage()?.token || null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
        state.user = null;
        state.token = null;
      })
      // Logout cases
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = 'idle';
        state.error = null;
      });
  }
});

export default authSlice.reducer;
