
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
    { to: '/interviewer', icon: '🎙️', label: 'AI Chat' }
  ];

  return (
    <div className={`min-h-screen ${settings.darkMode ? 'dark bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} flex flex-col md:flex-row`}>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col sticky top-0 h-screen transition-all duration-300 ${isCollapsed ? 'w-24' : 'w-72'} bg-white dark:bg-gray-900 border-r dark:border-gray-800 p-6`}>
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="text-2xl font-black text-indigo-600 flex items-center gap-2">
            <span>🎓</span> {!isCollapsed && "CodeSage"}
          </Link>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
            {isCollapsed ? "→" : "←"}
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map(item => (
            <Link 
              key={item.to} 
              to={item.to} 
              className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${location.pathname === item.to ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-500'}`}
              title={item.label}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-4 pt-6 border-t dark:border-gray-800">
          <button onClick={toggleDarkMode} className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold hover:bg-gray-100 dark:hover:bg-gray-800">
            <span>{settings.darkMode ? '☀️' : '🌙'}</span>
            {!isCollapsed && (settings.darkMode ? 'Light' : 'Dark')}
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
            <span>🚪</span> {!isCollapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t dark:border-gray-800 z-50 px-4 py-2 flex justify-around items-center">
        {navItems.map(item => {
          const isActive = location.pathname === item.to;
          return (
            <Link 
              key={item.to} 
              to={item.to} 
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isActive ? 'text-indigo-600 scale-110' : 'text-gray-400'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 pb-24 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
