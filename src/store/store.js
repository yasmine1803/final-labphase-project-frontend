// Redux store configuration
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import recipeReducer from './slices/recipeSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,     // Handles user authentication state
    recipes: recipeReducer, // Manages recipes and saved recipes
    ui: uiReducer          // Controls modals and UI state
  }
});