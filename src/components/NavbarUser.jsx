// Navigation bar for user dashboard
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';

const NavbarUser = () => {
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigate home
  const handleLogoClick = () => {
    navigate('/');
  };

  // Logout handler
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      {/* Logo */}
      <div className="navbar-left" onClick={handleLogoClick}>
        <img src="/logo.png" alt="Bitely" className="navbar-logo" />
        <span className="navbar-title">Bitely</span>
      </div>

      {/* Empty center for dashboard */}
      <div className="navbar-center"></div>

      {/* Logout button */}
      <div className="navbar-right">
        <button className="btn btn-outline" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default NavbarUser;