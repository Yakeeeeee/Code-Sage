
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserProgress, ProgrammingLanguage, User } from '../types';
import { LESSONS, LANGUAGE_DETAILS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  progress: UserProgress;
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, progress, user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('codesage_sidebar_collapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('codesage_sidebar_collapsed', String(isCollapsed));
  }, [isCollapsed]);

  const isHome = location.pathname === '/';
  const selectedLang = progress.selectedLanguage;
  const langData = selectedLang ? progress.languageData[selectedLang] : null;
  
  if (isHome) return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="text-xl font-bold text-indigo-600 flex items-center gap-2">
          <span className="text-2xl">🎓</span> CodeSage
        </Link>
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)} 
          className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </header>

      {/* Sidebar - Fixed on desktop, Overlay on mobile */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 bg-white border-r transition-all duration-300 ease-in-out
        md:sticky md:top-0 md:h-screen md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'md:w-20' : 'md:w-72'}
      `}>
        <div className="h-full flex flex-col p-4 md:p-6 overflow-hidden">
          {/* Collapse Toggle Button (Desktop Only) */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex absolute top-1/2 -right-3 w-6 h-6 bg-white border shadow-sm rounded-full items-center justify-center text-gray-400 hover:text-indigo-600 z-50 hover:scale-110 transition-all"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <svg className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="mb-8 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform">
              <span className="text-3xl">🎓</span> 
              {!isCollapsed && <span className="text-2xl font-black text-indigo-600">CodeSage</span>}
            </Link>
          </div>

          {/* User Profile */}
          {user && (
            <div className={`mb-8 flex flex-col gap-4 transition-all ${isCollapsed ? 'items-center p-0' : 'p-5 bg-indigo-50/50 rounded-3xl border border-indigo-100/50'}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white shadow-sm ring-2 ring-indigo-100 flex-shrink-0">
                  <img 
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} 
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Active Profile</p>
                    <p className="text-base font-bold text-gray-900 truncate">{user.username}</p>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <div className="flex items-center justify-between text-[10px] font-bold text-indigo-500 bg-white/60 px-3 py-1.5 rounded-xl border border-indigo-100/50">
                  <span className="uppercase tracking-widest">Lvl 1 Beginner</span>
                  <span>{progress.languageData[selectedLang || '']?.completedLessons.length || 0} XP</span>
                </div>
              )}
            </div>
          )}

          <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar pr-2">
            <Link 
              to="/dashboard" 
              className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-200 group ${location.pathname === '/dashboard' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'} ${isCollapsed ? 'justify-center' : ''}`}
              onClick={() => setSidebarOpen(false)}
              title={isCollapsed ? "Dashboard" : ""}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              {!isCollapsed && <span className="font-bold">Dashboard</span>}
            </Link>

            <Link 
              to="/about" 
              className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-200 group ${location.pathname === '/about' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'} ${isCollapsed ? 'justify-center' : ''}`}
              onClick={() => setSidebarOpen(false)}
              title={isCollapsed ? "About" : ""}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {!isCollapsed && <span className="font-bold">About Path</span>}
            </Link>
            
            {selectedLang && (
              <div className={`mt-8 ${!isCollapsed ? 'border-t border-gray-100 pt-8' : ''}`}>
                {!isCollapsed && (
                  <div className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center justify-between mb-2">
                    <span>{selectedLang} Units</span>
                    <span className="bg-indigo-50 text-indigo-400 px-2 rounded-full">
                      {langData?.completedLessons.length || 0}/{LESSONS.length}
                    </span>
                  </div>
                )}
                <div className="space-y-1">
                  {LESSONS.map((lesson) => {
                    const isCompleted = langData?.completedLessons.includes(lesson.id);
                    const isActive = location.pathname === `/lessons/${lesson.id}`;
                    return (
                      <Link
                        key={lesson.id}
                        to={`/lessons/${lesson.id}`}
                        className={`
                          flex items-center justify-between p-3 rounded-2xl transition-all duration-200 group
                          ${isActive ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-500 hover:bg-gray-50'}
                          ${isCollapsed ? 'justify-center' : ''}
                        `}
                        onClick={() => setSidebarOpen(false)}
                        title={isCollapsed ? lesson.title : ""}
                      >
                        {isCollapsed ? (
                          <div className="relative">
                            <span className="text-xs font-black">{lesson.order}</span>
                            {isCompleted && (
                              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white" />
                            )}
                          </div>
                        ) : (
                          <>
                            <span className="truncate text-sm">{lesson.title}</span>
                            {isCompleted ? (
                              <span className="text-green-500 bg-green-50 rounded-full p-1 shadow-sm flex-shrink-0">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                              </span>
                            ) : isActive && (
                              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse flex-shrink-0" />
                            )}
                          </>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-3">
            <Link 
              to="/select-language" 
              className={`flex items-center gap-3 p-4 rounded-2xl text-indigo-600 font-bold hover:bg-indigo-50 transition-all border-2 border-indigo-100/50 group ${isCollapsed ? 'justify-center p-3' : ''}`}
              onClick={() => setSidebarOpen(false)}
              title={isCollapsed ? "Switch Language" : ""}
            >
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9h18" /></svg>
              {!isCollapsed && <span>Switch Path</span>}
            </Link>
            <button 
              onClick={() => {
                onLogout();
                navigate('/');
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 p-4 rounded-2xl text-red-500 font-bold hover:bg-red-50 transition-all group ${isCollapsed ? 'justify-center p-3' : ''}`}
              title={isCollapsed ? "Sign Out" : ""}
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <div className="w-full max-w-screen-xl mx-auto px-4 py-8 md:px-12 md:py-12">
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
            {children}
          </div>
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-30 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};