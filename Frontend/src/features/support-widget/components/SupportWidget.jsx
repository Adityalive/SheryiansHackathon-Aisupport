import React, { useState } from 'react';
import { MessageSquare, X, Ticket, Send } from 'lucide-react';
import { useSupportStore } from '../store/useSupportStore';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import '../styles/support-widget.css';

const SupportWidget = () => {
  const { isOpen, toggleWidget, error, generateTicket } = useSupportStore();
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketData, setTicketData] = useState({ name: '', email: '', phone: '' });

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    await generateTicket(`User requested human help via widget. Name: ${ticketData.name}, Email: ${ticketData.email}, Phone: ${ticketData.phone}`);
    setShowTicketForm(false);
    setTicketData({ name: '', email: '', phone: '' });
  };

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
                type="button"
                className="action-btn ticket-btn"
                onClick={() => setShowTicketForm(!showTicketForm)}
                title="Create Support Ticket"
              >
                <Ticket size={18} />
              </button>
              <button type="button" className="close-btn" onClick={toggleWidget}>
                <X size={20} />
              </button>
            </div>
          </div>

          {error && (
            <div className="support-error">{error}</div>
          )}

          <div className="support-body relative">
            {showTicketForm ? (
              <div className="absolute inset-0 bg-white z-10 p-5 flex flex-col h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-gray-800 text-sm">Create Support Ticket</h4>
                  <button
                    type="button"
                    onClick={() => setShowTicketForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-4">Please provide your details so our human team can reach out to you.</p>
                
                <form onSubmit={handleTicketSubmit} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                    <input 
                      type="text" 
                      required 
                      value={ticketData.name}
                      onChange={(e) => setTicketData({...ticketData, name: e.target.value})}
                      className="w-full text-sm p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500" 
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      required 
                      value={ticketData.email}
                      onChange={(e) => setTicketData({...ticketData, email: e.target.value})}
                      className="w-full text-sm p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500" 
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      required 
                      value={ticketData.phone}
                      onChange={(e) => setTicketData({...ticketData, phone: e.target.value})}
                      className="w-full text-sm p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500" 
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    Submit Ticket <Send size={14} />
                  </button>
                </form>
              </div>
            ) : (
              <MessageList />
            )}
          </div>

          {!showTicketForm && (
            <div className="support-footer">
              <MessageInput />
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        className={`support-fab ${isOpen ? 'open' : ''}`}
        onClick={toggleWidget}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default SupportWidget;
