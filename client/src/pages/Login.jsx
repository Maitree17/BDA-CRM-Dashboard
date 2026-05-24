import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Factory, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left - Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #4338ca 100%)',
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full" />

        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-2xl">
            <Factory className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            BDA CRM<br />
            <span className="text-white/80 text-2xl font-semibold">Manufacturing Suite</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            Streamline your sales pipeline, manage leads, and drive growth for your manufacturing business.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-4">
            {[
              { label: 'Active Leads', value: '2.4K+' },
              { label: 'Conversion', value: '34%' },
              { label: 'Revenue', value: '₹12Cr' },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-600/30">
              <Factory className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>BDA CRM</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
              Welcome back
            </h2>
            <p className="text-base" style={{ color: 'var(--text-muted)' }}>
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="admin@bdacrm.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-medium outline-none transition-all border focus:ring-2 focus:ring-primary-500/50"
                  style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl text-sm font-medium outline-none transition-all border focus:ring-2 focus:ring-primary-500/50"
                  style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-500 hover:text-primary-400 font-semibold transition-colors">
              Create account
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-xl border" style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>DEMO CREDENTIALS</p>
            <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
              admin@bdacrm.com / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
