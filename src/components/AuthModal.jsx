// Authentication modal for signin/signup
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeAuthModal } from '../store/slices/uiSlice';
import { signIn, signUp, clearError } from '../store/slices/authSlice';
import { FaTimes } from 'react-icons/fa';

const AuthModal = () => {
  const dispatch = useDispatch();
  const { isAuthModalOpen, authModalType } = useSelector(state => state.ui);
  const { loading, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const [validationErrors, setValidationErrors] = useState({});

  // Reset form on close
  const handleClose = () => {
    dispatch(closeAuthModal());
    setFormData({ email: '', password: '', username: '' });
    setValidationErrors({});
    dispatch(clearError());
  };

  // Handle input changes with validation clearing
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: null });
    }
    if (error) dispatch(clearError());
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    if (authModalType === 'signup') {
      if (!formData.username.trim()) {
        errors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        errors.username = 'Username must be at least 3 characters';
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        errors.username = 'Only letters, numbers, and underscores';
      }
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const action = authModalType === 'signin' ? signIn : signUp;
    const result = await dispatch(action(formData));
    if (!result.error) handleClose();
  };

  if (!isAuthModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{authModalType === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
          <button className="close-btn" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {authModalType === 'signup' && (
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={validationErrors.username ? 'error' : ''}
                placeholder="Enter username"
              />
              {validationErrors.username && (
                <span className="error-message">{validationErrors.username}</span>
              )}
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={validationErrors.email ? 'error' : ''}
              placeholder="Enter email"
            />
            {validationErrors.email && (
              <span className="error-message">{validationErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={validationErrors.password ? 'error' : ''}
              placeholder="Enter password"
            />
            {validationErrors.password && (
              <span className="error-message">{validationErrors.password}</span>
            )}
          </div>

          {error && (
            <div className="error-message" style={{ 
              marginBottom: '1rem', 
              padding: '0.8rem', 
              background: '#fff2f2', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Loading...' : (authModalType === 'signin' ? 'Sign In' : 'Sign Up')}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            {authModalType === 'signin' ? (
              <>
                Don't have an account?{' '}
                <span style={{ color: 'var(--accent)', cursor: 'pointer' }}
                  onClick={() => {
                    dispatch({ type: 'ui/openAuthModal', payload: 'signup' });
                    setFormData({ email: '', password: '', username: '' });
                  }}
                >
                  Sign Up
                </span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span style={{ color: 'var(--accent)', cursor: 'pointer' }}
                  onClick={() => {
                    dispatch({ type: 'ui/openAuthModal', payload: 'signin' });
                    setFormData({ email: '', password: '', username: '' });
                  }}
                >
                  Sign In
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;