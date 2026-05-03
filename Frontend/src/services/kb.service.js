import axios from 'axios';

const API_URL = 'http://localhost:3000/api/knowledge';

const getAuthHeaders = () => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return {};
    const { state } = JSON.parse(authStorage);
    return state.token ? { Authorization: `Bearer ${state.token}` } : {};
  } catch (e) {
    return {};
  }
};

export const kbService = {
  getKnowledgeBaseItems: async () => {
    const response = await axios.get(API_URL, { headers: getAuthHeaders() });
    return { items: response.data };
  },

  addKnowledgeBaseItem: async (payload) => {
    const response = await axios.post(API_URL, payload, { headers: getAuthHeaders() });
    return response.data;
  },

  deleteKnowledgeBaseItem: async (itemId) => {
    const response = await axios.delete(`${API_URL}/${itemId}`, { headers: getAuthHeaders() });
    return response.data;
  },

  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default kbService;
