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

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const tenantId = tenant?._id || tenant?.id || tenant?.slug || '';

  useEffect(() => {
    if (activeTab === 'overview') fetchAnalytics(tenantId);
    if (activeTab === 'kb') fetchKbItems(tenantId);
    if (activeTab === 'conversations') fetchConversations(tenantId);
    if (activeTab === 'tickets') fetchTickets(tenantId);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'profile': return <ProfileTab user={user} tenant={tenant} />;
      case 'widget': return <WidgetTab tenantId={tenantId} tenantSlug={tenant?.slug} />;
      case 'kb': return <KnowledgeBaseTab tenantId={tenantId} />;
      case 'conversations': return <ConversationsTab tenantId={tenantId} />;
      case 'tickets': return <TicketsTab tenantId={tenantId} />;
      case 'voice': return <VoiceTab tenantSlug={tenant?.slug} />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa] overflow-hidden">
      <Sidebar tenantName={tenant?.name} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="h-14 bg-white border-b border-[#e1e3e4] flex items-center px-6 flex-shrink-0">
          <div>
            <h1 className="text-sm font-semibold text-[#191c1d] capitalize">{activeTab === 'kb' ? 'Knowledge Base' : activeTab === 'overview' ? 'Overview' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <p className="text-xs text-[#777586]">Manage AI Support for {tenant?.name}</p>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
