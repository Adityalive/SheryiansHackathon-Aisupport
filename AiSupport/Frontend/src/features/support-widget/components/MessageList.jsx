import React, { useRef, useEffect } from 'react';
import { useSupport } from '../hooks/useSupport';

const MessageList = () => {
  const { messages, isLoading } = useSupport();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="support-message-list">
      {messages.length === 0 ? (
        <div className="support-empty-state">
          <p>Hi there! How can we help you today?</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`support-message ${msg.role === 'user' ? 'message-user' : 'message-assistant'}`}
          >
            <div className="message-bubble">{msg.content}</div>
          </div>
        ))
      )}
      {isLoading && (
        <div className="support-message message-assistant">
          <div className="message-bubble loading-dots">
            <span>.</span><span>.</span><span>.</span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
