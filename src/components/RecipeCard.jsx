// Recipe card component with save functionality
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openRecipeModal } from '../store/slices/uiSlice';
import { toggleSaveRecipe } from '../store/slices/recipeSlice';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const RecipeCard = ({ recipe, showUnsaveButton = false, onUnsave }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { savedRecipes } = useSelector(state => state.recipes);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [promptPosition, setPromptPosition] = useState({ top: 0, left: 0 });

  // Check if this recipe is in user's saved list
  const isSaved = savedRecipes?.some(r => r?._id === recipe?._id) || false;

  // Handle save/unsave click
  const handleSave = (e) => {
    e.stopPropagation(); // Prevent card click
    
    if (!isAuthenticated) {
      // Get button position for login prompt
      const rect = e.currentTarget.getBoundingClientRect();
      setPromptPosition({
        top: rect.top - 10,
        left: rect.left + (rect.width / 2)
      });
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000);
      return;
    }
    
    // If we're in saved recipes tab and onUnsave is provided, use it
    if (showUnsaveButton && onUnsave) {
      onUnsave(recipe._id, e);
    } else {
      // Otherwise use the regular toggle
      dispatch(toggleSaveRecipe(recipe._id));
    }
  };

  // Handle card click to open recipe details
  const handleCardClick = () => {
    dispatch(openRecipeModal(recipe));
  };

  return (
    <>
      <div className="recipe-card" onClick={handleCardClick}>
        <img 
          src={recipe.imageUrl || 'https://via.placeholder.com/300x200?text=Recipe'} 
          alt={recipe.dishName} 
          className="recipe-image"
        />
        <div className="recipe-info">
          <h3>{recipe.dishName}</h3>
          <div className="recipe-meta">
            <span>{recipe.countryOfOrigin}</span>
            <span>By {recipe.creatorName}</span>
            <span>{recipe.duration}</span>
          </div>
          <div className="recipe-footer">
            <button 
              className={`save-btn ${isSaved ? 'saved' : ''}`}
              onClick={handleSave}
              aria-label={isSaved ? 'Remove from saved' : 'Save recipe'}
            >
              {isSaved ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Global login prompt - appears above the button */}
      {showLoginPrompt && (
        <div 
          className="global-login-prompt"
          style={{
            position: 'fixed',
            top: promptPosition.top,
            left: promptPosition.left,
            transform: 'translate(-50%, -100%)',
            zIndex: 9999
          }}
        >
          Sign in to save recipes
          <div className="prompt-arrow"></div>
        </div>
      )}
    </>
  );
};

export default RecipeCard;