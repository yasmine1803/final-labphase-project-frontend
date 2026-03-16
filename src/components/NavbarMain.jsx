// Main navigation bar for home page
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { openAuthModal } from '../store/slices/uiSlice';

const NavbarMain = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Add scroll effect for navbar opacity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // Return to top on logo click
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      {/* Left side - Logo and brand */}
      <div className="navbar-left" onClick={handleLogoClick}>
        <img src="/logo.png" alt="Bitely" className="navbar-logo" />
        <span className="navbar-title">Bitely</span>
      </div>

      {/* Center - Navigation links */}
      <div className="navbar-center">
        <span className="nav-link" onClick={() => scrollToSection('hero')}>Home</span>
        <span className="nav-link" onClick={() => scrollToSection('about')}>About</span>
        <span className="nav-link" onClick={() => navigate('/recipes')}>Recipes</span>
      </div>

      {/* Right side - Auth buttons or user profile */}
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

export default NavbarMain;