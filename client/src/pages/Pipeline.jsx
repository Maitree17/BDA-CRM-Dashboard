import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { Building2, Mail, IndianRupee, GripVertical } from 'lucide-react';

const COLUMNS = [
  { id: 'New', label: 'New', color: '#818cf8', bg: 'rgba(129,140,248,0.1)' },
  { id: 'Contacted', label: 'Contacted', color: '#38bdf8', bg: 'rgba(56,189,248,0.1)' },
  { id: 'Qualified', label: 'Qualified', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  { id: 'Proposal Sent', label: 'Proposal', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  { id: 'Won', label: 'Won', color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
  { id: 'Lost', label: 'Lost', color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
];

const Pipeline = () => {
  const { isDark } = useTheme();
  const [leads, setLeads] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get('/leads', { params: { limit: 200 } });
      const grouped = {};
      COLUMNS.forEach(c => grouped[c.id] = []);
      res.data.leads.forEach(l => {
        if (grouped[l.status]) grouped[l.status].push(l);
      });
      setLeads(grouped);
    } catch { toast.error('Failed to load pipeline'); }
    finally { setLoading(false); }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;

    const srcCol = [...(leads[source.droppableId] || [])];
    const destCol = source.droppableId === destination.droppableId ? srcCol : [...(leads[destination.droppableId] || [])];
    const [moved] = srcCol.splice(source.index, 1);
    moved.status = destination.droppableId;
    destCol.splice(destination.index, 0, moved);

    setLeads(prev => ({
      ...prev,
      [source.droppableId]: srcCol,
      [destination.droppableId]: destCol,
    }));

    try {
      await api.patch(`/leads/${draggableId}/status`, { status: destination.droppableId });
      if (destination.droppableId === 'Won') toast.success('🎉 Deal Won!');
      else if (destination.droppableId === 'Lost') toast('Deal marked as Lost', { icon: '😔' });
      else toast.success(`Moved to ${destination.droppableId}`);
    } catch {
      toast.error('Failed to update status');
      fetchLeads();
    }
  };

  const fmtVal = v => v ? `₹${(v/100000).toFixed(1)}L` : '';

  if (loading) return <div className="flex items-center justify-center h-96"><div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"/></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold" style={{color:'var(--text-primary)'}}>Sales Pipeline</h1>
        <p className="text-sm mt-1" style={{color:'var(--text-muted)'}}>Drag and drop leads to update their status</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4" style={{minHeight:'calc(100vh - 200px)'}}>
          {COLUMNS.map(col => (
            <Droppable key={col.id} droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex-shrink-0 w-72 rounded-2xl flex flex-col transition-all"
                  style={{
                    background: snapshot.isDraggingOver ? col.bg : 'var(--bg-secondary)',
                    border: `1px solid ${snapshot.isDraggingOver ? col.color+'40' : 'var(--border-color)'}`,
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {/* Column Header */}
                  <div className="p-4 flex items-center justify-between" style={{borderBottom:'1px solid var(--border-color)'}}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{background:col.color}}/>
                      <span className="text-sm font-bold" style={{color:'var(--text-primary)'}}>{col.label}</span>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:col.bg,color:col.color}}>
                      {leads[col.id]?.length || 0}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-300px)]">
                    {leads[col.id]?.map((lead, idx) => (
                      <Draggable key={lead._id} draggableId={lead._id} index={idx}>
                        {(prov, snap) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            className="rounded-xl p-3.5 transition-all cursor-grab active:cursor-grabbing"
                            style={{
                              ...prov.draggableProps.style,
                              background: snap.isDragging ? (isDark?'#334155':'#ffffff') : 'var(--bg-tertiary)',
                              border: `1px solid ${snap.isDragging ? col.color : 'transparent'}`,
                              boxShadow: snap.isDragging ? `0 8px 25px ${col.color}20` : 'none',
                              transform: snap.isDragging ? `${prov.draggableProps.style?.transform} rotate(2deg)` : prov.draggableProps.style?.transform,
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white" style={{background:col.color}}>
                                  {lead.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold leading-tight" style={{color:'var(--text-primary)'}}>{lead.name}</p>
                                </div>
                              </div>
                              <GripVertical className="w-3.5 h-3.5 flex-shrink-0 mt-1" style={{color:'var(--text-muted)'}}/>
                            </div>
                            <div className="space-y-1 ml-9">
                              <p className="text-xs flex items-center gap-1.5" style={{color:'var(--text-muted)'}}>
                                <Building2 className="w-3 h-3"/>{lead.company}
                              </p>
                              <p className="text-xs flex items-center gap-1.5" style={{color:'var(--text-muted)'}}>
                                <Mail className="w-3 h-3"/>{lead.email}
                              </p>
                              {lead.value > 0 && (
                                <p className="text-xs font-semibold flex items-center gap-1 text-emerald-500">
                                  <IndianRupee className="w-3 h-3"/>{fmtVal(lead.value)}
                                </p>
                              )}
                            </div>
                            <div className="mt-2 ml-9">
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{background:col.bg,color:col.color}}>
                                {lead.industry}
                              </span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Pipeline;
