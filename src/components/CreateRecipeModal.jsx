// Modal for creating and editing recipes
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeCreateModal } from '../store/slices/uiSlice';
import { createRecipe, updateRecipe } from '../store/slices/recipeSlice';
import { FaTimes } from 'react-icons/fa';

const CreateRecipeModal = () => {
  const dispatch = useDispatch();
  const { isCreateModalOpen, editingRecipe } = useSelector(state => state.ui);
  const { loading } = useSelector(state => state.recipes);

  const [formData, setFormData] = useState({
    dishName: '', countryOfOrigin: '', duration: '',
    ingredients: '', instructions: '', imageUrl: ''
  });
  const [errors, setErrors] = useState({});

  // Populate form if editing existing recipe
  useEffect(() => {
    if (editingRecipe) {
      setFormData({
        dishName: editingRecipe.dishName || '',
        countryOfOrigin: editingRecipe.countryOfOrigin || '',
        duration: editingRecipe.duration || '',
        ingredients: editingRecipe.ingredients || '',
        instructions: editingRecipe.instructions || '',
        imageUrl: editingRecipe.imageUrl || ''
      });
    } else {
      setFormData({ dishName: '', countryOfOrigin: '', duration: '', ingredients: '', instructions: '', imageUrl: '' });
    }
    setErrors({});
  }, [editingRecipe]);

  const handleClose = () => dispatch(closeCreateModal());

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  // Validate required fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.dishName.trim()) newErrors.dishName = 'Dish name is required';
    if (!formData.countryOfOrigin.trim()) newErrors.countryOfOrigin = 'Country of origin is required';
    if (!formData.duration.trim()) newErrors.duration = 'Cooking time is required';
    if (!formData.ingredients.trim()) newErrors.ingredients = 'Ingredients are required';
    if (!formData.instructions.trim()) newErrors.instructions = 'Instructions are required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingRecipe) {
        await dispatch(updateRecipe({ id: editingRecipe._id, recipeData: formData })).unwrap();
      } else {
        await dispatch(createRecipe(formData)).unwrap();
      }
      handleClose();
    } catch (error) {
      console.error('Failed to save recipe:', error);
    }
  };

  if (!isCreateModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingRecipe ? 'Edit Recipe' : 'Create New Recipe'}</h2>
          <button className="close-btn" onClick={handleClose}><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Dish Name *</label>
            <input name="dishName" value={formData.dishName} onChange={handleChange} 
                   className={errors.dishName ? 'error' : ''} placeholder="e.g., Spaghetti Carbonara" />
            {errors.dishName && <span className="error-message">{errors.dishName}</span>}
          </div>

          <div className="form-group">
            <label>Country of Origin *</label>
            <input name="countryOfOrigin" value={formData.countryOfOrigin} onChange={handleChange}
                   className={errors.countryOfOrigin ? 'error' : ''} placeholder="e.g., Italy" />
            {errors.countryOfOrigin && <span className="error-message">{errors.countryOfOrigin}</span>}
          </div>

          <div className="form-group">
            <label>Cooking Time *</label>
            <input name="duration" value={formData.duration} onChange={handleChange}
                   className={errors.duration ? 'error' : ''} placeholder="e.g., 30 minutes" />
            {errors.duration && <span className="error-message">{errors.duration}</span>}
          </div>

          <div className="form-group">
            <label>Ingredients *</label>
            <textarea name="ingredients" value={formData.ingredients} onChange={handleChange}
                      className={errors.ingredients ? 'error' : ''} 
                      placeholder="List each ingredient on a new line" rows="5" />
            {errors.ingredients && <span className="error-message">{errors.ingredients}</span>}
          </div>

          <div className="form-group">
            <label>Instructions *</label>
            <textarea name="instructions" value={formData.instructions} onChange={handleChange}
                      className={errors.instructions ? 'error' : ''}
                      placeholder="Step by step instructions" rows="5" />
            {errors.instructions && <span className="error-message">{errors.instructions}</span>}
          </div>

          <div className="form-group">
            <label>Image URL (optional)</label>
            <input name="imageUrl" value={formData.imageUrl} onChange={handleChange}
                   placeholder="https://example.com/image.jpg" />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Saving...' : (editingRecipe ? 'Update Recipe' : 'Create Recipe')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipeModal;