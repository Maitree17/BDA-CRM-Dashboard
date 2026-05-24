import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Factory, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'bda' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-11 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all border focus:ring-2 focus:ring-primary-500/50";

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-600/30">
            <Factory className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Join the BDA CRM manufacturing suite</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="John Doe"
                className={inputClass} style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="john@company.com"
                className={inputClass} style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }} />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Role</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <select name="role" value={form.role} onChange={handleChange}
                className={inputClass} style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>
                <option value="bda">Business Development Associate</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                required minLength={6} placeholder="Min 6 characters"
                className="w-full pl-11 pr-11 py-3 rounded-xl text-sm font-medium outline-none transition-all border focus:ring-2 focus:ring-primary-500/50"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                required placeholder="••••••••"
                className={inputClass} style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }} />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-600/25 hover:-translate-y-0.5 disabled:opacity-50">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 hover:text-primary-400 font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
