// Modal for displaying full recipe details
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeRecipeModal } from '../store/slices/uiSlice';
import { FaTimes } from 'react-icons/fa';

const RecipeModal = () => {
  const dispatch = useDispatch();
  const { selectedRecipe } = useSelector(state => state.ui);

  if (!selectedRecipe) return null;

  return (
    <div className="modal-overlay" onClick={() => dispatch(closeRecipeModal())}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{selectedRecipe.dishName}</h2>
          <button className="close-btn" onClick={() => dispatch(closeRecipeModal())}>
            <FaTimes />
          </button>
        </div>

        <div className="recipe-details">
          <img 
            src={selectedRecipe.imageUrl} 
            alt={selectedRecipe.dishName}
            style={{ width: '100%', borderRadius: '12px', marginBottom: '1.5rem' }}
          />

          <div className="recipe-meta" style={{ marginBottom: '1.5rem' }}>
            <span>{selectedRecipe.countryOfOrigin}</span>
            <span>By {selectedRecipe.creatorName}</span>
            <span>{selectedRecipe.duration}</span>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Ingredients</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{selectedRecipe.ingredients}</p>
          </div>

          <div>
            <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Instructions</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{selectedRecipe.instructions}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;