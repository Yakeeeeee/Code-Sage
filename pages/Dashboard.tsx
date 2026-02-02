
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProgress } from '../types';
import { ACHIEVEMENTS, LANGUAGE_DETAILS, LESSONS } from '../constants';

const Dashboard: React.FC<{ progress: UserProgress }> = ({ progress }) => {
  const navigate = useNavigate();
  const lang = progress.selectedLanguage;
  const streak = progress.streak.current;

  // Calculate actual progress for the current language
  const completedCount = lang ? (progress.languageData[lang]?.completedLessons?.length || 0) : 0;
  const progressPercent = Math.round((completedCount / LESSONS.length) * 100);
  
  // Calculate actual XP (100 per achievement)
  const totalXP = progress.unlockedAchievements.length * 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="grid grid-cols-1 gap-6">
        {/* Statistics Hero - Now Full Width */}
        <div className="glass rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex-1">
             <h2 className="text-4xl font-black mb-4">Welcome back, <span className="text-indigo-600">Explorer</span>.</h2>
             <p className="text-slate-500 font-medium mb-8 leading-relaxed max-w-sm">
               {lang 
                 ? `Your ${lang} journey is ${progressPercent}% complete. You've mastered ${completedCount} concepts so far!` 
                 : "Select a language to begin your journey and track your progress here."}
             </p>
             <div className="flex flex-wrap gap-4">
               <button 
                 onClick={() => navigate(lang ? '/lessons/intro' : '/select-language')} 
                 className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all"
               >
                 {lang ? 'Continue Mission 🚀' : 'Start Learning ✨'}
               </button>
               <div className="bg-white/50 dark:bg-slate-800/50 px-8 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                 <span className="text-xl">💎</span>
                 <span className="font-black text-indigo-600">{totalXP} <span className="text-[10px] text-slate-400">XP</span></span>
               </div>
             </div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center gap-2 bg-white/40 dark:bg-slate-900/40 p-8 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-xl">
             <div className="text-7xl mb-2 animate-float">🔥</div>
             <div className="text-5xl font-black">{streak}</div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Day Streak</p>
          </div>
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        </div>
      </div>

      {/* Main Learning Hub */}
      {lang ? (
        <div className="glass rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div className="flex items-center gap-6">
              <div className="text-7xl drop-shadow-2xl">{LANGUAGE_DETAILS[lang].icon}</div>
              <div>
                <h2 className="text-3xl font-black mb-1">{lang} Specialization</h2>
                <div className="h-1.5 w-48 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 shadow-sm transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <p className="text-xs font-bold text-slate-400 mt-2">
                  {progressPercent === 100 ? 'Course Completed! 🏆' : `Level ${Math.floor(totalXP / 500) + 1} • ${500 - (totalXP % 500)} XP to Next Level`}
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Certificate', icon: '📜', status: progressPercent === 100 ? 'Unlocked' : 'Locked', color: progressPercent === 100 ? 'emerald' : 'slate', path: '#' },
              { label: 'Flashcards', icon: '🎴', status: `${progress.flashcards.length} Cards`, color: 'indigo', path: '/flashcards' },
              { label: 'Snippets', icon: '📂', status: `${progress.savedSnippets.length} Saved`, color: 'emerald', path: '/cookbook' },
              { label: 'Interview', icon: '🎙️', status: 'Available', color: 'rose', path: '/interviewer' }
            ].map(tool => (
              <div 
                key={tool.label} 
                onClick={() => tool.path !== '#' && navigate(tool.path)}
                className="group glass p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:border-indigo-500 hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{tool.icon}</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{tool.label}</p>
                <p className={`text-sm font-black text-${tool.color}-600`}>{tool.status}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-32 glass rounded-[4rem] border-2 border-dashed border-indigo-200 bg-indigo-50/10">
           <div className="text-8xl mb-8 animate-bounce">🧭</div>
           <h3 className="text-3xl font-black mb-4">The scroll of destiny awaits.</h3>
           <p className="text-slate-500 font-medium mb-10">You haven't selected a specialization yet.</p>
           <button onClick={() => navigate('/select-language')} className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black shadow-2xl hover:bg-slate-800 transition-all">Begin Selection</button>
        </div>
      )}

      {/* Achievement Gallery */}
      <div className="space-y-6 pt-10">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black tracking-tight">Unlocked Relics</h3>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{progress.unlockedAchievements.length} OF {ACHIEVEMENTS.length}</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-10 gap-4">
          {ACHIEVEMENTS.map(ach => {
            const unlocked = progress.unlockedAchievements.includes(ach.id);
            return (
              <div 
                key={ach.id} 
                className={`aspect-square glass rounded-2xl flex items-center justify-center text-3xl transition-all relative group/ach ${unlocked ? 'shadow-xl shadow-indigo-500/10 hover:scale-110' : 'opacity-20 grayscale scale-90'}`}
              >
                {ach.icon}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-3 rounded-lg opacity-0 group-hover/ach:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none font-bold">
                  {ach.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
