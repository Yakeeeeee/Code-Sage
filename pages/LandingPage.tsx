
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface LandingPageProps {
  user: User | null;
}

const LandingPage: React.FC<LandingPageProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center justify-center text-white px-6">
      <div className="max-w-3xl text-center">
        <div className="text-7xl mb-6">🚀</div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Master Coding with <span className="text-yellow-300">CodeSage AI</span>
        </h1>
        <p className="text-xl md:text-2xl text-indigo-100 mb-10 leading-relaxed">
          The interactive, AI-powered platform for absolute beginners. Choose your path, follow structured lessons, and learn with a friendly AI tutor.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate(user ? '/dashboard' : '/auth')}
            className="bg-white text-indigo-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl hover:scale-105 active:scale-95"
          >
            {user ? 'Continue Learning' : 'Get Started Free'}
          </button>
          {!user && (
            <button 
              onClick={() => navigate('/auth')}
              className="bg-indigo-500/30 backdrop-blur-md border border-indigo-400 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-500/50 transition-all shadow-xl"
            >
              Log In
            </button>
          )}
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-2">🤖 Smart Tutoring</h3>
            <p className="text-indigo-100">AI explanations adapted to your pace and questions.</p>
          </div>
          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-2">📚 Structured Paths</h3>
            <p className="text-indigo-100">Follow a clear curriculum designed for beginners.</p>
          </div>
          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-2">✍️ Real Practice</h3>
            <p className="text-indigo-100">AI-generated quizzes and interactive mini-projects.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
