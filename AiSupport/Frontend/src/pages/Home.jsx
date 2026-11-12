import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Shield, Zap, MessageSquare, Headphones, BarChart3, Globe, UserPlus, LogIn, LayoutDashboard } from 'lucide-react';
import { useSupport } from '../features/support-widget/hooks/useSupport';
import './Home.css';

const Home = () => {
  const { toggleWidget } = useSupport();

  return (
    <div className="home-root">
      {/* ── Navigation Header (In-Page) ────────────────── */}
      <nav className="landing-nav">
        <div className="brand">AI Support</div>
        <div className="nav-actions">
          <Link to="/login" className="nav-link"><LogIn size={18} /> Login</Link>
          <Link to="/signup" className="btn btn-outline btn-sm">Sign Up</Link>
          <Link to="/dashboard" className="btn btn-primary btn-sm">Dashboard</Link>
        </div>
      </nav>

      {/* ── Hero Section ────────────────── */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="badge-pill">🚀 v2.0 is now live</div>
          <h1>The Operating System for <span className="text-gradient">Modern Support</span></h1>
          <p>
            The only platform that combines AI Voice, Smart Chat, and instant Knowledge Base training. 
            Automate your entire customer journey in one place.
          </p>
          
          <div className="hero-actions">
            <Link to="/dashboard" className="btn btn-primary btn-lg">Get Started</Link>
            <button onClick={toggleWidget} className="btn btn-secondary btn-lg">Live Demo</button>
          </div>

          <div className="hero-auth-links">
             <Link to="/signup">New here? <strong>Create your free account</strong></Link>
             <span className="divider">|</span>
             <Link to="/login">Returning? <strong>Log in to your workspace</strong></Link>
          </div>

          <div className="hero-stats">
            <div className="stat-item"><strong>1.2M+</strong> <span>Messages Handled</span></div>
            <div className="stat-item"><strong>98%</strong> <span>CSAT Score</span></div>
            <div className="stat-item"><strong><Shield size={14} /></strong> <span>GDPR Compliant</span></div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-container">
            <div className="floating-card c1"><Headphones size={24} /> <span>Voice AI Active</span></div>
            <div className="floating-card c2"><Bot size={24} /> <span>Learning from Docs...</span></div>
            <div className="glass-mockup">
               <div className="mock-header">
                  <div className="dots"><span></span><span></span><span></span></div>
                  <div className="mock-tab">Admin Dashboard</div>
               </div>
               <div className="mock-body">
                  <div className="mock-sidebar">
                     <span></span><span></span><span></span><span></span>
                  </div>
                  <div className="mock-content">
                     <div className="mock-chart"></div>
                     <div className="mock-grid">
                        <span></span><span></span><span></span><span></span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Access Section ────────────────── */}
      <section className="quick-access">
         <div className="access-card" onClick={() => window.location.href='/signup'}>
            <div className="icon-box"><UserPlus /></div>
            <h3>Join AI Support</h3>
            <p>Start your 14-day free trial today. No credit card required.</p>
            <Link to="/signup" className="card-link">Register Now →</Link>
         </div>
         <div className="access-card" onClick={() => window.location.href='/login'}>
            <div className="icon-box"><LogIn /></div>
            <h3>Manage Workspace</h3>
            <p>Access your settings, knowledge base, and analytics.</p>
            <Link to="/login" className="card-link">Log In →</Link>
         </div>
         <div className="access-card highlight" onClick={() => window.location.href='/dashboard'}>
            <div className="icon-box"><LayoutDashboard /></div>
            <h3>Project Dashboard</h3>
            <p>View real-time performance and train your agents.</p>
            <Link to="/dashboard" className="card-link">Go to Dashboard →</Link>
         </div>
      </section>

      {/* ── Features Section ────────────────── */}
      <section className="features-section">
        <div className="section-header">
          <h2>Deploy Intelligence <span className="text-gradient">Everywhere</span></h2>
          <p>One platform, multiple channels, infinite scale.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Headphones /></div>
            <h3>Voice AI</h3>
            <p>Automated phone support that sounds human and solves problems.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Zap /></div>
            <h3>Smart Chat</h3>
            <p>Context-aware web chat that's always online.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Globe /></div>
            <h3>Instant Training</h3>
            <p>The AI learns your business from your existing docs in seconds.</p>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────── */}
      <section className="cta-footer">
        <div className="cta-box">
          <h2>Ready to Scale?</h2>
          <p>Join thousands of businesses automating their support with AI.</p>
          <div className="cta-footer-actions">
            <Link to="/signup" className="btn btn-primary btn-lg">Get Started</Link>
            <Link to="/login" className="btn btn-secondary btn-lg">Log In</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

