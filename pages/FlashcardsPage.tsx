
import React, { useState } from 'react';
import { UserProgress, Flashcard } from '../types';
import { generateFlashcards } from '../services/geminiService';

const FlashcardsPage: React.FC<{ progress: UserProgress, updateProgress: (u: (p: UserProgress) => UserProgress) => void }> = ({ progress, updateProgress }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const cards = progress.flashcards;

  const handleGenerate = async () => {
    if (!progress.selectedLanguage) return;
    setIsGenerating(true);
    try {
      const newCards = await generateFlashcards(progress.selectedLanguage);
      updateProgress(prev => ({
        ...prev,
        flashcards: [...prev.flashcards, ...newCards]
      }));
      setCurrentIndex(progress.flashcards.length);
    } catch (e) {
      alert("Failed to generate cards. Try again!");
    } finally {
      setIsGenerating(false);
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex(prev => (prev + 1) % cards.length), 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length), 150);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 py-10 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black tracking-tight">Spaced Repetition 🎴</h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold">Master concepts through active recall.</p>
      </div>

      {cards.length === 0 ? (
        <div className="glass rounded-[3rem] p-20 text-center space-y-6 border-2 border-dashed border-indigo-200 dark:border-indigo-900/30">
          <div className="text-7xl">🎴</div>
          <h3 className="text-2xl font-black">Your deck is empty</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">Generate smart flashcards based on your {progress.selectedLanguage || 'coding'} progress.</p>
          <button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl disabled:opacity-50 hover:scale-105 active:scale-95 transition-all"
          >
            {isGenerating ? 'Summoning Cards...' : 'Generate AI Deck ✨'}
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Progress Bar */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}></div>
            </div>
            <span className="text-xs font-black text-slate-400 uppercase">{currentIndex + 1} / {cards.length}</span>
          </div>

          {/* Flashcard Component */}
          <div 
            className="perspective-1000 w-full h-80 cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              {/* Front */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center shadow-xl">
                <span className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-6">Question</span>
                <p className="text-2xl font-black leading-tight">{cards[currentIndex].question}</p>
                <span className="mt-8 text-xs font-bold text-slate-300 dark:text-slate-600">Tap to reveal answer</span>
              </div>
              {/* Back */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-indigo-600 text-white rounded-[3rem] p-10 flex flex-col items-center justify-center text-center shadow-xl rotate-y-180">
                <span className="text-xs font-black text-indigo-200 uppercase tracking-widest mb-6">Sage Answer</span>
                <p className="text-xl font-bold leading-relaxed">{cards[currentIndex].answer}</p>
                <span className="mt-8 text-xs font-bold text-indigo-300">Tap to flip back</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <button onClick={prevCard} className="flex-1 glass p-5 rounded-2xl font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">← Previous</button>
            <button onClick={nextCard} className="flex-1 glass p-5 rounded-2xl font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Next Card →</button>
          </div>

          <div className="text-center">
            <button onClick={handleGenerate} disabled={isGenerating} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              {isGenerating ? 'Adding...' : '+ Add More Cards'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardsPage;
