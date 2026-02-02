
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgrammingLanguage } from '../types';
import { LANGUAGE_DETAILS } from '../constants';

interface Props {
  onSelect: (lang: ProgrammingLanguage) => void;
}

const LanguageSelection: React.FC<Props> = ({ onSelect }) => {
  const navigate = useNavigate();

  const handleSelect = (lang: ProgrammingLanguage) => {
    onSelect(lang);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Choose Your Learning Path</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Master the world's most popular programming languages with a personal AI tutor.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Object.entries(ProgrammingLanguage) as [string, ProgrammingLanguage][]).map(([key, lang]) => {
          const detail = LANGUAGE_DETAILS[lang];
          return (
            <button
              key={lang}
              onClick={() => handleSelect(lang)}
              className="group relative bg-white border-2 border-gray-100 p-8 rounded-[2.5rem] text-left hover:border-indigo-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className="flex items-start justify-between mb-8">
                <span className="text-5xl group-hover:scale-110 transition-transform">{detail.icon}</span>
                <div className="bg-gray-50 text-gray-400 group-hover:bg-indigo-600 group-hover:text-white px-4 py-2 rounded-2xl text-xs font-black tracking-widest transition-all">
                  START
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">{lang}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                {detail.description}
              </p>
              
              {/* Decorative background element */}
              <div className="absolute -bottom-4 -right-4 p-8 text-gray-100 text-9xl font-black opacity-5 select-none group-hover:text-indigo-600 group-hover:opacity-10 transition-all duration-500 rotate-12 group-hover:rotate-0">
                {detail.icon}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-20 bg-indigo-50 border border-indigo-100 p-10 rounded-[3rem] flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <div className="text-6xl animate-bounce">💡</div>
        <div>
          <h4 className="text-2xl font-black text-indigo-900 mb-2">Not sure where to start?</h4>
          <p className="text-indigo-800 text-lg leading-relaxed">
            We recommend <strong>Python</strong> if you're a total beginner who wants to get things done quickly, or <strong>JavaScript</strong> if you want to build beautiful websites. For high performance, try <strong>C++</strong> or <strong>Rust</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
