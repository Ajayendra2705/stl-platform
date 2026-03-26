// frontend/src/pages/Arena.js
import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './Arena.css';

export default function Arena({ level, updateGlobalLevel }) {
  const [code, setCode] = useState("#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    // Optimize for O(1) constraints\n    \n    return 0;\n}");
  const [question, setQuestion] = useState(null);
  const [verdictData, setVerdictData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // New States for the Console Panel
  const [activeTab, setActiveTab] = useState('testcases'); // 'testcases' or 'results'
  const [customInput, setCustomInput] = useState("");
  
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    fetch(`${apiUrl}/api/question`)
      .then(res => res.json())
      .then(data => setQuestion(data.question))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => setSecondsElapsed(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAction = async (actionType) => {
    setIsProcessing(true);
    setActiveTab('results'); // Automatically flip to the results tab when running
    setVerdictData({ status: "Executing...", message: "Compiling and running against constraints..." });
    
    if (actionType === "submit") setIsTimerRunning(false);
    
    try {
      const response = await fetch('http://localhost:8000/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sourceCode: code,
          timeTakenSeconds: secondsElapsed,
          action: actionType,
          customInput: customInput // Send the user's custom edge cases
        })
      });
      
      const data = await response.json();
      setVerdictData({ 
        status: data.verdict, 
        message: data.message,
        isCompileOnly: data.isCompileOnly
      });

      if (actionType === "submit") {
        updateGlobalLevel(data.newLevel);
        if (data.verdict !== "AC") setIsTimerRunning(true);
      }

    } catch (error) {
      setVerdictData({ status: "Error", message: "ERR_CONNECTION: Failed to reach executor API." });
      setIsTimerRunning(true);
    }
    setIsProcessing(false);
  };

  const getTerminalTheme = () => {
    if (!verdictData) return { color: 'var(--text-secondary)', dot: '#475569' };
    if (verdictData.isCompileOnly) return { color: 'var(--accent-cyan)', dot: 'var(--accent-cyan)' };
    if (verdictData.status === "AC") return { color: 'var(--status-success)', dot: 'var(--status-success)' };
    return { color: 'var(--status-fail)', dot: 'var(--status-fail)' };
  };

  if (!question) return <div style={{ padding: '40px', color: '#fff' }}>Initializing Sandbox...</div>;

  const termTheme = getTerminalTheme();

  return (
    <div className="arena-container">
      
      {/* --- LEFT PANE --- */}
      <div className="problem-pane">
        <div className="timer-glass">
          <span className="timer-label">Session Time</span>
          <span className="timer-time">{formatTime(secondsElapsed)}</span>
        </div>

        <div className="pane-scroll-area">
          <h2 className="topic-title">{question.topic}</h2>
          
          <div className="problem-meta">
            <span className="meta-tag">CPU: <strong>{question.timeLimitMs / 1000}s</strong></span>
            <span className="meta-tag">MEM: <strong>{question.memoryLimitMb}MB</strong></span>
            <span className="meta-tag">Type: <strong>Algorithm</strong></span>
          </div>

          <p className="problem-text">{question.problemText}</p>
        </div>
      </div>
      
      {/* --- RIGHT PANE (Split Layout) --- */}
      <div className="editor-pane right-layout">
        
        {/* Editor Area (Top) */}
        <div className="editor-wrapper">
          <Editor 
            height="100%" 
            theme="vs-dark" 
            language="cpp" 
            value={code} 
            onChange={setCode} 
            options={{ 
              fontSize: 15, minimap: { enabled: false },
              padding: { top: 20 }, fontFamily: "'JetBrains Mono', monospace",
              scrollbar: { vertical: 'hidden' }, overviewRulerLanes: 0
            }} 
          />
        </div>
        
        {/* The New Console Panel (Bottom) */}
        <div className="console-panel">
          
          <div className="console-header">
            <button 
              className={`console-tab ${activeTab === 'testcases' ? 'active' : ''}`}
              onClick={() => setActiveTab('testcases')}
            >
              Test Cases
            </button>
            <button 
              className={`console-tab ${activeTab === 'results' ? 'active' : ''}`}
              onClick={() => setActiveTab('results')}
            >
              Execution Results
            </button>
          </div>

          <div className="console-content">
            {activeTab === 'testcases' ? (
              <textarea 
                className="custom-input-area"
                placeholder="Enter custom stdin here to test edge cases..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
              />
            ) : (
              <div style={{ color: termTheme.color }}>
                {verdictData ? (
                  <>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#f8fafc' }}>
                      [{verdictData.isCompileOnly ? 'DRY RUN' : 'EVALUATION'}]: <span style={{color: termTheme.color}}>{verdictData.status}</span>
                    </div>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                      {verdictData.message}
                    </pre>
                  </>
                ) : (
                  <span style={{ color: 'var(--text-secondary)' }}>Run your code to see outputs here.</span>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Action Bar */}
        <div className="action-bar">
          <button className="btn btn-compile" onClick={() => handleAction("compile")} disabled={isProcessing}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            {isProcessing ? "Running..." : "Run Code"}
          </button>
          
          <button className="btn btn-submit" onClick={() => handleAction("submit")} disabled={isProcessing}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            {isProcessing ? "Judging..." : "Submit"}
          </button>
        </div>

      </div>
    </div>
  );
}