import React, { useState } from 'react';
import PredictionResult from './PredictionResult';
import api from '../services/api';

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    temperature: 25,
    humidity: 70,
    wind_speed: 10,
    precipitation: 0,
    cloud_cover: 'Partly Cloudy',
    atmospheric_pressure: 1013,
    uv_index: 5,
    season: 'Summer',
    visibility: 10,
    location: 'Coastal'
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cloudCoverOptions = ['Clear', 'Partly Cloudy', 'Mostly Cloudy', 'Overcast', 'Foggy'];
  const seasonOptions = ['Spring', 'Summer', 'Fall', 'Winter'];
  const locationOptions = ['Coastal', 'Inland', 'Mountain', 'Desert', 'Urban', 'Rural'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = ['temperature', 'humidity', 'wind_speed', 'precipitation', 
                        'atmospheric_pressure', 'uv_index', 'visibility'].includes(name) 
                        ? parseFloat(value) : value;
    
    setFormData({
      ...formData,
      [name]: parsedValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await api.predict(formData);
      setPrediction(result);
    } catch (err) {
      setError('Error making prediction. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-form-container">
      <h2>Weather Type Prediction</h2>
      <p>Enter weather conditions to predict the weather type:</p>
      
      <form onSubmit={handleSubmit} className="prediction-form">
        <div className="form-group">
          <label>Temperature (°C):</label>
          <input
            type="number"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label>Humidity (%):</label>
          <input
            type="number"
            name="humidity"
            value={formData.humidity}
            onChange={handleChange}
            min="0"
            max="100"
            required
          />
        </div>

        <div className="form-group">
          <label>Wind Speed (km/h):</label>
          <input
            type="number"
            name="wind_speed"
            value={formData.wind_speed}
            onChange={handleChange}
            min="0"
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label>Precipitation (mm):</label>
          <input
            type="number"
            name="precipitation"
            value={formData.precipitation}
            onChange={handleChange}
            min="0"
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label>Cloud Cover:</label>
          <select
            name="cloud_cover"
            value={formData.cloud_cover}
            onChange={handleChange}
            required
          >
            {cloudCoverOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Atmospheric Pressure (hPa):</label>
          <input
            type="number"
            name="atmospheric_pressure"
            value={formData.atmospheric_pressure}
            onChange={handleChange}
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label>UV Index:</label>
          <input
            type="number"
            name="uv_index"
            value={formData.uv_index}
            onChange={handleChange}
            min="0"
            max="11"
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label>Season:</label>
          <select
            name="season"
            value={formData.season}
            onChange={handleChange}
            required
          >
            {seasonOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Visibility (km):</label>
          <input
            type="number"
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            min="0"
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label>Location:</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          >
            {locationOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict Weather Type'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
      
      {prediction && <PredictionResult prediction={prediction} />}
    </div>
  );
};

export default PredictionForm;