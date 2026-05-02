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
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
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
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Area chart - takes 2 cols */}
        <div className="xl:col-span-2 bg-white border border-[#e1e3e4] rounded-lg p-5">
          <h3 className="text-sm font-semibold text-[#191c1d] mb-1">
            Conversation Trends
          </h3>
          <p className="text-xs text-[#777586] mb-4">
            Daily volume for the last 7 days
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="colorChats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4338ca" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4338ca" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f5"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#777586", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#777586", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "6px",
                  border: "1px solid #e1e3e4",
                  boxShadow: "none",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="chats"
                stroke="#4338ca"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorChats)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white border border-[#e1e3e4] rounded-lg p-5">
          <h3 className="text-sm font-semibold text-[#191c1d] mb-1">
            Channel Distribution
          </h3>
          <p className="text-xs text-[#777586] mb-4">Calls vs Chat volume</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={distribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {distribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Legend
                verticalAlign="bottom"
                height={30}
                iconSize={10}
                wrapperStyle={{ fontSize: 11 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top questions */}
      <div className="bg-white border border-[#e1e3e4] rounded-lg p-5">
        <h3 className="text-sm font-semibold text-[#191c1d] mb-1">
          Top Customer Inquiries
        </h3>
        <p className="text-xs text-[#777586] mb-4">
          Most common topics discussed
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart layout="vertical" data={topQuestions} margin={{ left: 30 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#f3f4f5"
            />
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#464554", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{ fontSize: 12 }}
              cursor={{ fill: "#f3f4f5" }}
            />
            <Bar
              dataKey="value"
              fill="#6366f1"
              radius={[0, 4, 4, 0]}
              barSize={16}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OverviewTab;
