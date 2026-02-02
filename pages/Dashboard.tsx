
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserProgress } from '../types';
import { LESSONS, LANGUAGE_DETAILS, ACHIEVEMENTS } from '../constants';

interface DashboardProps {
  progress: UserProgress;
}

const Dashboard: React.FC<DashboardProps> = ({ progress }) => {
  const navigate = useNavigate();
  
  const selectedLang = progress.selectedLanguage;
  const langData = selectedLang ? (progress.languageData[selectedLang] || { completedLessons: [], quizScores: {} }) : null;
  const unlockedAchievements = progress.unlockedAchievements || [];

  if (!selectedLang || !langData) {
    return (
      <div className="text-center py-20 animate-in fade-in duration-700">
        <div className="text-6xl mb-6">🤔</div>
        <h2 className="text-3xl font-bold mb-4">No Language Selected</h2>
        <p className="text-gray-600 mb-8">Choose a programming language to start your journey.</p>
        <button 
          onClick={() => navigate('/select-language')}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-100"
        >
          Select Language
        </button>
      </div>
    );
  }

  const completedCount = langData.completedLessons.length;
  const totalCount = LESSONS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  
  const nextLesson = LESSONS.find(l => !langData.completedLessons.includes(l.id)) || LESSONS[0];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back, Coder!</h1>
          <p className="text-gray-600">You're making independent progress in {selectedLang}.</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="text-3xl">{LANGUAGE_DETAILS[selectedLang].icon}</div>
          <div>
            <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Current Path</div>
            <div className="font-bold text-gray-900">{selectedLang} Fundamentals</div>
          </div>
        </div>
      </header>

      {/* Progress Overview */}
      <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Overall Progress</h2>
            <p className="text-indigo-100 mb-6">Complete all lessons in {selectedLang} to earn your mastery badge!</p>
            <div className="h-4 bg-indigo-400/30 rounded-full mb-2">
              <div 
                className="h-full bg-white rounded-full transition-all duration-1000" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span>{progressPercent}% Complete</span>
              <span>{completedCount} / {totalCount} Lessons</span>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <button 
              onClick={() => navigate(`/lessons/${nextLesson.id}`)}
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-lg active:scale-95"
            >
              Continue: {nextLesson.title}
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Achievements Trophy Room */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-2xl font-black text-gray-900">Trophy Room</h3>
          <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">
            {unlockedAchievements.length} / {ACHIEVEMENTS.length} Unlocked
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlockedAchievements.includes(ach.id);
            return (
              <div 
                key={ach.id}
                className={`
                  relative group p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all duration-300
                  ${isUnlocked 
                    ? 'bg-white border-indigo-100 shadow-md hover:scale-105 active:scale-95' 
                    : 'bg-gray-100 border-dashed border-gray-200 opacity-60 grayscale'}
                `}
                title={ach.description}
              >
                <div className="text-3xl mb-2 group-hover:animate-bounce">{ach.icon}</div>
                <div className="text-[10px] font-black uppercase tracking-tight leading-tight line-clamp-1">{ach.title}</div>
                
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
                  <div className="font-bold mb-1">{ach.title}</div>
                  <div className="text-gray-400 font-medium">{ach.description}</div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-gray-900 px-2">Learning Path ({selectedLang})</h3>
          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm divide-y">
            {LESSONS.map((lesson) => {
              const isCompleted = langData.completedLessons.includes(lesson.id);
              const score = langData.quizScores[lesson.id];
              return (
                <Link
                  key={lesson.id}
                  to={`/lessons/${lesson.id}`}
                  className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors group"
                >
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all
                    ${isCompleted ? 'bg-green-100 text-green-600 scale-105' : 'bg-gray-100 text-gray-400'}
                  `}>
                    {isCompleted ? '✓' : lesson.order}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{lesson.title}</h4>
                      {score !== undefined && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${score >= 70 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                          {score}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{lesson.description}</p>
                  </div>
                  <div className="text-gray-300 group-hover:text-indigo-400 transition-all translate-x-0 group-hover:translate-x-1">
                    →
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-yellow-800 mb-2">💡 Quick Tip</h3>
            <p className="text-yellow-700 text-sm leading-relaxed">
              Stuck on a quiz? Try switching to the <strong>Tutor</strong> tab in the lesson. CodeSage can explain the concepts in a different way!
            </p>
          </div>
          
          <div className="bg-white border p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold mb-4">Your Stats ({selectedLang})</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Quizzes Taken</span>
                <span className="font-bold">{Object.keys(langData.quizScores).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Average Score</span>
                <span className="font-bold text-green-600">
                  {Object.values(langData.quizScores).length > 0 
                    ? Math.round(Object.values(langData.quizScores).reduce((a, b) => a + b, 0) / Object.values(langData.quizScores).length)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Language Proficiency</span>
                <span className={`font-bold px-2 py-1 rounded text-xs ${progressPercent >= 50 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {progressPercent >= 100 ? 'Master' : (progressPercent >= 50 ? 'Intermediate' : 'Beginner')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
