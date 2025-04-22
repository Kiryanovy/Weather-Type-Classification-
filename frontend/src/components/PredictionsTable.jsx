import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const PredictionsTable = () => {
  const [predictions, setPredictions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 10,
    total: 0,
    pages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPredictions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.getPredictions(pagination.page, pagination.per_page);
      setPredictions(response.predictions);
      setPagination({
        ...pagination,
        total: response.total,
        pages: response.pages
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to load predictions');
      setLoading(false);
    }
  }, [pagination.page, pagination.per_page]);
  
  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  const handleNextPage = () => {
    if (pagination.page < pagination.pages) {
      setPagination({
        ...pagination,
        page: pagination.page + 1
      });
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPagination({
        ...pagination,
        page: pagination.page - 1
      });
    }
  };

  if (loading && predictions.length === 0) return <div>Loading predictions...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (predictions.length === 0) return <div>No predictions available</div>;

  return (
    <div className="predictions-table-container">
      <h3>Recent Predictions</h3>
      <table className="predictions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Timestamp</th>
            <th>Temperature</th>
            <th>Humidity</th>
            <th>Wind Speed</th>
            <th>Predicted Weather</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map(pred => (
            <tr key={pred.id}>
              <td>{pred.id}</td>
              <td>{new Date(pred.timestamp).toLocaleString()}</td>
              <td>{pred.input_data.temperature}°C</td>
              <td>{pred.input_data.humidity}%</td>
              <td>{pred.input_data.wind_speed} km/h</td>
              <td><strong>{pred.prediction}</strong></td>
              <td>{pred.prediction_probability !== null ? 
                   `${(pred.prediction_probability * 100).toFixed(1)}%` : 
                   'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="pagination-controls">
        <button onClick={handlePrevPage} disabled={pagination.page === 1}>
          Previous
        </button>
        <span>
          Page {pagination.page} of {pagination.pages || 1}
        </span>
        <button onClick={handleNextPage} disabled={pagination.page === pagination.pages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PredictionsTable;
