// Recipe state management
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://backend-04t0.onrender.com/api';
const MOCK_MODE = false; // Toggle for backend integration

// Mock recipe data
let mockRecipes = [
  {
    _id: '1', 
    dishName: 'Spaghetti Carbonara', 
    countryOfOrigin: 'Italy', 
    duration: '25 minutes',
    ingredients: '200g spaghetti\n2 eggs\n100g pancetta\nParmesan cheese\nBlack pepper', 
    creator: '2', 
    creatorName: 'maria_chef',
    instructions: '1. Cook pasta in salted water\n2. Fry pancetta until crispy\n3. Mix eggs and cheese\n4. Combine with hot pasta',
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e4?w=300'
  },
  {
    _id: '2', 
    dishName: 'Pad Thai', 
    countryOfOrigin: 'Thailand', 
    duration: '30 minutes',
    ingredients: 'Rice noodles\nShrimp\nTofu\nBean sprouts\nPeanuts\nLime\nPad Thai sauce', 
    creator: '3', 
    creatorName: 'thai_cooking',
    instructions: '1. Soak noodles\n2. Stir fry tofu and shrimp\n3. Add noodles and sauce\n4. Garnish with peanuts',
    imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=300'
  },
  {
    _id: '3', 
    dishName: 'French Omelette', 
    countryOfOrigin: 'France', 
    duration: '10 minutes',
    ingredients: '3 eggs\nButter\nSalt\nPepper\nFresh herbs', 
    creator: '5', 
    creatorName: 'paris_bistro',
    instructions: '1. Whisk eggs vigorously\n2. Melt butter in pan\n3. Cook on medium heat\n4. Fold and serve',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300'
  },
  {
    _id: '4',
    dishName: 'Veggie Buddha Bowl',
    countryOfOrigin: 'Fusion',
    duration: '20 minutes',
    ingredients: 'Quinoa\nRoasted chickpeas\nAvocado\nKale\nSweet potato\nTahini dressing',
    creator: '4',
    creatorName: 'healthy_eats',
    instructions: '1. Cook quinoa\n2. Roast chickpeas and sweet potato\n3. Massage kale\n4. Assemble bowl\n5. Drizzle with tahini',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300'
  },
  {
    _id: '5',
    dishName: 'Korean Bibimbap',
    countryOfOrigin: 'Korea',
    duration: '40 minutes',
    ingredients: 'Rice\nBeef\nZucchini\nCarrots\nSpinach\nBean sprouts\nEgg\nGochujang',
    creator: '6',
    creatorName: 'seoul_kitchen',
    instructions: '1. Cook rice\n2. Prepare vegetables\n3. Cook beef\n4. Fry egg\n5. Arrange in bowl with gochujang',
    imageUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=300'
  }
];

// Load saved recipes from localStorage
let mockSavedRecipes = [];
try {
  const saved = localStorage.getItem('savedRecipes');
  if (saved) mockSavedRecipes = JSON.parse(saved);
} catch (e) {
  console.error('Failed to load saved recipes');
}

// Fetch all recipes with optional search
export const fetchRecipes = createAsyncThunk('recipes/fetchRecipes', 
  async (search = '', { rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (!search) return [...mockRecipes];
        return mockRecipes.filter(r => 
          r.dishName.toLowerCase().includes(search.toLowerCase()) ||
          r.countryOfOrigin.toLowerCase().includes(search.toLowerCase()) ||
          r.creatorName.toLowerCase().includes(search.toLowerCase())
        );
      }
      const response = await axios.get(`${API_URL}/recipes?search=${search}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recipes');
    }
});

// Fetch user's published recipes
export const fetchUserRecipes = createAsyncThunk('recipes/fetchUserRecipes', 
  async (_, { getState, rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const { user } = getState().auth;
        const userRecipes = mockRecipes.filter(r => r.creator === user?.id);
        console.log('Fetched user recipes:', userRecipes);
        return userRecipes;
      }
      const token = getState().auth.token;
      const response = await axios.get(`${API_URL}/recipes/user/published`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user recipes');
    }
});

// Fetch saved recipes
export const fetchSavedRecipes = createAsyncThunk('recipes/fetchSavedRecipes', 
  async (_, { getState, rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('Fetched saved recipes:', mockSavedRecipes);
        return [...mockSavedRecipes];
      }
      const token = getState().auth.token;
      const response = await axios.get(`${API_URL}/recipes/user/saved`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch saved recipes');
    }
});

// Create new recipe - FIXED version
export const createRecipe = createAsyncThunk('recipes/createRecipe', 
  async (data, { getState, rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const { user } = getState().auth;
        if (!user) return rejectWithValue('Must be logged in');
        
        const newRecipe = {
          _id: Date.now().toString(),
          ...data,
          creator: user.id,
          creatorName: user.username,
          createdAt: new Date().toISOString()
        };
        
        // Add to mockRecipes
        mockRecipes = [newRecipe, ...mockRecipes];
        
        console.log('Recipe created:', newRecipe);
        console.log('All recipes now:', mockRecipes);
        
        return newRecipe;
      }
      const token = getState().auth.token;
      const response = await axios.post(`${API_URL}/recipes`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create recipe');
    }
});

// Update recipe
export const updateRecipe = createAsyncThunk('recipes/updateRecipe', 
  async ({ id, recipeData }, { getState, rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = mockRecipes.findIndex(r => r._id === id);
        if (index === -1) return rejectWithValue('Recipe not found');
        
        mockRecipes[index] = { ...mockRecipes[index], ...recipeData };
        
        // Update in saved recipes if present
        const savedIndex = mockSavedRecipes.findIndex(r => r._id === id);
        if (savedIndex !== -1) {
          mockSavedRecipes[savedIndex] = { ...mockSavedRecipes[savedIndex], ...recipeData };
          localStorage.setItem('savedRecipes', JSON.stringify(mockSavedRecipes));
        }
        return mockRecipes[index];
      }
      const token = getState().auth.token;
      const response = await axios.put(`${API_URL}/recipes/${id}`, recipeData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update recipe');
    }
});

// Delete recipe
export const deleteRecipe = createAsyncThunk('recipes/deleteRecipe', 
  async (id, { getState, rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500));
        mockRecipes = mockRecipes.filter(r => r._id !== id);
        mockSavedRecipes = mockSavedRecipes.filter(r => r._id !== id);
        localStorage.setItem('savedRecipes', JSON.stringify(mockSavedRecipes));
        console.log('Recipe deleted:', id);
        return id;
      }
      const token = getState().auth.token;
      await axios.delete(`${API_URL}/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete recipe');
    }
});

// Toggle save/unsave recipe - FIXED version
export const toggleSaveRecipe = createAsyncThunk('recipes/toggleSaveRecipe', 
  async (id, { getState, rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const recipe = mockRecipes.find(r => r._id === id);
        if (!recipe) return rejectWithValue('Recipe not found');

        const isSaved = mockSavedRecipes.some(r => r._id === id);
        
        if (isSaved) {
          // Remove from saved
          mockSavedRecipes = mockSavedRecipes.filter(r => r._id !== id);
          console.log('Recipe unsaved:', id);
        } else {
          // Add to saved
          mockSavedRecipes = [...mockSavedRecipes, recipe];
          console.log('Recipe saved:', id);
        }
        
        // Save to localStorage
        localStorage.setItem('savedRecipes', JSON.stringify(mockSavedRecipes));
        
        return { 
          recipeId: id, 
          savedRecipes: [...mockSavedRecipes],
          isSaved: !isSaved 
        };
      }
      const token = getState().auth.token;
      const response = await axios.post(`${API_URL}/recipes/${id}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { recipeId: id, savedRecipes: response.data.savedRecipes };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save recipe');
    }
});

const recipeSlice = createSlice({
  name: 'recipes',
  initialState: {
    recipes: [],           // All recipes from all users
    userRecipes: [],       // Recipes created by current user
    savedRecipes: [],      // Recipes saved by current user
    selectedRecipe: null,  // Currently viewed recipe
    loading: false,
    error: null
  },
  reducers: {
    setSelectedRecipe: (state, action) => { state.selectedRecipe = action.payload; },
    clearSelectedRecipe: (state) => { state.selectedRecipe = null; },
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all recipes
      .addCase(fetchRecipes.pending, (state) => { state.loading = true; })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch user recipes
      .addCase(fetchUserRecipes.pending, (state) => { state.loading = true; })
      .addCase(fetchUserRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.userRecipes = action.payload;
      })
      .addCase(fetchUserRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch saved recipes
      .addCase(fetchSavedRecipes.pending, (state) => { state.loading = true; })
      .addCase(fetchSavedRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.savedRecipes = action.payload;
      })
      .addCase(fetchSavedRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create recipe
      .addCase(createRecipe.pending, (state) => { state.loading = true; })
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.userRecipes = [action.payload, ...state.userRecipes];
        state.recipes = [action.payload, ...state.recipes];
        console.log('Added recipe to state:', action.payload);
      })
      .addCase(createRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update recipe
      .addCase(updateRecipe.pending, (state) => { state.loading = true; })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update in userRecipes
        const userIndex = state.userRecipes.findIndex(r => r._id === action.payload._id);
        if (userIndex !== -1) state.userRecipes[userIndex] = action.payload;
        
        // Update in all recipes
        const allIndex = state.recipes.findIndex(r => r._id === action.payload._id);
        if (allIndex !== -1) state.recipes[allIndex] = action.payload;
        
        // Update in saved recipes if present
        const savedIndex = state.savedRecipes.findIndex(r => r._id === action.payload._id);
        if (savedIndex !== -1) state.savedRecipes[savedIndex] = action.payload;
      })
      .addCase(updateRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete recipe
      .addCase(deleteRecipe.pending, (state) => { state.loading = true; })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.userRecipes = state.userRecipes.filter(r => r._id !== action.payload);
        state.recipes = state.recipes.filter(r => r._id !== action.payload);
        state.savedRecipes = state.savedRecipes.filter(r => r._id !== action.payload);
      })
      .addCase(deleteRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Toggle save recipe
      .addCase(toggleSaveRecipe.pending, (state) => { state.loading = true; })
      .addCase(toggleSaveRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.savedRecipes = action.payload.savedRecipes;
        console.log('Updated saved recipes:', action.payload.savedRecipes);
      })
      .addCase(toggleSaveRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSelectedRecipe, clearSelectedRecipe, clearError } = recipeSlice.actions;
export default recipeSlice.reducer;