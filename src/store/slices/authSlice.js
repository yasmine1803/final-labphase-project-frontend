// Authentication state management
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const MOCK_MODE = false; // Toggle for backend integration

// Mock user database for testing
let mockUsers = [
  { id: '1', username: 'testuser', email: 'test@example.com', password: 'password123' },
  { id: '2', username: 'maria_chef', email: 'maria@example.com', password: 'password123' },
  { id: '3', username: 'thai_cooking', email: 'thai@example.com', password: 'password123' },
  { id: '4', username: 'healthy_eats', email: 'healthy@example.com', password: 'password123' },
  { id: '5', username: 'paris_bistro', email: 'paris@example.com', password: 'password123' },
  { id: '6', username: 'seoul_kitchen', email: 'seoul@example.com', password: 'password123' }
];

// Sign up user
export const signUp = createAsyncThunk('auth/signUp', async (userData, { rejectWithValue }) => {
  try {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // Check for existing email (case insensitive)
      const existingEmail = mockUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
      if (existingEmail) return rejectWithValue('Email already in use');
      
      // Check for existing username (case insensitive)
      const existingUsername = mockUsers.find(u => u.username.toLowerCase() === userData.username.toLowerCase());
      if (existingUsername) return rejectWithValue(`Username "${userData.username}" is already taken`);

      // Create new user
      const newUser = { id: Date.now().toString(), ...userData };
      mockUsers.push(newUser);

      const userResponse = { id: newUser.id, username: newUser.username, email: newUser.email };
      localStorage.setItem('token', 'mock-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(userResponse));

      return { token: localStorage.getItem('token'), user: userResponse };
    }

    const response = await axios.post(`${API_URL}/auth/signup`, userData);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Signup failed');
  }
});

// Sign in user
export const signIn = createAsyncThunk('auth/signIn', async (userData, { rejectWithValue }) => {
  try {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = mockUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
      if (!user) return rejectWithValue('Email not found');
      if (user.password !== userData.password) return rejectWithValue('Incorrect password');

      const userResponse = { id: user.id, username: user.username, email: user.email };
      localStorage.setItem('token', 'mock-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(userResponse));

      return { token: localStorage.getItem('token'), user: userResponse };
    }

    const response = await axios.post(`${API_URL}/auth/signin`, userData);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Signin failed');
  }
});

// Load user from localStorage
export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return rejectWithValue('No token');

    if (MOCK_MODE) {
      const savedUser = localStorage.getItem('user');
      return savedUser ? { user: JSON.parse(savedUser) } : rejectWithValue('No user found');
    }

    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { user: response.data };
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return rejectWithValue('Failed to load user');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signIn.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadUser.pending, (state) => { state.loading = true; })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;