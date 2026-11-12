import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, Legend 
} from 'recharts';
import { Users, MessageSquare, Phone, CheckCircle, TrendingUp } from 'lucide-react';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316'];

const DashboardOverview = ({ stats }) => {
  if (!stats) return <div className="loading-stats">Loading amazing insights...</div>;

  const { overview, distribution, trends, topQuestions } = stats;

  return (
    <div className="overview-container">
      {/* ── Key Metrics ────────────────── */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon chat"><MessageSquare size={20} /></div>
          <div className="metric-info">
            <label>Total Conversations</label>
            <h3>{overview.totalConversations}</h3>
          </div>
          <div className="metric-badge positive">+12%</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon voice"><Phone size={20} /></div>
          <div className="metric-info">
            <label>Voice Calls</label>
            <h3>{overview.totalTickets}</h3>
          </div>
          <div className="metric-badge positive">+5%</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon resolution"><CheckCircle size={20} /></div>
          <div className="metric-info">
            <label>AI Resolution Rate</label>
            <h3>{overview.resolutionRate}%</h3>
          </div>
          <div className="metric-badge positive">High</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon users"><Users size={20} /></div>
          <div className="metric-info">
            <label>Active Customers</label>
            <h3>{overview.activeUsers}</h3>
          </div>
          <div className="metric-badge">Stable</div>
        </div>
      </div>

      {/* ── Charts Grid ────────────────── */}
      <div className="charts-main-grid">
        {/* Trend Chart */}
        <div className="chart-card large">
          <div className="chart-header">
            <h4>Conversation Trends</h4>
            <p>Daily volume for the last 7 days</p>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="colorChats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="chats" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorChats)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <h4>Channel Distribution</h4>
            <p>Calls vs Chat volume</p>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Questions */}
        <div className="chart-card">
          <div className="chart-header">
            <h4>Top Customer Inquiries</h4>
            <p>Most common topics discussed</p>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart layout="vertical" data={topQuestions} margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" fill="#a855f7" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
