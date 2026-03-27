import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/AuthService';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      await refreshUser();
      navigate('/');
    } catch (err) {
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">EMS</div>
        <h2 className="auth-title">Sign in</h2>
        <p className="auth-subtitle">Employee Management System</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              id="username"
              type="text"
              className="form-control"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.8rem' }}>Need admin access?</p>
              <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ width: '100%', background: '#f8f9fa', color: '#333', border: '1px solid #ddd' }}
                  onClick={() => {
                      setUsername('ems_admin');
                      setPassword('Admin@EMS2026');
                      // Give state a chance to update before submitting
                      setTimeout(() => {
                          const form = document.querySelector('form');
                          if (form) form.requestSubmit();
                      }, 100);
                  }}
              >
                  Log in as System Admin
              </button>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
