// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminPanel from './components/AdminPanel';
import EloScoringPlatform from './components/EloScoringPlatform';
import Leaderboard from './components/Leaderboard';
import Arena from './components/Arena';

function App() {
  return (
    <Router>
      <div style={{height: "80vh", overflow: "auto"}}>
        <Navbar />
        <Routes>
          <Route path="/" element={<EloScoringPlatform />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/arena" element={<Arena />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
