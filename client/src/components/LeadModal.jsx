import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const INDUSTRIES = [
  'Automotive', 'Aerospace', 'Chemical', 'Construction', 'Electronics',
  'Energy', 'Food & Beverage', 'Healthcare', 'Machinery', 'Metals & Mining',
  'Pharmaceuticals', 'Plastics', 'Textiles', 'Other',
];

const STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

const LeadModal = ({ isOpen, onClose, onSave, lead = null }) => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    industry: 'Automotive',
    status: 'New',
    assignedTo: '',
    notes: '',
    value: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      if (lead) {
        setFormData({
          name: lead.name || '',
          company: lead.company || '',
          email: lead.email || '',
          phone: lead.phone || '',
          industry: lead.industry || 'Automotive',
          status: lead.status || 'New',
          assignedTo: lead.assignedTo?._id || lead.assignedTo || '',
          notes: lead.notes || '',
          value: lead.value || 0,
        });
      } else {
        setFormData({
          name: '', company: '', email: '', phone: '',
          industry: 'Automotive', status: 'New', assignedTo: '',
          notes: '', value: 0,
        });
      }
    }
  }, [isOpen, lead]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
      if (!lead && res.data.length > 0 && !formData.assignedTo) {
        setFormData(prev => ({ ...prev, assignedTo: res.data[0]._id }));
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'value' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (lead) {
        const res = await api.put(`/leads/${lead._id}`, formData);
        toast.success('Lead updated successfully');
        onSave(res.data);
      } else {
        const res = await api.post('/leads', formData);
        toast.success('Lead created successfully');
        onSave(res.data);
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const inputClass = `w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 outline-none
    focus:ring-2 focus:ring-primary-500/50 border`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 animate-scale-in"
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xl)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {lead ? 'Edit Lead' : 'Create New Lead'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-red-500/10 transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lead Name */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Lead Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className={inputClass}
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                placeholder="Tata Motors"
                className={inputClass}
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@company.com"
                className={inputClass}
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Phone Number *
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+91-9876543210"
                className={inputClass}
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Industry *
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className={inputClass}
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
              >
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Assigned To */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Assigned To *
              </label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                required
                className={inputClass}
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
              >
                <option value="">Select User</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>

            {/* Deal Value */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Deal Value (₹)
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="0"
                className={inputClass}
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Add notes about this lead..."
              className={`${inputClass} resize-none`}
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              style={{ color: 'var(--text-secondary)', background: 'var(--bg-tertiary)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-primary-600/25"
            >
              {saving ? 'Saving...' : lead ? 'Update Lead' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
