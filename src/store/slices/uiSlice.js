// UI state management - controls modals and UI interactions
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    // Modal visibility states
    isAuthModalOpen: false,      // Controls login/signup modal
    authModalType: 'signin',     // 'signin' or 'signup'
    isRecipeModalOpen: false,    // Controls recipe detail modal
    isCreateModalOpen: false,    // Controls create/edit recipe modal
    editingRecipe: null,         // Recipe being edited (null if creating new)
    selectedRecipe: null,        // Recipe currently viewed in modal
    notification: null           // Temporary notifications (success/error messages)
  },
  reducers: {
    // Auth modal controls
    openAuthModal: (state, action) => {
      state.isAuthModalOpen = true;
      state.authModalType = action.payload || 'signin'; // Default to signin
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
      state.authModalType = 'signin';
    },
    
    // Recipe detail modal controls
    openRecipeModal: (state, action) => {
      state.isRecipeModalOpen = true;
      state.selectedRecipe = action.payload;
    },
    closeRecipeModal: (state) => {
      state.isRecipeModalOpen = false;
      state.selectedRecipe = null;
    },
    
    // Create/Edit recipe modal controls
    openCreateModal: (state, action) => {
      state.isCreateModalOpen = true;
      state.editingRecipe = action.payload || null; // If payload exists, we're editing
    },
    closeCreateModal: (state) => {
      state.isCreateModalOpen = false;
      state.editingRecipe = null;
    },
    
    // Notification system
    showNotification: (state, action) => {
      state.notification = {
        message: action.payload.message,
        type: action.payload.type || 'info' // 'success', 'error', 'info'
      };
    },
    hideNotification: (state) => {
      state.notification = null;
    }
  }
});

export const {
  openAuthModal,
  closeAuthModal,
  openRecipeModal,
  closeRecipeModal,
  openCreateModal,
  closeCreateModal,
  showNotification,
  hideNotification
} = uiSlice.actions;

export default uiSlice.reducer;