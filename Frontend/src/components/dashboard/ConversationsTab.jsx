import { useDashboardStore } from "../../store/useDashboardStore";
import { MessageCircle, Trash2 } from "lucide-react";

const ConversationsTab = ({ tenantId }) => {
  const {
    conversations,
    selectedConversation,
    messages,
    convLoading,
    fetchMessages,
    setSelectedConversation,
    deleteConversation,
  } = useDashboardStore();

  const selectConv = (conv) => {
    setSelectedConversation(conv);
    fetchMessages(conv._id, tenantId);
  };

  const handleDelete = (e, convId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this chat?")) {
      deleteConversation(convId, tenantId);
    }
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      {/* Sidebar list */}
      <div className="w-64 bg-white border border-[#e1e3e4] rounded-lg flex flex-col flex-shrink-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-[#e1e3e4]">
          <h2 className="text-sm font-semibold text-[#191c1d]">Recent Chats</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {convLoading ? (
            <p className="text-sm text-[#777586] p-4">Loading...</p>
          ) : conversations.length === 0 ? (
            <p className="text-sm text-[#777586] p-4">No conversations yet.</p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv._id}
                onClick={() => selectConv(conv)}
                className={`w-full text-left px-4 py-3 border-b border-[#f3f4f5] transition-colors relative group ${
                  selectedConversation?._id === conv._id
                    ? "bg-[#eef2ff]"
                    : "hover:bg-[#f8f9fa]"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="text-sm font-medium text-[#191c1d] truncate flex-1 pr-4">
                    {conv.customerName || "Anonymous User"}
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, conv._id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50"
                    title="Remove chat"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[10px] text-[#777586]">
                    {new Date(conv.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="text-[10px] bg-[#f3f4f5] text-[#464554] px-1.5 py-0.5 rounded capitalize">
                    {conv.channel}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Message view */}
      <div className="flex-1 bg-white border border-[#e1e3e4] rounded-lg flex flex-col overflow-hidden">
        {selectedConversation ? (
          <>
            <div className="px-5 py-3 border-b border-[#e1e3e4]">
              <h3 className="text-sm font-semibold text-[#191c1d]">
                Chat with {selectedConversation.customerName || "Anonymous"}
              </h3>
              <p className="text-xs text-[#777586]">
                {selectedConversation.customerEmail || "No email provided"}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                      msg.role === "user"
                        ? "bg-[#4338ca] text-white"
                        : "bg-[#f3f4f5] text-[#191c1d]"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p
                      className={`text-[10px] mt-1 ${msg.role === "user" ? "text-indigo-200" : "text-[#777586]"}`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#777586]">
            <MessageCircle size={36} className="mb-2 opacity-40" />
            <p className="text-sm">Select a conversation to view history</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsTab;
