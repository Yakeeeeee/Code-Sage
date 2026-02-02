
import React from 'react';
import { UserProgress, User, AppSettings } from '../types';

interface SettingsPageProps {
  user: User | null;
  settings: AppSettings;
  onSettingsChange: (s: AppSettings) => void;
  progress: UserProgress;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, settings, onSettingsChange, progress }) => {
  const toggleEli5 = () => onSettingsChange({ ...settings, eli5Mode: !settings.eli5Mode });
  const toggleDarkMode = () => onSettingsChange({ ...settings, darkMode: !settings.darkMode });

  const handleReset = () => {
    if (window.confirm("Are you sure? This will wipe your local progress, including saved snippets and flashcards.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-10 animate-in fade-in duration-700">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight">App Settings ⚙️</h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold">Customize your CodeSage experience.</p>
      </div>

      {/* Profile Section */}
      <section className="glass rounded-[3rem] p-8 flex items-center gap-8 border border-slate-100 dark:border-white/10 shadow-xl">
        <img src={user?.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-indigo-500/20" />
        <div>
          <h2 className="text-2xl font-black">{user?.username || 'Learner'}</h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{progress.selectedLanguage || 'Undecided'} Path</p>
          <div className="mt-2 flex gap-2">
             <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-[10px] font-black uppercase">Standard Member</span>
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/10 space-y-4">
          <div className="text-4xl">🧒</div>
          <h3 className="text-xl font-black">ELI5 Mode</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Simplify AI explanations using child-friendly analogies.</p>
          <button 
            onClick={toggleEli5}
            className={`w-full py-4 rounded-2xl font-black transition-all ${settings.eli5Mode ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
          >
            {settings.eli5Mode ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        <div className="glass rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/10 space-y-4">
          <div className="text-4xl">🌙</div>
          <h3 className="text-xl font-black">Night Vision</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Toggle dark mode for late-night coding sessions.</p>
          <button 
            onClick={toggleDarkMode}
            className={`w-full py-4 rounded-2xl font-black transition-all ${settings.darkMode ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
          >
            {settings.darkMode ? 'Dark' : 'Light'}
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <section className="glass rounded-[2.5rem] p-10 border border-rose-100 dark:border-rose-900/30">
        <h3 className="text-xl font-black text-rose-600 dark:text-rose-400 mb-2">Danger Zone</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Wipe all your progress, achievements, and saved snippets from this browser.</p>
        <button 
          onClick={handleReset}
          className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 px-8 py-4 rounded-2xl font-black hover:bg-rose-100 transition-all"
        >
          Reset All Data
        </button>
      </section>
    </div>
  );
};

export default SettingsPage;
