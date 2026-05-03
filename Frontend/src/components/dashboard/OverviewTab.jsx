import { useDashboardStore } from "../../store/useDashboardStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { MessageSquare, Phone, CheckCircle, Users } from "lucide-react";

const COLORS = ["#4338ca", "#6366f1", "#a5b4fc", "#c7d2fe"];

const MetricCard = ({
  icon: Icon,
  label,
  value,
  badge,
  badgeColor = "text-green-600 bg-green-50",
}) => (
  <div className="bg-white border border-[#e1e3e4] rounded-lg p-5">
    <div className="flex items-start justify-between mb-3">
      <div className="w-9 h-9 bg-[#eef2ff] rounded-md flex items-center justify-center">
        <Icon size={18} className="text-[#4338ca]" />
      </div>
      <span
        className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColor}`}
      >
        {badge}
      </span>
    </div>
    <div className="text-2xl font-bold text-[#191c1d]">{value}</div>
    <div className="text-xs text-[#777586] mt-0.5">{label}</div>
  </div>
);

const OverviewTab = () => {
  const { stats, statsLoading } = useDashboardStore();

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-[#777586]">Loading insights...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-[#777586]">No analytics data yet.</div>
      </div>
    );
  }

  const { overview, distribution, trends, topQuestions } = stats;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        <MetricCard
          icon={MessageSquare}
          label="Total Conversations"
          value={overview.totalConversations}
          badge="+12%"
        />
        <MetricCard
          icon={CheckCircle}
          label="AI Resolution Rate"
          value={`${overview.resolutionRate}%`}
          badge="High"
        />
        <MetricCard
          icon={Users}
          label="Active Customers"
          value={overview.activeUsers}
          badge="Stable"
          badgeColor="text-[#464554] bg-[#f3f4f5]"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Area chart - takes 2 cols */}
        <div className="xl:col-span-2 bg-white border border-[#e1e3e4] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-[#191c1d]">Conversation Trends</h3>
              <p className="text-xs text-[#777586]">Daily volume for the last 7 days</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#4338ca]" />
                <span className="text-[10px] font-bold text-[#464554] uppercase tracking-wider">Total Chats</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 500 }}
              />
              <Tooltip
                cursor={{ fill: '#f1f5f9', radius: 4 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#191c1d] text-white p-3 rounded-lg shadow-xl border border-white/10 text-xs">
                        <p className="font-bold mb-1">{payload[0].payload.date}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#818cf8]" />
                          <span>Total Volume: <span className="font-bold">{payload[0].value}</span></span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="chats" 
                fill="#4338ca" 
                radius={[4, 4, 0, 0]} 
                barSize={32}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution chart */}
        <div className="bg-white border border-[#e1e3e4] rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-[#191c1d] mb-1">Channel Distribution</h3>
          <p className="text-xs text-[#777586] mb-6">Calls vs Chat volume</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600, textTransform: 'uppercase' }} 
              />
              <YAxis axisLine={false} tickLine={false} hide />
              <Tooltip
                cursor={{ fill: '#f1f5f9', radius: 8 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#191c1d] text-white p-2 rounded-lg shadow-xl border border-white/10 text-[10px]">
                        <span className="font-bold">{payload[0].payload.name}: </span>
                        <span>{payload[0].value} conversations</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="value" 
                radius={[8, 8, 0, 0]} 
                barSize={40}
              >
                {distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? "#4338ca" : "#6366f1"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-4">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-sm bg-[#4338ca]" />
               <span className="text-[10px] font-bold text-[#464554]">CHAT</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-sm bg-[#6366f1]" />
               <span className="text-[10px] font-bold text-[#464554]">PHONE</span>
             </div>
          </div>
        </div>
      </div>

      {/* Top questions */}
      <div className="bg-white border border-[#e1e3e4] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-[#191c1d]">Top Customer Inquiries</h3>
            <p className="text-xs text-[#777586]">Most common topics discussed</p>
          </div>
          <button className="text-[10px] font-bold text-[#4338ca] uppercase tracking-wider bg-[#eef2ff] px-2 py-1 rounded">View Detailed Report</button>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart layout="vertical" data={topQuestions} margin={{ left: 20, right: 20 }}>
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#464554", fontSize: 11, fontWeight: 500 }}
              width={100}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#191c1d] text-white px-2 py-1 rounded text-[10px] font-bold">
                      {payload[0].value} mentions
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="value"
              fill="#6366f1"
              radius={[0, 10, 10, 0]}
              barSize={12}
              background={{ fill: '#f8f9fa', radius: 10 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OverviewTab;
