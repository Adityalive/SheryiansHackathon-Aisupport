import axios from 'axios';

// Create an axios instance with the base URL for the backend
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Adjust if your backend runs on a different port
  headers: {
    'Content-Type': 'application/json',
  },
});

export const supportService = {
  /**
   * Send a message to the backend
   * @param {Object} payload 
   * @param {string} payload.message
   * @param {string} payload.tenantId
   * @param {string} payload.sessionId
   * @param {string} payload.customerName
   * @param {string} payload.customerEmail
   * @returns {Promise<Object>}
   */
  sendMessage: async (payload) => {
    const response = await api.post('/chat/message', payload);
    return response.data;
  },

  /**
   * Fetch a specific conversation by ID
   * @param {string} conversationId 
   * @returns {Promise<Object>}
   */
  getConversation: async (conversationId) => {
    const response = await api.get(`/chat/conversations/${conversationId}`);
    return response.data;
  },

  /**
   * Fetch all conversations for a specific tenant
   * @param {string} tenantId 
   * @returns {Promise<Object>}
   */
  getTenantConversations: async (tenantId) => {
    const response = await api.get(`/chat/tenants/${tenantId}/conversations`);
    return response.data;
  },

  getConversationMessages: async (conversationId, tenantId) => {
    const response = await api.get(`/chat/conversations/${conversationId}`, {
      params: { tenantId }
    });
    return response.data;
  },

  createTicket: async (payload) => {
    const response = await api.post('/voice/tickets', payload);
    return response.data;
  }
};

export default supportService;
