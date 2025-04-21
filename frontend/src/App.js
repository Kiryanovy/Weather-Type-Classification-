import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './styles.css';

// Importe os componentes
import Home from './pages/Home';
import PredictionPage from './pages/PredictionPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Weather Type Detection System</h1>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/predict">Make Prediction</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<PredictionPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; 2025 Weather Type Detection System</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;