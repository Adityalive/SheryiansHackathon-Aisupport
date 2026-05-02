import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { User, Settings, Database, Plus, FileText, HelpCircle, Trash2, MessageCircle, TicketCheck, PhoneCall, AlertCircle, Copy, Check, LayoutDashboard } from 'lucide-react';
import axios from 'axios';
import DashboardOverview from '../features/dashboard/components/DashboardOverview';
import authService from '../services/auth.service';
import kbService from '../services/kb.service';
import supportService from '../features/support-widget/apiservices/support.service';
import './Dashboard.css';

const Dashboard = () => {
  const currentUser = authService.getCurrentUser();
  const [activeTab, setActiveTab] = useState('overview');
  
  // KB States
  const [kbItems, setKbItems] = useState([]);
  const [kbLoading, setKbLoading] = useState(false);
  const [kbTab, setKbTab] = useState('faq');
  const [faqForm, setFaqForm] = useState({ title: '', question: '', answer: '', tags: '' });
  const [pdfForm, setPdfForm] = useState({ title: '', content: '', tags: '' });
  const [formStatus, setFormStatus] = useState({ loading: false, error: null, success: null });

  // Conversation States
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [convLoading, setConvLoading] = useState(false);

  // Ticket States
  const [tickets, setTickets] = useState([]);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Protect the route
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const { user, tenant } = currentUser;
  const tenantId = tenant._id || tenant.id || tenant.slug;

  // Analytics State
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setStatsLoading(true);
      const { data } = await axios.get(`http://localhost:3000/api/analytics/tenants/${tenantId}`);
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchKbItems = async () => {
    try {
      setKbLoading(true);
      const data = await kbService.getKnowledgeBaseItems(tenantId);
      setKbItems(data.items || []);
    } catch (error) {
      console.error("Failed to fetch KB items", error);
    } finally {
      setKbLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      setConvLoading(true);
      const data = await supportService.getTenantConversations(tenantId);
      setConversations(data.conversations || []);
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    } finally {
      setConvLoading(false);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      const data = await supportService.getConversationMessages(convId, tenantId);
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  const fetchTickets = async () => {
    try {
      setTicketLoading(true);
      const { data } = await axios.get(`http://localhost:3000/api/voice/tenants/${tenantId}/tickets`);
      setTickets(data.tickets || []);
    } catch (error) {
      console.error('Failed to fetch tickets', error);
    } finally {
      setTicketLoading(false);
    }
  };

  const resolveTicket = async (ticketId) => {
    try {
      await axios.patch(`http://localhost:3000/api/voice/tickets/${ticketId}`, { status: 'resolved' });
      fetchTickets();
    } catch (error) {
      console.error('Failed to resolve ticket', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') fetchAnalytics();
    if (activeTab === 'kb') fetchKbItems();
    if (activeTab === 'conversations') fetchConversations();
    if (activeTab === 'tickets') fetchTickets();
  }, [activeTab]);

  const handleAddFaq = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, error: null, success: null });
    try {
      await kbService.addKnowledgeBaseItem(tenantId, {
        type: 'faq',
        title: faqForm.title,
        question: faqForm.question,
        answer: faqForm.answer,
        content: faqForm.answer,
        tags: faqForm.tags.split(',').map(t => t.trim()).filter(t => t),
      });
      setFormStatus({ loading: false, error: null, success: 'FAQ added successfully!' });
      setFaqForm({ title: '', question: '', answer: '', tags: '' });
      fetchKbItems();
    } catch (err) {
      setFormStatus({ loading: false, error: err.response?.data?.message || 'Failed to add FAQ', success: null });
    }
  };

  const handleAddPdf = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, error: null, success: null });
    try {
      await kbService.addKnowledgeBaseItem(tenantId, {
        type: 'pdf',
        title: pdfForm.title,
        content: pdfForm.content,
        tags: pdfForm.tags.split(',').map(t => t.trim()).filter(t => t),
      });
      setFormStatus({ loading: false, error: null, success: 'Document added successfully!' });
      setPdfForm({ title: '', content: '', tags: '' });
      fetchKbItems();
    } catch (err) {
      setFormStatus({ loading: false, error: err.response?.data?.message || 'Failed to add Document', success: null });
    }
  };

  const handleDeleteKbItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this knowledge item?')) return;
    try {
      await kbService.deleteKnowledgeBaseItem(tenantId, itemId);
      fetchKbItems();
    } catch (error) {
      alert('Failed to delete item');
    }
  };

  const selectConversation = (conv) => {
    setSelectedConversation(conv);
    fetchMessages(conv._id);
  };

  const renderContent = () => {
    if (activeTab === 'overview') {
      return <DashboardOverview stats={stats} />;
    }

    if (activeTab === 'profile') {
      return (
        <div className="dashboard-card">
          <h3>Business Profile</h3>
          <div className="profile-section">
            <div className="profile-avatar-container">
              <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
              <strong>{user.name}</strong>
              <span className="badge">{user.accountType}</span>
            </div>
            <div className="profile-details">
              <div className="detail-item"><span className="detail-label">Business Name</span><span className="detail-value">{tenant.name}</span></div>
              <div className="detail-item"><span className="detail-label">Business ID (Slug)</span><span className="detail-value"><code>{tenant.slug}</code></span></div>
              <div className="detail-item"><span className="detail-label">Email Address</span><span className="detail-value">{user.email}</span></div>
              <div className="detail-item"><span className="detail-label">Subscription Plan</span><span className="detail-value" style={{textTransform: 'capitalize'}}>{user.subscriptionLevel}</span></div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'widget') {
      return (
        <div className="dashboard-card">
          <h3>Widget Configuration</h3>
          <p>To connect the chat widget on your website, use the following Tenant ID.</p>
          <div className="tenant-id-box"><code>{tenantId}</code></div>
          <p style={{ color: '#64748b' }}>Pass this ID to your <code>SupportProvider</code>.</p>
        </div>
      );
    }

    if (activeTab === 'kb') {
      return (
        <div className="dashboard-card">
          <h3>Knowledge Base</h3>
          <div className="kb-tabs">
            <button className={`kb-tab ${kbTab === 'faq' ? 'active' : ''}`} onClick={() => setKbTab('faq')}><HelpCircle size={16} style={{marginRight: '6px'}}/> Add FAQ</button>
            <button className={`kb-tab ${kbTab === 'pdf' ? 'active' : ''}`} onClick={() => setKbTab('pdf')}><FileText size={16} style={{marginRight: '6px'}}/> Add Document</button>
          </div>

          {formStatus.error && <div className="auth-error" style={{marginBottom: '1rem'}}>{formStatus.error}</div>}
          {formStatus.success && <div className="auth-error" style={{marginBottom: '1rem', backgroundColor: '#dcfce3', color: '#166534', borderColor: '#bbf7d0'}}>{formStatus.success}</div>}

          {kbTab === 'faq' ? (
            <form onSubmit={handleAddFaq}>
              <div className="form-group"><label>Category / Title</label><input required value={faqForm.title} onChange={e => setFaqForm({...faqForm, title: e.target.value})} placeholder="e.g. Shipping" /></div>
              <div className="form-group"><label>Question</label><input required value={faqForm.question} onChange={e => setFaqForm({...faqForm, question: e.target.value})} placeholder="e.g. How long does shipping take?" /></div>
              <div className="form-group"><label>Answer</label><textarea required value={faqForm.answer} onChange={e => setFaqForm({...faqForm, answer: e.target.value})} placeholder="e.g. 3-5 days." /></div>
              <div className="form-group"><label>Tags (comma separated)</label><input value={faqForm.tags} onChange={e => setFaqForm({...faqForm, tags: e.target.value})} placeholder="e.g. shipping, policy, help" /></div>
              <button type="submit" className="btn btn-primary" disabled={formStatus.loading}><Plus size={16}/> {formStatus.loading ? 'Adding...' : 'Add FAQ'}</button>
            </form>
          ) : (
            <form onSubmit={handleAddPdf}>
              <div className="form-group"><label>Document Title</label><input required value={pdfForm.title} onChange={e => setPdfForm({...pdfForm, title: e.target.value})} placeholder="e.g. Refund Policy 2024" /></div>
              <div className="form-group"><label>Document Text</label><textarea required value={pdfForm.content} onChange={e => setPdfForm({...pdfForm, content: e.target.value})} placeholder="Paste content here..." /></div>
              <div className="form-group"><label>Tags (comma separated)</label><input value={pdfForm.tags} onChange={e => setPdfForm({...pdfForm, tags: e.target.value})} placeholder="e.g. policy, returns" /></div>
              <button type="submit" className="btn btn-primary" disabled={formStatus.loading}><Plus size={16}/> {formStatus.loading ? 'Adding...' : 'Add Document'}</button>
            </form>
          )}

          <h3 style={{ marginTop: '3rem' }}>Existing Knowledge Base</h3>
          <div className="kb-list">
            {kbLoading ? <p>Loading...</p> : kbItems.map(item => (
              <div key={item._id} className="kb-item">
                <div className="kb-item-header">
                  <div><h4>{item.title}</h4><span className="kb-type-badge">{item.type}</span></div>
                  <button className="kb-delete-btn" onClick={() => handleDeleteKbItem(item._id)}><Trash2 size={18} /></button>
                </div>
                {item.question && <p><strong>Q:</strong> {item.question}</p>}
                <p><strong>Content:</strong> {item.answer || (item.content?.substring(0, 150) + '...')}</p>
                {item.tags?.length > 0 && <div style={{marginTop: '0.5rem', display: 'flex', gap: '5px'}}>{item.tags.map(t => <span key={t} className="badge" style={{fontSize: '0.7rem', padding: '2px 8px'}}>{t}</span>)}</div>}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'tickets') {
      const priorityColor = { urgent: '#ef4444', high: '#f97316', medium: '#eab308', low: '#22c55e' };
      return (
        <div className="dashboard-card">
          <h3>Support Tickets</h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Escalated conversations from voice and chat. Resolve them once handled.</p>
          {ticketLoading ? <p>Loading tickets...</p> : tickets.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem 0' }}>
              <TicketCheck size={48} style={{ margin: '0 auto 1rem' }} />
              <p>No open tickets yet! 🎉</p>
            </div>
          ) : (
            <div className="ticket-list">
              {tickets.map(ticket => (
                <div key={ticket._id} className="ticket-item">
                  <div className="ticket-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {ticket.channel === 'phone' || ticket.channel === 'voice' ? <PhoneCall size={18} color="#6366f1" /> : <MessageCircle size={18} color="#6366f1" />}
                      <strong>{ticket.subject}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ background: priorityColor[ticket.priority] + '22', color: priorityColor[ticket.priority], padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>{ticket.priority.toUpperCase()}</span>
                      {ticket.status !== 'resolved' && <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => resolveTicket(ticket._id)}>Mark Resolved</button>}
                      {ticket.status === 'resolved' && <span style={{ color: '#22c55e', fontSize: '0.8rem', fontWeight: 600 }}>✔ Resolved</span>}
                    </div>
                  </div>
                  <div className="ticket-meta">
                    <span>📞 {ticket.customerPhone || ticket.customerEmail || 'Anonymous'}</span>
                    <span>Channel: {ticket.channel}</span>
                    <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                  </div>
                  {ticket.transcript && <p className="ticket-transcript">"{ticket.transcript}"</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'voice') {
      const webhookUrl = `https://curvy-jobs-clean.loca.lt/api/voice/twilio/incoming?tenantId=${tenant.slug || 'default-tenant'}`;
      
      return (
        <div className="dashboard-card">
          <div className="voice-settings-header">
            <div className="icon-badge"><PhoneCall size={24} color="#6366f1" /></div>
            <div>
              <h3>Voice & Phone Configuration</h3>
              <p>Manage your AI voice agent and Twilio integration</p>
            </div>
          </div>

          <div className="voice-grid">
            <div className="voice-main">
              <div className="config-section">
                <label>Incoming Phone Number</label>
                <div className="phone-display">
                  <span>+1 (XXX) XXX-XXXX</span>
                  <span className="status-pill active">Connected</span>
                </div>
              </div>

              <div className="config-section">
                <label>Voice Webhook URL</label>
                <p className="section-hint">Paste this URL into your Twilio Console under "A Call Comes In"</p>
                <div className="copy-box">
                  <input type="text" readOnly value={webhookUrl} />
                  <button className="btn-copy" onClick={() => {
                    navigator.clipboard.writeText(webhookUrl);
                    alert('Copied to clipboard!');
                  }}>
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className="config-section">
                <label>AI Voice Persona</label>
                <div className="voice-selector">
                  <div className="voice-option active">
                    <Check size={16} className="check" />
                    <strong>Polly Joanna</strong>
                    <span>Female • Natural US English</span>
                  </div>
                  <div className="voice-option" onClick={() => alert('ElevenLabs integration coming soon!')}>
                    <strong>ElevenLabs Premium</strong>
                    <span>Human-like • Custom Voices</span>
                  </div>
                </div>
              </div>
            </div>

            <aside className="voice-stats">
              <div className="stat-card">
                <label>Voice Calls Today</label>
                <div className="stat-value">0</div>
              </div>
              <div className="stat-card">
                <label>AI Resolution Rate</label>
                <div className="stat-value">0%</div>
              </div>
              <div className="stat-card">
                <label>Avg. Call Duration</label>
                <div className="stat-value">0m 0s</div>
              </div>
            </aside>
          </div>
        </div>
      );
    }

    if (activeTab === 'conversations') {
      return (
        <div className="conv-container">
          <div className="conv-sidebar">
            <div className="conv-sidebar-header"><h3>Recent Chats</h3></div>
            <div className="conv-list">
              {convLoading ? <p style={{padding: '1rem'}}>Loading...</p> : conversations.length === 0 ? <p style={{padding: '1rem', color: '#94a3b8'}}>No chats yet.</p> :
                conversations.map(conv => (
                  <div key={conv._id} className={`conv-list-item ${selectedConversation?._id === conv._id ? 'active' : ''}`} onClick={() => selectConversation(conv)}>
                    <span className="conv-item-name">{conv.customerName || 'Anonymous User'}</span>
                    <div className="conv-item-meta">
                      <span>{new Date(conv.updatedAt).toLocaleDateString()}</span>
                      <span>{conv.channel}</span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
          <div className="conv-main">
            {selectedConversation ? (
              <>
                <div className="conv-main-header">
                  <h4>Chat with {selectedConversation.customerName || 'Anonymous'}</h4>
                  <span style={{fontSize: '0.8rem', color: '#64748b'}}>{selectedConversation.customerEmail || 'No email provided'}</span>
                </div>
                <div className="conv-messages">
                  {messages.map((msg, i) => (
                    <div key={i} className={`conv-msg ${msg.role}`}>
                      {msg.content}
                      <div style={{fontSize: '0.65rem', marginTop: '0.4rem', opacity: 0.7}}>
                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="conv-empty">
                <MessageCircle size={48} />
                <p>Select a conversation to view history</p>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}><LayoutDashboard size={20} /><span>Overview</span></div>
        <div className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}><User size={20} /><span>Profile</span></div>
        <div className={`sidebar-item ${activeTab === 'widget' ? 'active' : ''}`} onClick={() => setActiveTab('widget')}><Settings size={20} /><span>Widget Setup</span></div>
        <div className={`sidebar-item ${activeTab === 'kb' ? 'active' : ''}`} onClick={() => setActiveTab('kb')}><Database size={20} /><span>Knowledge Base</span></div>
        <div className={`sidebar-item ${activeTab === 'conversations' ? 'active' : ''}`} onClick={() => setActiveTab('conversations')}><MessageCircle size={20} /><span>Conversations</span></div>
        <div className={`sidebar-item ${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => setActiveTab('tickets')}><TicketCheck size={20} /><span>Support Tickets</span></div>
        <div className={`sidebar-item ${activeTab === 'voice' ? 'active' : ''}`} onClick={() => setActiveTab('voice')}><PhoneCall size={20} /><span>Voice</span></div>
      </aside>
      <main className="dashboard-main">
        <div className="dashboard-header"><h1>Dashboard</h1><p>Manage AI Support for {tenant.name}</p></div>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
