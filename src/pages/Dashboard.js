// User dashboard with tabbed interface for My Recipes and Saved Recipes
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavbarUser from '../components/NavbarUser';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import CreateRecipeModal from '../components/CreateRecipeModal';
import Footer from '../components/Footer';
import { openCreateModal } from '../store/slices/uiSlice';
import { 
  fetchUserRecipes, 
  fetchSavedRecipes, 
  deleteRecipe, 
  toggleSaveRecipe 
} from '../store/slices/recipeSlice';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { userRecipes, savedRecipes } = useSelector(state => state.recipes);
  const { user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('myRecipes'); // 'myRecipes' or 'savedRecipes'

  // Load user's recipes on mount and when tab changes
  useEffect(() => {
    dispatch(fetchUserRecipes());
    dispatch(fetchSavedRecipes());
  }, [dispatch]);

  // Debug: Log recipes to console to verify they're loading
  useEffect(() => {
    console.log('User Recipes:', userRecipes);
    console.log('Saved Recipes:', savedRecipes);
  }, [userRecipes, savedRecipes]);

  // Edit recipe handler
  const handleEdit = (recipe, e) => {
    e.stopPropagation();
    dispatch(openCreateModal(recipe));
  };

  // Delete recipe handler
  const handleDelete = (recipeId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      dispatch(deleteRecipe(recipeId))
        .then(() => {
          // Refresh both lists after deletion
          dispatch(fetchUserRecipes());
          dispatch(fetchSavedRecipes());
        });
    }
  };

  // Unsave recipe handler - uses the same toggleSaveRecipe action
  const handleUnsave = (recipeId, e) => {
    e.stopPropagation();
    dispatch(toggleSaveRecipe(recipeId))
      .then(() => {
        // Refresh saved recipes after unsaving
        dispatch(fetchSavedRecipes());
      });
  };

  return (
    <>
      <NavbarUser />
      
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Hello, {user?.username}</h1>
        </div>

        {/* Tab Navigation */}
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'myRecipes' ? 'active' : ''}`}
            onClick={() => setActiveTab('myRecipes')}
          >
            My Recipes <span className="tab-count">{userRecipes?.length || 0}</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'savedRecipes' ? 'active' : ''}`}
            onClick={() => setActiveTab('savedRecipes')}
          >
            Saved Recipes <span className="tab-count">{savedRecipes?.length || 0}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* My Recipes Tab */}
          {activeTab === 'myRecipes' && (
            <div className="tab-pane">
              <div className="tab-header">
                <button className="create-btn" onClick={() => dispatch(openCreateModal())}>
                  <FaPlus /> Create Recipe
                </button>
              </div>

              {!userRecipes || userRecipes.length === 0 ? (
                <div className="empty-state">
                  <p>You haven't created any recipes yet.</p>
                  <p className="empty-state-sub">Click "Create Recipe" to share your first recipe!</p>
                </div>
              ) : (
                <div className="recipe-grid">
                  {userRecipes.map(recipe => (
                    <div key={recipe._id} className="recipe-card-wrapper">
                      <RecipeCard recipe={recipe} />
                      <div className="recipe-actions">
                        <button 
                          className="action-btn edit-btn" 
                          onClick={(e) => handleEdit(recipe, e)}
                          title="Edit recipe"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="action-btn delete-btn" 
                          onClick={(e) => handleDelete(recipe._id, e)}
                          title="Delete recipe"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Saved Recipes Tab */}
          {activeTab === 'savedRecipes' && (
            <div className="tab-pane">
              {!savedRecipes || savedRecipes.length === 0 ? (
                <div className="empty-state">
                  <p>You haven't saved any recipes yet.</p>
                  <p className="empty-state-sub">Browse recipes and click the heart icon to save favorites!</p>
                </div>
              ) : (
                <div className="recipe-grid">
                  {savedRecipes.map(recipe => (
                    <div key={recipe._id} className="recipe-card-wrapper">
                      <RecipeCard 
                        recipe={recipe} 
                        showUnsaveButton={true}
                        onUnsave={handleUnsave}
                      />
                      {/* Remove the separate unsave button - let the heart icon handle it */}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <RecipeModal />
      <CreateRecipeModal />
      <Footer />
    </>
  );
};

export default Dashboard;