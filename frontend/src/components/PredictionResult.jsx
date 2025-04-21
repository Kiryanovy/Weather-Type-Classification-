import React from 'react';

const PredictionResult = ({ prediction }) => {
  if (!prediction) return null;

  // Função para determinar ícone baseado no tipo de clima
  const getWeatherIcon = (weatherType) => {
    const weatherIcons = {
      'Sunny': '☀️',
      'Cloudy': '☁️',
      'Rainy': '🌧️',
      'Stormy': '⛈️',
      'Snowy': '❄️',
      'Foggy': '🌫️',
      'Partly Cloudy': '⛅',
      'Clear': '🌞',
      'Thunderstorm': '🌩️',
      'Drizzle': '🌦️',
      'Heavy Rain': '💧',
      'Windy': '💨',
    };

    return weatherIcons[weatherType] || '🌡️';
  };

  return (
    <div className="prediction-result">
      <h3>Prediction Result</h3>
      <div className="result-card">
        <div className="weather-icon">
          {getWeatherIcon(prediction.prediction)}
        </div>
        <div className="weather-details">
          <h4>{prediction.prediction}</h4>
          {prediction.probability && (
            <p>Confidence: {(prediction.probability * 100).toFixed(1)}%</p>
          )}
          <p>Predicted at: {new Date(prediction.timestamp).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;

/* depressao */