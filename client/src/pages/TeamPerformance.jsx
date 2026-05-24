import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';
import { Trophy, Users, TrendingUp, Target, Medal, ArrowUp, ArrowDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const TeamPerformance = () => {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/team/performance').then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const fmtVal = v => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : `₹${(v/1000).toFixed(0)}K`;

  const tooltipStyle = {
    backgroundColor: isDark ? '#1e293b' : '#fff',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    borderRadius: '12px', fontSize: '13px', fontWeight: 500,
    color: isDark ? '#f1f5f9' : '#0f172a',
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"/></div>;

  const members = data?.teamMembers || [];
  const chartData = members.map(m => ({ name: m.name.split(' ')[0], won: m.wonLeads, lost: m.lostLeads, total: m.totalLeads }));
  const topPerformer = members[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold" style={{color:'var(--text-primary)'}}>Team Performance</h1>
        <p className="text-sm mt-1" style={{color:'var(--text-muted)'}}>Track your BDA team's sales metrics and conversions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label:'Team Members', value: members.length, icon: Users, gradient:'from-primary-500 to-primary-700' },
          { label:'Total Leads', value: members.reduce((a,m)=>a+m.totalLeads,0), icon: Target, gradient:'from-sky-400 to-sky-600' },
          { label:'Total Won', value: members.reduce((a,m)=>a+m.wonLeads,0), icon: Trophy, gradient:'from-emerald-400 to-emerald-600' },
          { label:'Avg Conversion', value: members.length ? (members.reduce((a,m)=>a+m.conversionRate,0)/members.length).toFixed(1)+'%' : '0%', icon: TrendingUp, gradient:'from-violet-400 to-violet-600' },
        ].map((c,i) => (
          <div key={i} className={`rounded-2xl p-5 text-white bg-gradient-to-br ${c.gradient} shadow-lg animate-fade-in`} style={{animationDelay:`${i*0.05}s`}}>
            <c.icon className="w-8 h-8 mb-2 opacity-80"/>
            <p className="text-3xl font-extrabold">{c.value}</p>
            <p className="text-xs font-medium opacity-70 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Chart & Top Performer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl p-6" style={{background:'var(--bg-secondary)',border:'1px solid var(--border-color)',boxShadow:'var(--shadow-md)'}}>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{color:'var(--text-muted)'}}>Leads by Team Member</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark?'#334155':'#e2e8f0'}/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:isDark?'#94a3b8':'#64748b',fontSize:12}}/>
                <YAxis axisLine={false} tickLine={false} tick={{fill:isDark?'#94a3b8':'#64748b',fontSize:12}}/>
                <Tooltip contentStyle={tooltipStyle}/>
                <Bar dataKey="won" fill="#34d399" radius={[6,6,0,0]} name="Won"/>
                <Bar dataKey="lost" fill="#f87171" radius={[6,6,0,0]} name="Lost"/>
                <Bar dataKey="total" fill="#818cf8" radius={[6,6,0,0]} name="Total"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {topPerformer && (
          <div className="rounded-2xl p-6 relative overflow-hidden" style={{background:'var(--bg-secondary)',border:'1px solid var(--border-color)'}}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-10 translate-x-10"/>
            <div className="flex items-center gap-2 mb-6">
              <Medal className="w-5 h-5 text-amber-500"/>
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{color:'var(--text-muted)'}}>Top Performer</h3>
            </div>
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl font-extrabold text-white shadow-lg shadow-amber-500/25 mb-4">
                {topPerformer.name.charAt(0)}
              </div>
              <h4 className="text-lg font-bold" style={{color:'var(--text-primary)'}}>{topPerformer.name}</h4>
              <p className="text-xs" style={{color:'var(--text-muted)'}}>{topPerformer.email}</p>
            </div>
            <div className="space-y-3">
              {[
                {l:'Won Deals',v:topPerformer.wonLeads,c:'text-emerald-500'},
                {l:'Total Leads',v:topPerformer.totalLeads,c:'text-primary-500'},
                {l:'Conversion',v:`${topPerformer.conversionRate.toFixed(1)}%`,c:'text-amber-500'},
                {l:'Revenue',v:fmtVal(topPerformer.wonValue),c:'text-emerald-500'},
              ].map((r,i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl" style={{background:'var(--bg-tertiary)'}}>
                  <span className="text-xs font-medium" style={{color:'var(--text-muted)'}}>{r.l}</span>
                  <span className={`text-sm font-bold ${r.c}`}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Individual Performance Table */}
      <div className="rounded-2xl overflow-hidden" style={{background:'var(--bg-secondary)',border:'1px solid var(--border-color)',boxShadow:'var(--shadow-md)'}}>
        <div className="p-5" style={{borderBottom:'1px solid var(--border-color)'}}>
          <h3 className="text-sm font-bold uppercase tracking-wider" style={{color:'var(--text-muted)'}}>Individual Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{borderBottom:'1px solid var(--border-color)'}}>
                {['Rank','Member','Total Leads','Won','Lost','In Pipeline','Won Value','Conversion Rate'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{color:'var(--text-muted)',background:'var(--bg-tertiary)'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={m._id} style={{borderBottom:'1px solid var(--border-color)'}}
                  onMouseEnter={e=>e.currentTarget.style.background=isDark?'#1e293b':'#f8fafc'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td className="px-5 py-3.5">
                    <span className={`w-7 h-7 inline-flex items-center justify-center rounded-lg text-xs font-bold text-white ${i===0?'bg-amber-500':i===1?'bg-gray-400':i===2?'bg-amber-700':'bg-surface-400'}`}>
                      {i+1}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-600">{m.name.charAt(0)}</div>
                      <div><p className="text-sm font-semibold" style={{color:'var(--text-primary)'}}>{m.name}</p><p className="text-xs capitalize" style={{color:'var(--text-muted)'}}>{m.role}</p></div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold" style={{color:'var(--text-primary)'}}>{m.totalLeads}</td>
                  <td className="px-5 py-3.5"><span className="text-sm font-bold text-emerald-500 flex items-center gap-1"><ArrowUp className="w-3 h-3"/>{m.wonLeads}</span></td>
                  <td className="px-5 py-3.5"><span className="text-sm font-bold text-red-500 flex items-center gap-1"><ArrowDown className="w-3 h-3"/>{m.lostLeads}</span></td>
                  <td className="px-5 py-3.5 text-sm" style={{color:'var(--text-secondary)'}}>{m.totalLeads - m.wonLeads - m.lostLeads}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-emerald-500">{fmtVal(m.wonValue)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{width:`${Math.min(m.conversionRate,100)}%`,background:m.conversionRate>=30?'#34d399':m.conversionRate>=15?'#fbbf24':'#f87171'}}/>
                      </div>
                      <span className="text-xs font-bold" style={{color:'var(--text-primary)'}}>{m.conversionRate.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamPerformance;
