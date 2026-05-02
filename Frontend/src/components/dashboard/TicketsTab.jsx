import { useDashboardStore } from '../../store/useDashboardStore';
import { TicketCheck, MessageCircle, PhoneCall } from 'lucide-react';

const PRIORITY_STYLES = {
  urgent: 'text-red-600 bg-red-50',
  high: 'text-orange-600 bg-orange-50',
  medium: 'text-yellow-600 bg-yellow-50',
  low: 'text-green-600 bg-green-50',
};

const TicketsTab = ({ tenantId }) => {
  const { tickets, ticketLoading, resolveTicket } = useDashboardStore();

  if (ticketLoading) {
    return <div className="text-sm text-[#777586] py-4">Loading tickets...</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="bg-white border border-[#e1e3e4] rounded-lg p-6">
        <h2 className="text-base font-semibold text-[#191c1d] mb-1">Support Tickets</h2>
        <p className="text-sm text-[#777586] mb-5">Escalated conversations from voice and chat.</p>

        {tickets.length === 0 ? (
          <div className="text-center py-12 text-[#777586]">
            <TicketCheck size={36} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No open tickets! 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map(ticket => (
              <div key={ticket._id} className="border border-[#e1e3e4] rounded-md p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {ticket.channel === 'phone' || ticket.channel === 'voice'
                      ? <PhoneCall size={15} className="text-[#4338ca]" />
                      : <MessageCircle size={15} className="text-[#4338ca]" />
                    }
                    <span className="text-sm font-medium text-[#191c1d]">{ticket.subject}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${PRIORITY_STYLES[ticket.priority] || PRIORITY_STYLES.low}`}>
                      {ticket.priority}
                    </span>
                    {ticket.status !== 'resolved' ? (
                      <button
                        onClick={() => resolveTicket(ticket._id, tenantId)}
                        className="text-xs px-3 py-1 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded transition-colors"
                      >
                        Mark Resolved
                      </button>
                    ) : (
                      <span className="text-xs text-green-600 font-medium">✔ Resolved</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-[#777586]">
                  <span>📞 {ticket.customerPhone || ticket.customerEmail || 'Anonymous'}</span>
                  <span className="capitalize">Channel: {ticket.channel}</span>
                  <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                </div>
                {ticket.transcript && (
                  <p className="mt-2 text-xs text-[#464554] italic bg-[#f8f9fa] px-3 py-2 rounded border-l-2 border-[#e1e3e4]">
                    "{ticket.transcript}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsTab;
