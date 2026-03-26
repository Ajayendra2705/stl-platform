// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import Dashboard from './pages/Dashboard/Dashboard';
import Curriculum from './pages/Curriculum/Curriculum';
import Arena from './pages/Arena/Arena';

export default function App() {
  const [globalLevel, setGlobalLevel] = useState(1.0);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    fetch(`${apiUrl}/api/question`)
      .then(res => res.json())
      .then(data => setGlobalLevel(data.currentLevel))
      .catch(err => console.error(err));
  }, []); // Keep this empty, but move the variable INSIDE the hook

  return (
    <Router>
      <div className="app-layout">
        
        {/* PREMIUM SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-header">
            STL <span>Platform</span>
          </div>
          
          <nav className="sidebar-nav">
            <Link to="/" className="nav-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
              Dashboard
            </Link>
            <Link to="/curriculum" className="nav-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              Curriculum
            </Link>
            <Link to="/arena" className="nav-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
              The Arena
            </Link>
          </nav>

          <div className="sidebar-footer">
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Rank</div>
            <div className="level-badge">Level {globalLevel.toFixed(1)}</div>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard level={globalLevel} />} />
            <Route path="/curriculum" element={<Curriculum level={globalLevel} />} />
            <Route path="/arena" element={<Arena level={globalLevel} updateGlobalLevel={setGlobalLevel} />} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}