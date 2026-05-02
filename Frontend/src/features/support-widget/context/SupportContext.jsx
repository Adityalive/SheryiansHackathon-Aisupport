import React, { createContext, useState, useEffect, useCallback } from 'react';
import supportService from '../apiservices/support.service';

import { SupportContext } from './SupportContextObject';

export const SupportProvider = ({ children, tenantId = 'default-tenant' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  // Initialize a session ID if not exists
  useEffect(() => {
    const existingSessionId = localStorage.getItem('support_session_id');
    if (existingSessionId) {
      setSessionId(existingSessionId);
    } else {
      const newSessionId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('support_session_id', newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  const toggleWidget = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    // Add user message to UI optimistically
    const userMessage = { role: 'user', content: text, id: Date.now().toString() };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await supportService.sendMessage({
        message: text,
        tenantId,
        sessionId,
      });

      // Backend returns assistantMessage, add it to the state
      if (response.assistantMessage) {
        const assistantMessage = { role: 'assistant', content: response.assistantMessage.content, id: Date.now().toString() };
        setMessages((prev) => [...prev, assistantMessage]);
        return assistantMessage; // Return the message object for voice playback
      }
    } catch (err) {
      setError(err.message || 'Failed to send message.');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, sessionId]);

  const toggleVoiceMode = useCallback((val) => {
    setIsVoiceMode(val !== undefined ? val : (prev) => !prev);
  }, []);

  const generateTicket = useCallback(async (reason = 'Manual user escalation') => {
    setIsLoading(true);
    try {
      await supportService.createTicket({
        tenantId,
        conversationId: sessionId,
        channel: 'chat',
        transcript: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
        escalationReason: reason
      });

      setMessages((prev) => [
        ...prev,
        { 
          role: 'assistant', 
          content: "I've created a support ticket for you. An agent will review our conversation and get back to you soon!", 
          id: Date.now().toString() 
        }
      ]);
    } catch (err) {
      console.error('Failed to create ticket:', err);
      setError('Failed to create ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, sessionId, messages]);

  return (
    <SupportContext.Provider
      value={{
        isOpen,
        toggleWidget,
        messages,
        sendMessage,
        isLoading,
        error,
        tenantId,
        isVoiceMode,
        toggleVoiceMode,
        generateTicket
      }}
    >
      {children}
    </SupportContext.Provider>
  );
};
