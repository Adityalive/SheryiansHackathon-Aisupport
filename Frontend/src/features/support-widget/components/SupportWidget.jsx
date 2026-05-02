import React from 'react';
import { MessageSquare, X, Ticket } from 'lucide-react';
import { useSupport } from '../hooks/useSupport';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import '../styles/support-widget.css';

const SupportWidget = () => {
  const { isOpen, toggleWidget, error, generateTicket } = useSupport();

  return (
    <div className="support-widget-container">
      {isOpen && (
        <div className="support-window">
          <div className="support-header">
            <div className="header-info">
              <h3>AI Support</h3>
              <p>We typically reply in minutes</p>
            </div>
            <div className="header-actions">
              <button 
                className="action-btn ticket-btn" 
                onClick={() => generateTicket('User requested human help via widget')}
                title="Create Support Ticket"
              >
                <Ticket size={18} />
              </button>
              <button className="close-btn" onClick={toggleWidget}>
                <X size={20} />
              </button>
            </div>
          </div>
          
          {error && (
            <div className="support-error">
              {error}
            </div>
          )}

          <div className="support-body">
            <MessageList />
          </div>
          
          <div className="support-footer">
            <MessageInput />
          </div>
        </div>
      )}
      
      <button 
        className={`support-fab ${isOpen ? 'open' : ''}`} 
        onClick={toggleWidget}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default SupportWidget;
