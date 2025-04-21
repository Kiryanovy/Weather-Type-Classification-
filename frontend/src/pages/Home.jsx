import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <h2>Welcome to the Weather Type Detection System</h2>
      <p>
        This application uses machine learning to predict weather types based on various
        meteorological parameters. Our model has been trained on historical weather data
        to provide accurate predictions.
      </p>
      
      <div className="home-cards">
        <div className="card">
          <h3>Make a Prediction</h3>
          <p>Enter weather conditions to get an instant prediction of the weather type.</p>
          <Link to="/predict" className="btn">Make Prediction</Link>
        </div>
        
        <div className="card">
          <h3>View Dashboard</h3>
          <p>Explore statistics and visualizations of previous weather predictions.</p>
          <Link to="/dashboard" className="btn">View Dashboard</Link>
        </div>
      </div>
      
      <div className="home-features">
        <h3>Key Features</h3>
        <ul>
          <li>Accurate weather type predictions using machine learning</li>
          <li>Interactive dashboard with real-time statistics</li>
          <li>Historical prediction data visualization</li>
          <li>Easy-to-use prediction form</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;