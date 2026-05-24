import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';
import LeadModal from '../components/LeadModal';
import toast from 'react-hot-toast';
import { Plus, Search, Filter, Edit3, Trash2, Eye, Building2, Mail, Phone, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

const STATUS_CLS = { 'New':'status-new','Contacted':'status-contacted','Qualified':'status-qualified','Proposal Sent':'status-proposal','Won':'status-won','Lost':'status-lost' };
const STATUSES = ['All','New','Contacted','Qualified','Proposal Sent','Won','Lost'];

const Leads = () => {
  const { isDark } = useTheme();
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [assignedFilter, setAssignedFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [viewLead, setViewLead] = useState(null);

  useEffect(() => { fetchLeads(); }, [search, statusFilter, assignedFilter, page]);
  useEffect(() => { api.get('/auth/users').then(r => setUsers(r.data)).catch(console.error); }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const p = { page, limit: 10 };
      if (search) p.search = search;
      if (statusFilter !== 'All') p.status = statusFilter;
      if (assignedFilter) p.assignedTo = assignedFilter;
      const r = await api.get('/leads', { params: p });
      setLeads(r.data.leads); setTotalPages(r.data.pages);
    } catch { toast.error('Failed to fetch leads'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try { await api.delete(`/leads/${id}`); toast.success('Lead deleted'); fetchLeads(); }
    catch { toast.error('Failed to delete'); }
  };

  const fmtDate = d => new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
  const fmtVal = v => v ? new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(v) : '₹0';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold" style={{color:'var(--text-primary)'}}>Lead Management</h1>
          <p className="text-sm mt-1" style={{color:'var(--text-muted)'}}>Manage and track all your manufacturing leads</p>
        </div>
        <button onClick={()=>{setEditLead(null);setModalOpen(true);}} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/25 hover:-translate-y-0.5">
          <Plus className="w-4 h-4"/>Add Lead
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'var(--text-muted)'}}/>
          <input type="text" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search by name or company..." className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none border focus:ring-2 focus:ring-primary-500/50" style={{background:'var(--bg-secondary)',color:'var(--text-primary)',borderColor:'var(--border-color)'}}/>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{color:'var(--text-muted)'}}/>
          <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);setPage(1);}} className="px-3 py-2.5 rounded-xl text-sm font-medium outline-none border" style={{background:'var(--bg-secondary)',color:'var(--text-primary)',borderColor:'var(--border-color)'}}>
            {STATUSES.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <select value={assignedFilter} onChange={e=>{setAssignedFilter(e.target.value);setPage(1);}} className="px-3 py-2.5 rounded-xl text-sm font-medium outline-none border" style={{background:'var(--bg-secondary)',color:'var(--text-primary)',borderColor:'var(--border-color)'}}>
          <option value="">All Members</option>
          {users.map(u=><option key={u._id} value={u._id}>{u.name}</option>)}
        </select>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{background:'var(--bg-secondary)',border:'1px solid var(--border-color)',boxShadow:'var(--shadow-md)'}}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{borderBottom:'1px solid var(--border-color)'}}>
                {['Lead','Company','Industry','Status','Assigned To','Value','Created','Actions'].map(h=>(
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-wider" style={{color:'var(--text-muted)',background:'var(--bg-tertiary)'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center py-16"><div className="w-8 h-8 mx-auto border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin"/></td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-16 text-sm" style={{color:'var(--text-muted)'}}>No leads found</td></tr>
              ) : leads.map(lead=>(
                <tr key={lead._id} className="transition-colors" style={{borderBottom:'1px solid var(--border-color)'}}
                  onMouseEnter={e=>e.currentTarget.style.background=isDark?'#1e293b':'#f8fafc'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-600">{lead.name.charAt(0)}</div>
                      <div><p className="text-sm font-semibold" style={{color:'var(--text-primary)'}}>{lead.name}</p><p className="text-xs" style={{color:'var(--text-muted)'}}>{lead.email}</p></div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-medium" style={{color:'var(--text-secondary)'}}>{lead.company}</td>
                  <td className="px-5 py-3.5"><span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{background:'var(--bg-tertiary)',color:'var(--text-secondary)'}}>{lead.industry}</span></td>
                  <td className="px-5 py-3.5"><span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_CLS[lead.status]}`}>{lead.status}</span></td>
                  <td className="px-5 py-3.5 text-sm" style={{color:'var(--text-secondary)'}}>{lead.assignedTo?.name||'—'}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold" style={{color:'var(--text-primary)'}}>{fmtVal(lead.value)}</td>
                  <td className="px-5 py-3.5 text-xs" style={{color:'var(--text-muted)'}}>{fmtDate(lead.createdAt)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={()=>setViewLead(lead)} className="p-1.5 rounded-lg hover:bg-primary-500/10"><Eye className="w-4 h-4 text-primary-500"/></button>
                      <button onClick={()=>{setEditLead(lead);setModalOpen(true);}} className="p-1.5 rounded-lg hover:bg-amber-500/10"><Edit3 className="w-4 h-4 text-amber-500"/></button>
                      <button onClick={()=>handleDelete(lead._id)} className="p-1.5 rounded-lg hover:bg-red-500/10"><Trash2 className="w-4 h-4 text-red-500"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages>1 && (
          <div className="flex items-center justify-between px-5 py-3" style={{borderTop:'1px solid var(--border-color)'}}>
            <p className="text-xs" style={{color:'var(--text-muted)'}}>Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="p-2 rounded-lg disabled:opacity-30"><ChevronLeft className="w-4 h-4"/></button>
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="p-2 rounded-lg disabled:opacity-30"><ChevronRight className="w-4 h-4"/></button>
            </div>
          </div>
        )}
      </div>

      {viewLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={()=>setViewLead(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"/>
          <div className="relative w-full max-w-lg rounded-2xl p-6 animate-scale-in" style={{background:'var(--bg-secondary)',border:'1px solid var(--border-color)'}} onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{color:'var(--text-primary)'}}>Lead Details</h2>
              <button onClick={()=>setViewLead(null)} className="p-2 rounded-xl hover:bg-red-500/10"><X className="w-5 h-5" style={{color:'var(--text-muted)'}}/></button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-4 pb-4" style={{borderBottom:'1px solid var(--border-color)'}}>
                <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center text-xl font-bold text-primary-600">{viewLead.name.charAt(0)}</div>
                <div><h3 className="text-lg font-bold" style={{color:'var(--text-primary)'}}>{viewLead.name}</h3><p className="text-sm" style={{color:'var(--text-muted)'}}>{viewLead.company}</p></div>
                <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${STATUS_CLS[viewLead.status]}`}>{viewLead.status}</span>
              </div>
              {[{l:'Email',v:viewLead.email},{l:'Phone',v:viewLead.phone},{l:'Industry',v:viewLead.industry},{l:'Assigned',v:viewLead.assignedTo?.name},{l:'Value',v:fmtVal(viewLead.value)},{l:'Created',v:fmtDate(viewLead.createdAt)}].map((r,i)=>(
                <div key={i} className="flex gap-3"><span className="text-xs font-semibold uppercase w-20" style={{color:'var(--text-muted)'}}>{r.l}</span><span className="text-sm font-medium" style={{color:'var(--text-primary)'}}>{r.v}</span></div>
              ))}
              {viewLead.notes&&<div className="pt-3" style={{borderTop:'1px solid var(--border-color)'}}><p className="text-xs font-semibold uppercase mb-2" style={{color:'var(--text-muted)'}}>Notes</p><p className="text-sm" style={{color:'var(--text-secondary)'}}>{viewLead.notes}</p></div>}
            </div>
          </div>
        </div>
      )}

      <LeadModal isOpen={modalOpen} onClose={()=>{setModalOpen(false);setEditLead(null);}} onSave={()=>{setEditLead(null);fetchLeads();}} lead={editLead}/>
    </div>
  );
};

export default Leads;
