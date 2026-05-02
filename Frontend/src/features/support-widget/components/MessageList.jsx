import React, { useRef, useEffect } from 'react';
import { useSupportStore } from '../store/useSupportStore';

const MessageList = () => {
  const messages = useSupportStore((s) => s.messages);
  const isLoading = useSupportStore((s) => s.isLoading);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
