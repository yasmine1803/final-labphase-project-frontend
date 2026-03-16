// Main routing component
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import Dashboard from './pages/Dashboard';
import AuthModal from './components/AuthModal';
import { loadUser } from './store/slices/authSlice';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  // Load user on app start if token exists
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} 
        />
      </Routes>
      <AuthModal /> {/* Single auth modal for entire app */}
    </BrowserRouter>
  );
}

export default App;