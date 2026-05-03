import { create } from 'zustand';
import axios from 'axios';
import kbService from '../services/kb.service';
import supportService from '../features/support-widget/apiservices/support.service';

const API_BASE = 'http://localhost:3000/api';

export const useDashboardStore = create((set, get) => ({
  // Active tab
  activeTab: 'overview',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Analytics / Overview
  stats: null,
  statsLoading: false,
  fetchAnalytics: async (tenantId) => {
    set({ statsLoading: true });
    try {
      const { data } = await axios.get(`${API_BASE}/analytics/tenants/${tenantId}`);
      set({ stats: data.stats });
    } catch (e) {
      console.error('Failed to fetch analytics', e);
    } finally {
      set({ statsLoading: false });
    }
  },

  // Knowledge Base
  kbItems: [],
  kbLoading: false,
  kbTab: 'faq',
  setKbTab: (tab) => set({ kbTab: tab }),
  faqForm: { title: '', question: '', answer: '', tags: '' },
  pdfForm: { title: '', content: '', tags: '' },
  setFaqForm: (form) => set({ faqForm: form }),
  setPdfForm: (form) => set({ pdfForm: form }),
  formStatus: { loading: false, error: null, success: null },
  setFormStatus: (status) => set({ formStatus: status }),

  fetchKbItems: async (tenantId) => {
    set({ kbLoading: true });
    try {
      const data = await kbService.getKnowledgeBaseItems(tenantId);
      set({ kbItems: data.items || [] });
    } catch (e) {
      console.error('Failed to fetch KB items', e);
    } finally {
      set({ kbLoading: false });
    }
  },

  addFaq: async (tenantId) => {
    const { faqForm, fetchKbItems } = get();
    set({ formStatus: { loading: true, error: null, success: null } });
    try {
      await kbService.addKnowledgeBaseItem(tenantId, {
        type: 'faq',
        title: faqForm.title,
        question: faqForm.question,
        answer: faqForm.answer,
        content: faqForm.answer,
        tags: faqForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      set({
        formStatus: { loading: false, error: null, success: 'FAQ added successfully!' },
        faqForm: { title: '', question: '', answer: '', tags: '' },
      });
      fetchKbItems(tenantId);
    } catch (err) {
      set({ formStatus: { loading: false, error: err.response?.data?.message || 'Failed to add FAQ', success: null } });
    }
  },

  addDocument: async (tenantId) => {
    const { pdfForm, fetchKbItems } = get();
    set({ formStatus: { loading: true, error: null, success: null } });
    try {
      await kbService.addKnowledgeBaseItem(tenantId, {
        type: 'document',
        title: pdfForm.title,
        content: pdfForm.content,
        tags: pdfForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      set({
        formStatus: { loading: false, error: null, success: 'Document added successfully!' },
        pdfForm: { title: '', content: '', tags: '' },
      });
      fetchKbItems(tenantId);
    } catch (err) {
      set({ formStatus: { loading: false, error: err.response?.data?.message || 'Failed to add document', success: null } });
    }
  },

  saveBusinessProfile: async (tenantId, profileFields) => {
    set({ formStatus: { loading: true, error: null, success: null } });
    try {
      const entries = Object.entries(profileFields || {}).filter(([, value]) =>
        String(value || '').trim(),
      );

      await Promise.all(
        entries.map(async ([label, value]) => {
          const currentItems = get().kbItems || [];
          const existingItems = currentItems.filter(
            (item) => item.title === label || item.question === label,
          );

          await Promise.all(
            existingItems.map((item) =>
              kbService.deleteKnowledgeBaseItem(tenantId, item._id),
            ),
          );

          await kbService.addKnowledgeBaseItem(tenantId, {
            type: 'faq',
            title: label,
            question: label,
            answer: value,
            content: value,
            tags: ['business_profile'],
          });
        }),
      );

      set({
        formStatus: {
          loading: false,
          error: null,
          success: 'Business profile saved successfully!',
        },
      });
      get().fetchKbItems(tenantId);
    } catch (err) {
      set({
        formStatus: {
          loading: false,
          error: err.response?.data?.message || 'Failed to save business profile',
          success: null,
        },
      });
    }
  },

  deleteKbItem: async (tenantId, itemId) => {
    try {
      await kbService.deleteKnowledgeBaseItem(tenantId, itemId);
      get().fetchKbItems(tenantId);
    } catch {
      alert('Failed to delete item');
    }
  },

  // Conversations
  conversations: [],
  selectedConversation: null,
  messages: [],
  convLoading: false,
  setSelectedConversation: (conv) => set({ selectedConversation: conv }),

  fetchConversations: async (tenantId) => {
    set({ convLoading: true });
    try {
      const data = await supportService.getTenantConversations(tenantId);
      set({ conversations: data.conversations || [] });
    } catch (e) {
      console.error('Failed to fetch conversations', e);
    } finally {
      set({ convLoading: false });
    }
  },

  fetchMessages: async (convId, tenantId) => {
    try {
      const data = await supportService.getConversationMessages(convId, tenantId);
      set({ messages: data.messages || [] });
    } catch (e) {
      console.error('Failed to fetch messages', e);
    }
  },

  deleteConversation: async (convId, tenantId) => {
    try {
      await supportService.deleteConversation(convId, tenantId);
      const { selectedConversation } = get();
      if (selectedConversation?._id === convId) {
        set({ selectedConversation: null, messages: [] });
      }
      get().fetchConversations(tenantId);
    } catch (e) {
      console.error('Failed to delete conversation', e);
      alert('Failed to delete conversation');
    }
  },

  // Tickets
  tickets: [],
  ticketLoading: false,
  selectedTicket: null,

  fetchTickets: async (tenantId) => {
    set({ ticketLoading: true });
    try {
      const { data } = await axios.get(`${API_BASE}/voice/tenants/${tenantId}/tickets`);
      set({ tickets: data.tickets || [] });
    } catch (e) {
      console.error('Failed to fetch tickets', e);
    } finally {
      set({ ticketLoading: false });
    }
  },

  resolveTicket: async (ticketId, tenantId) => {
    try {
      await axios.patch(`${API_BASE}/voice/tickets/${ticketId}`, { status: 'resolved' });
      get().fetchTickets(tenantId);
    } catch (e) {
      console.error('Failed to resolve ticket', e);
    }
  },

  deleteTicket: async (ticketId, tenantId) => {
    try {
      if (!window.confirm('Are you sure you want to delete this ticket?')) return;
      await axios.delete(`${API_BASE}/voice/tickets/${ticketId}`);
      get().fetchTickets(tenantId);
    } catch (e) {
      console.error('Failed to delete ticket', e);
      alert(e.response?.data?.message || 'Failed to delete ticket');
    }
  },
}));
