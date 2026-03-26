// frontend/src/pages/Dashboard.js
import React from 'react';
import './Dashboard.css';

export default function Dashboard({ level }) {
  // Calculate progress to next whole level
  const progressPercentage = (level % 1) * 100;
  const displayProgress = progressPercentage === 0 && level > 1 ? 100 : progressPercentage;

  return (
    <div className="dashboard-container">
      <h1 className="welcome-text">Initiate Sequence.</h1>
      <p className="subtitle">Your algorithmic training metrics are ready.</p>
      
      <div className="stats-grid">
        
        {/* LEVEL CARD */}
        <div className="stat-card" style={{ '--card-color': '#00f0ff', '--card-rgb': '0, 240, 255' }}>
          <div className="stat-label">Current Level</div>
          <div className="stat-value">{level.toFixed(1)}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px' }}>
            <span>Progression</span>
            <span>{displayProgress}% to next tier</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${displayProgress}%` }}></div>
          </div>
        </div>

        {/* RANK CARD */}
        <div className="stat-card" style={{ '--card-color': '#8b5cf6', '--card-rgb': '139, 92, 246' }}>
          <div className="stat-label">Global Percentile</div>
          <div className="stat-value">Top 12%</div>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>Based on recent submission speed.</p>
        </div>

      </div>
    </div>
  );
}