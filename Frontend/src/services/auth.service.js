import axios from 'axios';
import { API_BASE } from '../config/api.config';

const API_URL = `${API_BASE}/auth`;

export const authService = {
  businessSignup: async (userData) => {
    const response = await axios.post(`${API_URL}/business-signup`, userData);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  }
};

export default authService;
