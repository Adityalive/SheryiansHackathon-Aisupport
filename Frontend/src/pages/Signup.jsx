import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    tenantName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.businessSignup(formData);
      setSuccessData(response.tenant);
      // We don't redirect immediately so they can see their Business ID
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="auth-container">
        <div className="auth-card success-card">
          <h2>Registration Successful! 🎉</h2>
          <p>Welcome, {formData.name}!</p>
          <div className="tenant-info">
            <p className="info-label">Your Business ID (Tenant Slug) is:</p>
            <div className="slug-box">{successData.slug}</div>
            <p className="warning">Please save this ID. You and your team will need it to log in.</p>
          </div>
          <button className="btn btn-primary w-full mt-4" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Business Registration</h2>
        <p className="auth-subtitle">Create your AI Support account</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="tenantName">Business Name</label>
            <input
              type="text"
              id="tenantName"
              name="tenantName"
              value={formData.tenantName}
              onChange={handleChange}
              required
              placeholder="e.g. Acme Corp"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="name">Your Name (Admin)</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="admin@acmecorp.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>
        
        <p className="auth-footer">
          Already have a business account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
