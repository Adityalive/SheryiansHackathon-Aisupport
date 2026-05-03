import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useDashboardStore } from '../store/useDashboardStore';
import Sidebar from '../components/Sidebar';
import OverviewTab from '../components/dashboard/OverviewTab';
import ProfileTab from '../components/dashboard/ProfileTab';
import WidgetTab from '../components/dashboard/WidgetTab';
import KnowledgeBaseTab from '../components/dashboard/KnowledgeBaseTab';
import ConversationsTab from '../components/dashboard/ConversationsTab';
import TicketsTab from '../components/dashboard/TicketsTab';
import VoiceTab from '../components/dashboard/VoiceTab';

const Dashboard = () => {
  const { user, tenant, isAuthenticated } = useAuthStore();
  const { activeTab, fetchAnalytics, fetchKbItems, fetchConversations, fetchTickets } = useDashboardStore();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const tenantId = tenant?._id || tenant?.id || tenant?.slug || '';

  useEffect(() => {
    if (activeTab === 'overview') fetchAnalytics(tenantId);
    if (activeTab === 'kb') fetchKbItems(tenantId);
    if (activeTab === 'conversations') fetchConversations(tenantId);
    if (activeTab === 'tickets') fetchTickets(tenantId);
    // Close sidebar on mobile when tab changes
    setSidebarOpen(false);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'profile': return <ProfileTab user={user} tenant={tenant} tenantId={tenantId} />;
      case 'widget': return <WidgetTab tenantId={tenantId} tenantSlug={tenant?.slug} />;
      case 'kb': return <KnowledgeBaseTab tenantId={tenantId} />;
      case 'conversations': return <ConversationsTab tenantId={tenantId} />;
      case 'tickets': return <TicketsTab tenantId={tenantId} />;
      case 'voice': return <VoiceTab tenantSlug={tenant?.slug} />;
      default: return <OverviewTab />;
    }
  };

  const currentTabLabel = activeTab === 'kb' ? 'Knowledge Base' : activeTab === 'overview' ? 'Overview' : activeTab.replace(/([A-Z])/g, ' $1').trim();

  return (
    <div className="flex h-screen bg-[#f8f9fa] overflow-hidden relative">
      {/* Sidebar Overlay (Mobile Only) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar tenantName={tenant?.name} />
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-[#e1e3e4] flex items-center px-4 md:px-6 flex-shrink-0 gap-4">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-[#464554] lg:hidden hover:bg-slate-50 rounded-lg transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 5H17.5M2.5 10H17.5M2.5 15H17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="min-w-0">
            <h1 className="text-sm font-bold text-[#191c1d] capitalize truncate">{currentTabLabel}</h1>
            <p className="text-[10px] md:text-xs text-[#777586] truncate">Support for {tenant?.name}</p>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
