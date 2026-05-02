import React, { useState } from 'react';
import reactLogo from '../assets/react.svg';
import viteLogo from '../assets/vite.svg';
import heroImg from '../assets/hero.png';
import '../App.css'; // Keep original app styles for home

const Home = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="home-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started with AI Support</h1>
          <p>
            Welcome to the AI Customer Support platform.
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank" rel="noreferrer">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" rel="noreferrer">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the community</p>
          <ul>
            <li>
              <a href="https://github.com" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href="https://discord.com" target="_blank" rel="noreferrer">
                Discord
              </a>
            </li>
          </ul>
        </div>
      </section>
      
      <div className="ticks"></div>
      <section id="spacer"></section>
    </div>
  );
};

export default Home;
