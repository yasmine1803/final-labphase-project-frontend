// Recipes page - displays all recipes with search
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavbarRecipe from '../components/NavbarRecipe';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import Footer from '../components/Footer';
import { fetchRecipes, fetchSavedRecipes } from '../store/slices/recipeSlice';

const Recipes = () => {
  const dispatch = useDispatch();
  const { recipes, loading } = useSelector(state => state.recipes);
  const { isAuthenticated } = useSelector(state => state.auth);

  // Load recipes on mount
  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  // Load saved recipes if user is logged in
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchSavedRecipes());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <>
      <NavbarRecipe />
      
      <div style={{ marginTop: '80px', minHeight: '60vh' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading recipes...</div>
        ) : recipes.length === 0 ? (
          <div className="empty-state">
            <p>No recipes found</p>
            <p className="empty-state-sub">Try adjusting your search</p>
          </div>
        ) : (
          <div className="recipe-grid">
            {recipes.map(recipe => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>

      <RecipeModal />
      <Footer />
    </>
  );
};

export default Recipes;