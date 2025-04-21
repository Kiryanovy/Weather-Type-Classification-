import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = {
  // Make a weather prediction
  predict: async (weatherData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, weatherData);
      return response.data;
    } catch (error) {
      console.error('Error making prediction:', error);
      throw error;
    }
  },

  // Get all predictions with pagination
  getPredictions: async (page = 1, perPage = 10) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/predictions?page=${page}&per_page=${perPage}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching predictions:', error);
      throw error;
    }
  },

  // Get statistics for dashboard
  getStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
};

export default api;