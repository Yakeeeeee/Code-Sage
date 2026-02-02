
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserProgress, User, AppSettings } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  progress: UserProgress;
  user: User | null;
  settings: AppSettings;
  onSettingsChange: (s: AppSettings) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, progress, user, settings, onSettingsChange, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleDarkMode = () => onSettingsChange({ ...settings, darkMode: !settings.darkMode });

  if (location.pathname === '/') return <>{children}</>;

  const navItems = [
    { to: '/dashboard', icon: '🏠', label: 'Home' },
    { to: `/lessons/intro`, icon: '📚', label: 'Learn' },
    { to: '/flashcards', icon: '🎴', label: 'Cards' },
    { to: '/cookbook', icon: '📂', label: 'Code' },
    { to: '/interviewer', icon: '🎙️', label: 'AI Chat' },
    { to: '/settings', icon: '⚙️', label: 'Settings' },
    { to: '/about', icon: '📖', label: 'About' }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row transition-colors duration-500">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col sticky top-0 h-screen transition-all duration-300 ${isCollapsed ? 'w-24' : 'w-72'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 z-40`}>
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="text-2xl font-black text-indigo-600 flex items-center gap-2">
            <span>🎓</span> {!isCollapsed && "CodeSage"}
          </Link>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            {isCollapsed ? "→" : "←"}
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map(item => (
            <Link 
              key={item.to} 
              to={item.to} 
              className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${location.pathname === item.to ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-500 dark:text-slate-400'}`}
              title={item.label}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-1 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
            <span>🚪</span> {!isCollapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation - More compact for more items */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-50 px-2 py-2 flex justify-around items-center">
        {navItems.map(item => {
          const isActive = location.pathname === item.to;
          return (
            <Link 
              key={item.to} 
              to={item.to} 
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isActive ? 'text-indigo-600 scale-110' : 'text-slate-400 dark:text-slate-500'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[8px] font-black uppercase tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 pb-24 md:p-12 overflow-y-auto min-h-screen">
        <div className="max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
