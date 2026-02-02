
import React from 'react';
import { UserProgress } from '../types';

const CookbookPage: React.FC<{ progress: UserProgress, updateProgress: (u: (p: UserProgress) => UserProgress) => void }> = ({ progress, updateProgress }) => {
  const snippets = progress.savedSnippets;

  const deleteSnippet = (id: string) => {
    updateProgress(prev => ({
      ...prev,
      savedSnippets: prev.savedSnippets.filter(s => s.id !== id)
    }));
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="space-y-10 py-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Code Cookbook 📂</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold">Your personal collection of reusable magic.</p>
        </div>
        <div className="hidden md:block glass px-6 py-2 rounded-2xl font-bold text-sm">
          {snippets.length} Recipes
        </div>
      </div>

      {snippets.length === 0 ? (
        <div className="glass rounded-[3rem] p-20 text-center space-y-4 border-2 border-dashed border-slate-200 dark:border-indigo-900/30">
          <div className="text-7xl">🍳</div>
          <h3 className="text-2xl font-black">Kitchen is empty</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">Save snippets from the Sage Sandbox during your lessons to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {snippets.sort((a,b) => b.timestamp - a.timestamp).map(snippet => (
            <div key={snippet.id} className="glass rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-200 dark:border-slate-800">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">{snippet.language}</span>
                  <h3 className="font-black text-lg">{snippet.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => copyCode(snippet.code)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">📋</button>
                  <button onClick={() => deleteSnippet(snippet.id)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-500 transition-colors">🗑️</button>
                </div>
              </div>
              <div className="p-6 bg-slate-950">
                <pre className="font-mono text-sm text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                  <code>{snippet.code}</code>
                </pre>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center text-[10px] font-bold text-slate-400">
                <span>SAVED {new Date(snippet.timestamp).toLocaleDateString()}</span>
                <span>RECIPE ID: {snippet.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CookbookPage;
