// Navigation bar for recipes page with search functionality
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { openAuthModal } from '../store/slices/uiSlice';
import { fetchRecipes } from '../store/slices/recipeSlice';

const NavbarRecipe = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Scroll effect for navbar opacity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounced search - waits 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchRecipes(searchTerm));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, dispatch]);

  // Navigate home on logo click
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      {/* Left side - Logo */}
      <div className="navbar-left" onClick={handleLogoClick}>
        <img src="/logo.png" alt="Bitely" className="navbar-logo" />
        <span className="navbar-title">Bitely</span>
      </div>

      {/* Center - Search bar */}
      <div className="navbar-center">
        <input
          type="text"
          className="search-bar"
          placeholder="Search dish, origin, publisher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Right side - Auth or profile */}
      <div className="navbar-right">
        {isAuthenticated ? (
          <button className="btn-username" onClick={() => navigate('/dashboard')}>
            {user?.username}
          </button>
        ) : (
          <>
            <button className="btn btn-outline" onClick={() => dispatch(openAuthModal('signin'))}>
              Sign In
            </button>
            <button className="btn btn-primary" onClick={() => dispatch(openAuthModal('signup'))}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavbarRecipe;