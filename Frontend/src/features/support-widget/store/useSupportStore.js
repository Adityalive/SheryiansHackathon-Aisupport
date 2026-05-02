import { create } from 'zustand';
import supportService from '../apiservices/support.service';

// ── Helper: get/create a session ID persisted in localStorage ──
const getOrCreateSessionId = () => {
  let id = localStorage.getItem('support_session_id');
  if (!id) {
    id = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('support_session_id', id);
  }
  return id;
};

export const useSupportStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────
  isOpen: false,
  messages: [],
  isLoading: false,
  error: null,
  sessionId: getOrCreateSessionId(),
  tenantId: 'default-tenant',
  isVoiceMode: false,

  // ── Actions ───────────────────────────────────────

  /** Called once from App to inject the tenant ID */
  setTenantId: (id) => set({ tenantId: id }),

  toggleWidget: () => set((s) => ({ isOpen: !s.isOpen })),

  toggleVoiceMode: (val) =>
    set((s) => ({ isVoiceMode: val !== undefined ? val : !s.isVoiceMode })),

  sendMessage: async (text) => {
    if (!text.trim()) return;

    const { tenantId, sessionId } = get();

    // Optimistic user message
    const userMsg = { role: 'user', content: text, id: Date.now().toString() };
    set((s) => ({ messages: [...s.messages, userMsg], isLoading: true, error: null }));

    try {
      const response = await supportService.sendMessage({ message: text, tenantId, sessionId });

      if (response.assistantMessage) {
        const assistantMsg = {
          role: 'assistant',
          content: response.assistantMessage.content,
          id: (Date.now() + 1).toString(),
        };
        set((s) => ({ messages: [...s.messages, assistantMsg] }));
        return assistantMsg; // returned for voice TTS in MessageInput
      }
    } catch (err) {
      set({ error: err.message || 'Failed to send message.' });
      console.error('Chat error:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  generateTicket: async (reason = 'Manual user escalation') => {
    const { tenantId, sessionId, messages } = get();
    set({ isLoading: true });
    try {
      await supportService.createTicket({
        tenantId,
        conversationId: sessionId,
        channel: 'chat',
        transcript: messages.map((m) => `${m.role}: ${m.content}`).join('\n'),
        escalationReason: reason,
      });

      const confirmMsg = {
        role: 'assistant',
        content: "I've created a support ticket for you. An agent will review our conversation and get back to you soon!",
        id: Date.now().toString(),
      };
      set((s) => ({ messages: [...s.messages, confirmMsg] }));
    } catch (err) {
      console.error('Failed to create ticket:', err);
      set({ error: 'Failed to create ticket. Please try again.' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
