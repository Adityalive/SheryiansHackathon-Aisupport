import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SupportProvider } from './features/support-widget/context/SupportContext';
import SupportWidget from './features/support-widget/components/SupportWidget';

// Pages & Layout
import Layout from './components/Layout';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  // Try to get the tenantId from the logged-in user to initialize the chat for that tenant
  // In a real app, you might want to dynamically update this if the user logs in/out
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const activeTenantId = currentUser?.tenant?._id || currentUser?.tenant?.id || 'default-tenant';

  return (
    <SupportProvider tenantId={activeTenantId}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>

      <SupportWidget />
    </SupportProvider>
  );
}

export default App;
