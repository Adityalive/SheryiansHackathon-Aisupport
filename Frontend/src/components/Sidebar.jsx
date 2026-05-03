import { useAuthStore } from "../store/useAuthStore";
import { useDashboardStore } from "../store/useDashboardStore";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Settings,
  Database,
  MessageCircle,
  TicketCheck,
  PhoneCall,
  LogOut,
  Zap,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "Business Profile", icon: User },
  { id: "widget", label: "Widget Setup", icon: Settings },
  { id: "conversations", label: "Conversations", icon: MessageCircle },
  { id: "tickets", label: "Support Tickets", icon: TicketCheck },
  { id: "kb", label: "Knowledge Base", icon: Database },
  { id: 'voice', label: 'Voice AI', icon: PhoneCall },
];

const Sidebar = ({ tenantName }) => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const { activeTab, setActiveTab } = useDashboardStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-56 bg-white border-r border-[#e1e3e4] flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2 px-4 border-b border-[#e1e3e4]">
        <div className="w-7 h-7 bg-[#4338ca] rounded-md flex items-center justify-center flex-shrink-0">
          <Zap size={15} className="text-white" />
        </div>
        <span className="font-semibold text-sm text-[#191c1d] truncate">
          SupportAI
        </span>
      </div>

      {/* Tenant label */}
      <div className="px-4 py-3 border-b border-[#e1e3e4]">
        <p className="text-[10px] font-medium uppercase tracking-widest text-[#777586]">
          Workspace
        </p>
        <p className="text-xs font-medium text-[#191c1d] truncate mt-0.5">
          {tenantName || "Loading..."}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors text-left ${
              activeTab === id
                ? "bg-[#eef2ff] text-[#4338ca] font-medium"
                : "text-[#464554] hover:bg-[#f3f4f5]"
            }`}
          >
            <Icon size={16} className="flex-shrink-0" />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-[#e1e3e4]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#777586] hover:text-[#191c1d] hover:bg-[#f3f4f5] rounded-md transition-colors"
        >
          <LogOut size={15} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
