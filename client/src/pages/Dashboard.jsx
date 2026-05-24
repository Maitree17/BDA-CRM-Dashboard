import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';
import {
  Users, UserPlus, Phone, FileText, Trophy, XCircle,
  TrendingUp, IndianRupee, Clock, ArrowUpRight, Building2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid
} from 'recharts';

const STATUS_COLORS = {
  'New': '#818cf8',
  'Contacted': '#38bdf8',
  'Qualified': '#fbbf24',
  'Proposal Sent': '#a78bfa',
  'Won': '#34d399',
  'Lost': '#f87171',
};

const Dashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${val}`;
  };

  const getTimeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Leads', value: stats?.totalLeads || 0, icon: Users, gradient: 'from-primary-500 to-primary-700', shadow: 'shadow-primary-500/25' },
    { label: 'New Leads', value: stats?.newLeads || 0, icon: UserPlus, gradient: 'from-indigo-400 to-indigo-600', shadow: 'shadow-indigo-500/25' },
    { label: 'Contacted', value: stats?.contactedLeads || 0, icon: Phone, gradient: 'from-sky-400 to-sky-600', shadow: 'shadow-sky-500/25' },
    { label: 'Proposal Sent', value: stats?.proposalSent || 0, icon: FileText, gradient: 'from-violet-400 to-violet-600', shadow: 'shadow-violet-500/25' },
    { label: 'Won Deals', value: stats?.wonDeals || 0, icon: Trophy, gradient: 'from-emerald-400 to-emerald-600', shadow: 'shadow-emerald-500/25' },
    { label: 'Lost Deals', value: stats?.lostDeals || 0, icon: XCircle, gradient: 'from-rose-400 to-rose-600', shadow: 'shadow-rose-500/25' },
  ];

  const pieData = stats?.leadsByStatus?.map(s => ({
    name: s._id,
    value: s.count,
    color: STATUS_COLORS[s._id] || '#94a3b8',
  })) || [];

  const industryData = stats?.leadsByIndustry?.slice(0, 6) || [];

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = stats?.monthlyLeads?.map(m => ({
    month: monthNames[(m._id.month - 1)],
    leads: m.count,
  })) || [];

  const tooltipStyle = {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    color: isDark ? '#f1f5f9' : '#0f172a',
    fontSize: '13px',
    fontWeight: 500,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Here's your sales overview for today
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Pipeline: {formatCurrency(stats?.pipelineValue || 0)}
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <IndianRupee className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Won: {formatCurrency(stats?.wonValue || 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, i) => (
          <div
            key={card.label}
            className={`relative overflow-hidden rounded-2xl p-4 text-white bg-gradient-to-br ${card.gradient} ${card.shadow} shadow-lg animate-fade-in stagger-${i + 1} hover:scale-105 transition-transform duration-200 cursor-default`}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
            <card.icon className="w-8 h-8 mb-2 opacity-90" />
            <p className="text-2xl font-extrabold">{card.value}</p>
            <p className="text-xs font-medium opacity-80 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend */}
        <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
            Lead Acquisition Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="leads" stroke="#6366f1" strokeWidth={2.5} fill="url(#leadGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pie Chart */}
        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
            Pipeline Distribution
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" cx="50%" cy="50%">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                <span className="text-xs font-medium truncate" style={{ color: 'var(--text-secondary)' }}>
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Industry & Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Chart */}
        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
            Leads by Industry
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryData} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }} />
                <YAxis type="category" dataKey="_id" width={120} axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
            Recent Activities
          </h3>
          <div className="space-y-3 max-h-[310px] overflow-y-auto pr-2">
            {stats?.recentLeads?.map((lead, i) => (
              <div
                key={lead._id}
                className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02] cursor-default"
                style={{ background: 'var(--bg-tertiary)' }}
              >
                <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{lead.name}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{lead.company}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold status-${lead.status.toLowerCase().replace(' ', '-')}`}>
                    {lead.status === 'Proposal Sent' ? 'Proposal' : lead.status}
                  </span>
                  <p className="text-[10px] mt-1 flex items-center justify-end gap-1" style={{ color: 'var(--text-muted)' }}>
                    <Clock className="w-2.5 h-2.5" />
                    {getTimeAgo(lead.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
