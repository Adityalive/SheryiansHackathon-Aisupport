import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import './Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="layout-container">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">AI Support</Link>
        </div>
        <div className="nav-links">
          {currentUser ? (
            <>
              <Link to="/dashboard" className="nav-item">Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-outline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">Login</Link>
              <Link to="/signup" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
