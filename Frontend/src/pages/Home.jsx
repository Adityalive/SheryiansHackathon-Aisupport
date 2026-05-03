// src/pages/Home.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupportStore } from "../features/support-widget/store/useSupportStore";
import { useAuthStore } from "../store/useAuthStore";

export default function Home() {
  const navigate = useNavigate();
  const toggleWidget = useSupportStore((s) => s.toggleWidget);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [scrolled, setScrolled] = useState(false);
  const canvasRef = useRef(null);

  // Scroll handler for nav
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  // Scroll reveal
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.1 }
    );
    reveals.forEach((r) => obs.observe(r));
    return () => obs.disconnect();
  }, []);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];
    let W, H;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 1.2 + 0.2;
        this.vx = (Math.random() - 0.5) * 0.15;
        this.vy = (Math.random() - 0.5) * 0.15;
        this.alpha = Math.random() * 0.5 + 0.1;
        const colors = ["91,110,255", "162,89,255", "25,232,200"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 120; i++) particles.push(new Particle());

    const drawOrbs = () => {
      const g1 = ctx.createRadialGradient(W * 0.15, H * 0.2, 0, W * 0.15, H * 0.2, W * 0.35);
      g1.addColorStop(0, "rgba(91,110,255,0.07)");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

      const g2 = ctx.createRadialGradient(W * 0.85, H * 0.4, 0, W * 0.85, H * 0.4, W * 0.3);
      g2.addColorStop(0, "rgba(162,89,255,0.06)");
      g2.addColorStop(1, "transparent");
      ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

      const g3 = ctx.createRadialGradient(W * 0.5, H * 0.9, 0, W * 0.5, H * 0.9, W * 0.4);
      g3.addColorStop(0, "rgba(25,232,200,0.05)");
      g3.addColorStop(1, "transparent");
      ctx.fillStyle = g3; ctx.fillRect(0, 0, W, H);
    };

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      drawOrbs();
      particles.forEach((p) => { p.update(); p.draw(); });
      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const features = [
    {
      num: "01", colorClass: "feat-icon-blue",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" style={{ width: 22, height: 22 }}>
          <path d="M12 2a7 7 0 017 7v3a7 7 0 01-14 0V9a7 7 0 017-7z" stroke="#5B6EFF" strokeWidth="1.8" />
          <path d="M8 22h8M12 19v3" stroke="#5B6EFF" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
      title: "AI Chatbot",
      desc: "Human-like conversations that understand intent, not just keywords. Handles complex multi-turn dialogues effortlessly.",
    },
    {
      num: "02", colorClass: "feat-icon-purple",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" style={{ width: 22, height: 22 }}>
          <path d="M12 1a3 3 0 013 3v8a3 3 0 01-6 0V4a3 3 0 013-3z" stroke="#A259FF" strokeWidth="1.8" />
          <path d="M5 10v2a7 7 0 0014 0v-2M12 19v4M8 23h8" stroke="#A259FF" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
      title: "Voice Support",
      desc: "Natural voice AI for calls and real-time assistance. Customers speak — the AI listens, understands, and responds.",
    },
    {
      num: "03", colorClass: "feat-icon-teal",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" style={{ width: 22, height: 22 }}>
          <path d="M18 20V10M12 20V4M6 20v-6" stroke="#19E8C8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      title: "Live Analytics",
      desc: "Real-time dashboards showing ticket trends, satisfaction rates, and team performance at a glance.",
    },
    {
      num: "04", colorClass: "feat-icon-amber",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" style={{ width: 22, height: 22 }}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#FFB43C" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      ),
      title: "Enterprise Security",
      desc: "SOC 2 Type II compliant. End-to-end encryption, role-based access, and full audit trails built in.",
    },
    {
      num: "05", colorClass: "feat-icon-red",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" style={{ width: 22, height: 22 }}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#FF6969" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      ),
      title: "Fast Automation",
      desc: "Resolve repetitive issues in under 2 seconds. Smart routing ensures the right query reaches the right agent instantly.",
    },
    {
      num: "06", colorClass: "feat-icon-green",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" style={{ width: 22, height: 22 }}>
          <circle cx="12" cy="12" r="10" stroke="#50C878" strokeWidth="1.8" />
          <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="#50C878" strokeWidth="1.8" />
        </svg>
      ),
      title: "Global Support",
      desc: "Serve customers in 40+ languages with full semantic understanding. Your support goes wherever your users are.",
    },
  ];

  const marqueeItems = [
    "AI Chatbot", "Voice Support", "Live Analytics", "Multilingual",
    "Auto-Routing", "Sentiment Analysis", "Smart Escalation", "99.9% Uptime",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --bg: #05060a;
          --surface: #0d0f18;
          --surface2: #131625;
          --border: rgba(255,255,255,0.07);
          --border2: rgba(255,255,255,0.13);
          --text: #f0f0f5;
          --muted: #7a7d96;
          --accent: #5B6EFF;
          --accent2: #A259FF;
          --accent3: #19E8C8;
        }

        .ss-wrapper {
          background: var(--bg);
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
          min-height: 100vh;
        }

        /* BG CANVAS */
        .ss-canvas {
          position: fixed; inset: 0; z-index: 0;
          pointer-events: none; width: 100%; height: 100%;
        }

        /* NAV */
        .ss-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 60px;
          transition: all 0.4s ease;
        }
        .ss-nav.scrolled {
          background: rgba(5,6,10,0.85);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid var(--border);
          padding: 14px 60px;
        }
        .ss-logo {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px;
          letter-spacing: -0.03em; color: var(--text); text-decoration: none;
          cursor: pointer; background: none; border: none;
        }
        .ss-logo-mark {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ss-nav-links {
          display: flex; gap: 36px; list-style: none; margin: 0; padding: 0;
        }
        .ss-nav-links a {
          color: var(--muted); text-decoration: none;
          font-size: 14px; font-weight: 500; transition: color 0.2s;
        }
        .ss-nav-links a:hover { color: var(--text); }
        .ss-nav-actions { display: flex; align-items: center; gap: 16px; }
        .ss-btn-ghost {
          background: none; border: none; cursor: pointer;
          color: var(--muted); font-size: 14px; font-weight: 500;
          font-family: 'DM Sans', sans-serif; transition: color 0.2s;
        }
        .ss-btn-ghost:hover { color: var(--text); }
        .ss-btn-primary {
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          border: none; cursor: pointer; color: #fff;
          font-size: 14px; font-weight: 600; font-family: 'DM Sans', sans-serif;
          padding: 10px 22px; border-radius: 10px;
          transition: opacity 0.2s, transform 0.2s; letter-spacing: 0.01em;
        }
        .ss-btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }

        /* HERO */
        .ss-hero {
          position: relative; z-index: 1;
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 140px 40px 80px;
        }
        .ss-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 16px; border-radius: 100px;
          background: rgba(91,110,255,0.12);
          border: 1px solid rgba(91,110,255,0.3);
          color: #8fa3ff; font-size: 12px; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 36px;
          animation: ss-fadeUp 0.8s ease both;
        }
        .ss-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--accent); animation: ss-pulse-dot 2s infinite;
        }
        @keyframes ss-pulse-dot {
          0%,100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
        .ss-hero h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(48px, 7vw, 96px);
          font-weight: 800; line-height: 1.0;
          letter-spacing: -0.04em; max-width: 900px;
          margin: 0 auto 28px; animation: ss-fadeUp 0.9s 0.1s ease both;
        }
        .ss-gradient-word {
          background: linear-gradient(90deg, var(--accent), var(--accent2), var(--accent3));
          background-size: 200%;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: ss-shimmer 4s linear infinite;
        }
        @keyframes ss-shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .ss-hero p {
          max-width: 560px; margin: 0 auto 44px;
          color: var(--muted); font-size: 18px; line-height: 1.7;
          animation: ss-fadeUp 1s 0.2s ease both;
        }
        .ss-hero-actions {
          display: flex; gap: 14px; flex-wrap: wrap;
          justify-content: center; animation: ss-fadeUp 1s 0.3s ease both;
        }
        .ss-btn-large {
          padding: 16px 32px; border-radius: 14px;
          font-size: 15px; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: all 0.25s;
          display: flex; align-items: center; gap: 8px; letter-spacing: 0.01em;
        }
        .ss-btn-filled {
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
          color: #fff; border: none;
          box-shadow: 0 8px 32px rgba(91,110,255,0.35);
        }
        .ss-btn-filled:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(91,110,255,0.5); }
        .ss-btn-outline {
          background: rgba(255,255,255,0.04);
          color: var(--text); border: 1px solid var(--border2);
          backdrop-filter: blur(10px);
        }
        .ss-btn-outline:hover { background: rgba(255,255,255,0.09); transform: translateY(-2px); }

        /* STATS */
        .ss-stats-section {
          position: relative; z-index: 1;
          padding: 0 40px 80px; animation: ss-fadeUp 1s 0.4s ease both;
        }
        .ss-stats-card {
          max-width: 900px; margin: 0 auto;
          background: var(--surface); border: 1px solid var(--border2);
          border-radius: 24px; overflow: hidden;
          box-shadow: 0 0 0 1px rgba(91,110,255,0.08), 0 32px 80px rgba(0,0,0,0.6);
        }
        .ss-stats-bar {
          display: flex; background: var(--surface2);
          padding: 8px 16px; gap: 6px;
          border-bottom: 1px solid var(--border);
        }
        .ss-dot { width: 10px; height: 10px; border-radius: 50%; }
        .ss-dot-r { background: #FF5F57; }
        .ss-dot-y { background: #FEBC2E; }
        .ss-dot-g { background: #28C840; }
        .ss-stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          padding: 32px; gap: 1px;
        }
        .ss-stat-cell {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 24px 12px; text-align: center; position: relative;
        }
        .ss-stat-cell:not(:last-child)::after {
          content: ''; position: absolute;
          right: 0; top: 20%; bottom: 20%;
          width: 1px; background: var(--border);
        }
        .ss-stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 38px; font-weight: 800;
          letter-spacing: -0.04em; line-height: 1; margin-bottom: 6px;
        }
        .ss-v1 { color: var(--accent); }
        .ss-v2 { color: var(--accent2); }
        .ss-v3 { color: var(--accent3); }
        .ss-v4 {
          background: linear-gradient(90deg, #f7c069, #ff8c42);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ss-stat-label {
          font-size: 12px; color: var(--muted); font-weight: 500;
          letter-spacing: 0.06em; text-transform: uppercase;
        }

        /* MARQUEE */
        .ss-marquee-section {
          position: relative; z-index: 1;
          padding: 40px 0; overflow: hidden;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .ss-marquee-track {
          display: flex; gap: 60px; width: max-content;
          animation: ss-marquee 20s linear infinite;
        }
        .ss-marquee-item {
          display: flex; align-items: center; gap: 12px;
          font-size: 13px; font-weight: 500; color: var(--muted);
          white-space: nowrap; letter-spacing: 0.04em; text-transform: uppercase;
        }
        .ss-marquee-dot {
          width: 4px; height: 4px; border-radius: 50%; background: var(--accent);
        }
        @keyframes ss-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* FEATURES */
        .ss-features {
          position: relative; z-index: 1;
          padding: 100px 60px;
          border-top: 1px solid var(--border);
        }
        .ss-section-label {
          display: inline-block; font-size: 11px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--accent); margin-bottom: 20px;
        }
        .ss-section-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(36px, 4.5vw, 60px);
          font-weight: 800; letter-spacing: -0.04em;
          line-height: 1.05; max-width: 600px; margin-bottom: 72px;
        }
        .ss-feat-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: var(--border);
          border: 1px solid var(--border); border-radius: 24px; overflow: hidden;
        }
        .ss-feat-card {
          background: var(--surface); padding: 36px 32px;
          transition: background 0.3s; position: relative; overflow: hidden;
        }
        .ss-feat-card::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle at 0% 0%, rgba(91,110,255,0.08) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.4s;
        }
        .ss-feat-card:hover { background: var(--surface2); }
        .ss-feat-card:hover::before { opacity: 1; }
        .ss-feat-icon {
          width: 48px; height: 48px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center; margin-bottom: 20px;
        }
        .feat-icon-blue  { background: rgba(91,110,255,0.15); }
        .feat-icon-purple { background: rgba(162,89,255,0.15); }
        .feat-icon-teal  { background: rgba(25,232,200,0.15); }
        .feat-icon-amber { background: rgba(255,180,60,0.15); }
        .feat-icon-red   { background: rgba(255,105,105,0.15); }
        .feat-icon-green { background: rgba(80,200,120,0.15); }
        .ss-feat-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px; font-weight: 700; margin-bottom: 10px; letter-spacing: -0.02em;
        }
        .ss-feat-desc { font-size: 14px; color: var(--muted); line-height: 1.65; }
        .ss-feat-num {
          position: absolute; top: 28px; right: 28px;
          font-size: 11px; color: rgba(255,255,255,0.1);
          font-family: 'Syne', sans-serif; font-weight: 800; letter-spacing: 0.06em;
        }

        /* CTA */
        .ss-cta-section {
          position: relative; z-index: 1; padding: 80px 60px 120px;
        }
        .ss-cta-inner {
          max-width: 900px; margin: 0 auto;
          background: var(--surface); border: 1px solid var(--border2);
          border-radius: 28px; padding: 72px 60px;
          text-align: center; position: relative; overflow: hidden;
        }
        .ss-cta-glow {
          position: absolute; top: -80px; left: 50%; transform: translateX(-50%);
          width: 500px; height: 300px;
          background: radial-gradient(ellipse, rgba(91,110,255,0.2) 0%, transparent 70%);
          pointer-events: none;
        }
        .ss-cta-inner h2 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 4vw, 54px);
          font-weight: 800; letter-spacing: -0.04em;
          margin-bottom: 18px; line-height: 1.05;
        }
        .ss-cta-inner p {
          color: var(--muted); font-size: 16px; max-width: 480px;
          margin: 0 auto 40px; line-height: 1.65;
        }
        .ss-cta-actions { display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; }

        /* FOOTER */
        .ss-footer {
          position: relative; z-index: 1;
          border-top: 1px solid var(--border);
          padding: 64px 60px 32px;
        }
        .ss-footer-grid {
          display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 40px; margin-bottom: 56px;
        }
        .ss-footer-brand p {
          color: var(--muted); font-size: 14px; line-height: 1.6;
          margin-top: 14px; max-width: 220px;
        }
        .ss-footer-col h4 {
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted);
          margin-bottom: 18px;
        }
        .ss-footer-col ul {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 10px;
        }
        .ss-footer-col a {
          color: rgba(240,240,245,0.5); text-decoration: none;
          font-size: 14px; transition: color 0.2s;
        }
        .ss-footer-col a:hover { color: var(--text); }
        .ss-footer-bottom {
          border-top: 1px solid var(--border); padding-top: 28px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .ss-footer-bottom p { color: var(--muted); font-size: 13px; }
        .ss-footer-socials { display: flex; gap: 12px; }
        .ss-social-btn {
          width: 34px; height: 34px; border-radius: 8px;
          background: var(--surface2); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
        }
        .ss-social-btn:hover { background: var(--border2); transform: translateY(-1px); }
        .ss-social-btn svg { width: 14px; height: 14px; fill: var(--muted); }

        /* ANIMATIONS */
        @keyframes ss-fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal.in { opacity: 1; transform: translateY(0); }
      `}</style>

      <div className="ss-wrapper">
        {/* Particle Canvas */}
        <canvas ref={canvasRef} className="ss-canvas" />

        {/* NAV */}
        <nav className={`ss-nav${scrolled ? " scrolled" : ""}`}>
          <button className="ss-logo" onClick={() => window.scrollTo(0, 0)}>
            <div className="ss-logo-mark">
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            SupportSphere <span style={{ color: "var(--accent)" }}>AI</span>
          </button>

          <ul className="ss-nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#features">Pricing</a></li>
            <li><a href="#features">Docs</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>

          <div className="ss-nav-actions">
            {!isAuthenticated && (
              <button className="ss-btn-ghost" onClick={() => navigate("/login")}>Log in</button>
            )}
            <button className="ss-btn-primary" onClick={handleGetStarted}>
              {isAuthenticated ? "Dashboard" : "Get Started"}
            </button>
          </div>
        </nav>

        {/* HERO */}
        <section className="ss-hero">
          <div className="ss-badge">
            <div className="ss-badge-dot" />
            Next-Gen AI Customer Support
          </div>
          <h1>
            Support at the speed<br />
            of <span className="ss-gradient-word">intelligence</span>
          </h1>
          <p>
            Resolve 80% of customer queries instantly. Human-like conversational AI built for teams who refuse to compromise.
          </p>
          <div className="ss-hero-actions">
            <button className="ss-btn-large ss-btn-filled" onClick={handleGetStarted}>
              {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="ss-btn-large ss-btn-outline" onClick={toggleWidget}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
              </svg>
              Watch Demo
            </button>
          </div>
        </section>

        {/* STATS */}
        <div className="ss-stats-section reveal">
          <div className="ss-stats-card">
            <div className="ss-stats-bar">
              <div className="ss-dot ss-dot-r" />
              <div className="ss-dot ss-dot-y" />
              <div className="ss-dot ss-dot-g" />
            </div>
            <div className="ss-stats-grid">
              {[
                { value: "94%", label: "AI Resolved", cls: "ss-v1" },
                { value: "1.2s", label: "Avg Response", cls: "ss-v2" },
                { value: "12",   label: "Active Tickets", cls: "ss-v3" },
                { value: "4.9/5", label: "CSAT Score",  cls: "ss-v4" },
              ].map((s, i) => (
                <div className="ss-stat-cell" key={i}>
                  <div className={`ss-stat-value ${s.cls}`}>{s.value}</div>
                  <div className="ss-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MARQUEE */}
        <div className="ss-marquee-section">
          <div className="ss-marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <div className="ss-marquee-item" key={i}>
                <div className="ss-marquee-dot" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <section className="ss-features" id="features">
          <div className="ss-section-label reveal">Capabilities</div>
          <div className="ss-section-title reveal">
            Built for teams<br />who move fast.
          </div>
          <div className="ss-feat-grid reveal">
            {features.map((f, i) => (
              <div className="ss-feat-card" key={i}>
                <div className="ss-feat-num">{f.num}</div>
                <div className={`ss-feat-icon ${f.colorClass}`}>{f.icon}</div>
                <div className="ss-feat-title">{f.title}</div>
                <div className="ss-feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="ss-cta-section reveal">
          <div className="ss-cta-inner">
            <div className="ss-cta-glow" />
            <h2>Ready to transform<br />your support?</h2>
            <p>
              Join the teams using SupportSphere AI to deliver exceptional experiences — 24 hours a day, 7 days a week.
            </p>
            <div className="ss-cta-actions">
              <button className="ss-btn-large ss-btn-filled" onClick={handleGetStarted}>
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="ss-footer" id="contact">
          <div className="ss-footer-grid">
            <div className="ss-footer-brand">
              <div className="ss-logo" style={{ cursor: "default" }}>
                <div className="ss-logo-mark">
                  <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                SupportSphere <span style={{ color: "var(--accent)" }}>AI</span>
              </div>
              <p>Automating the future of customer interactions, one conversation at a time.</p>
            </div>
            {[
              { title: "Product", links: ["Features", "Integrations", "Pricing", "Changelog"] },
              { title: "Resources", links: ["Documentation", "API Reference", "Blog", "Status"] },
              { title: "Company", links: ["About", "Careers", "Contact", "Privacy"] },
            ].map((col, i) => (
              <div className="ss-footer-col" key={i}>
                <h4>{col.title}</h4>
                <ul>
                  {col.links.map((l, j) => (
                    <li key={j}><a href="#">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="ss-footer-bottom">
            <p>© 2026 SupportSphere AI. All rights reserved.</p>
            <div className="ss-footer-socials">
              <div className="ss-social-btn">
                <svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>
              </div>
              <div className="ss-social-btn">
                <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
              </div>
              <div className="ss-social-btn">
                <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" /></svg>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
