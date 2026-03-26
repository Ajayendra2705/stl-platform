// frontend/src/pages/Curriculum.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Curriculum.css';

export default function Curriculum({ level }) {
  // Mock data representing your full STL curriculum map
  const topics = [
    { id: 1, title: "Vector Mechanics", desc: "Master dynamic arrays, reallocation overhead, and O(1) amortized insertions.", requiredLevel: 1.0 },
    { id: 2, title: "Fast Lookups (Sets & Maps)", desc: "Utilize Red-Black Trees to optimize search and insertion to O(log N).", requiredLevel: 2.0 },
    { id: 3, title: "Priority Queues", desc: "Implement Binary Heaps for optimal min/max retrieval in greedy algorithms.", requiredLevel: 3.0 },
    { id: 4, title: "Custom Comparators", desc: "Override standard sorting behavior for complex data structures and structures.", requiredLevel: 4.0 },
    { id: 5, title: "Unordered Containers", desc: "Leverage Hash Tables for absolute O(1) average time complexities.", requiredLevel: 5.0 },
  ];

  return (
    <div className="curriculum-container">
      <h1 className="header-title">The Curriculum</h1>
      <p className="header-sub">Modules unlock dynamically as you prove your algorithmic efficiency.</p>
      
      <div className="topics-grid">
        {topics.map(topic => {
          const isUnlocked = level >= topic.requiredLevel;
          
          return (
            <div key={topic.id} className={`topic-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
              <div className="card-tier">TIER {topic.requiredLevel.toFixed(1)}</div>
              <h3 className="card-title">{topic.title}</h3>
              <p className="card-desc">{topic.desc}</p>
              
              {isUnlocked ? (
                <Link to="/arena" className="card-btn btn-enter">Enter Arena</Link>
              ) : (
                <div className="card-btn btn-locked">Locked</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}