import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  Trophy,
  LogOut,
  Moon,
  Sun,
  Factory,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/leads', icon: Users, label: 'Leads' },
    { to: '/pipeline', icon: KanbanSquare, label: 'Pipeline' },
    { to: '/team', icon: Trophy, label: 'Team' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
      style={{
        background: isDark
          ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(180deg, #4f46e5 0%, #4338ca 50%, #3730a3 100%)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
      }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 py-6 border-b border-white/10 ${collapsed ? 'justify-center px-3' : ''}`}>
        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
          <Factory className="w-6 h-6 text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-lg font-bold text-white tracking-tight">BDA CRM</h1>
            <p className="text-[11px] text-white/60 font-medium">Manufacturing Suite</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                collapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-white/20 text-white shadow-lg shadow-black/10'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-3 space-y-2 border-t border-white/10">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {!collapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* User info */}
        {!collapsed && (
          <div className="px-3 py-3 rounded-xl bg-white/10 backdrop-blur-sm animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <p className="text-[11px] text-white/50 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-all duration-200 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/10 transition-all ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
