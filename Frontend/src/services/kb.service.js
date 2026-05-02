import axios from 'axios';

const API_URL = 'http://localhost:3000/api/chat/tenants';

export const kbService = {
  getKnowledgeBaseItems: async (tenantId) => {
    const response = await axios.get(`${API_URL}/${tenantId}/knowledge-base`);
    return response.data;
  },

  addKnowledgeBaseItem: async (tenantId, payload) => {
    const response = await axios.post(`${API_URL}/${tenantId}/knowledge-base`, payload);
    return response.data;
  },

  deleteKnowledgeBaseItem: async (tenantId, itemId) => {
    const response = await axios.delete(`${API_URL}/${tenantId}/knowledge-base/${itemId}`);
    return response.data;
  }
};

export default kbService;
