import React, { useState, useEffect } from 'react';
import WeatherDistributionChart from './WeatherDistributionChart';
import PredictionsTable from './PredictionsTable';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_predictions: 0,
    recent_predictions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/stats');
        setStats({
          total_predictions: response.data.total_predictions,
          recent_predictions: response.data.recent_predictions
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard statistics');
        setLoading(false);
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  if (loading && !stats.total_predictions) return <div>Loading dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard-container">
      <h2>Weather Prediction Dashboard</h2>
      
      <div className="stats-summary">
        <div className="stat-card">
          <h3>Total Predictions</h3>
          <p className="stat-value">{stats.total_predictions}</p>
        </div>
        <div className="stat-card">
          <h3>Recent Predictions (24h)</h3>
          <p className="stat-value">{stats.recent_predictions}</p>
        </div>
      </div>
      
      <div className="dashboard-charts">
        <WeatherDistributionChart />
      </div>
      
      <div className="dashboard-tables">
        <PredictionsTable />
      </div>
    </div>
  );
};

export default Dashboard;