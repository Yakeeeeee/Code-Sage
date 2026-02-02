
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="text-center space-y-4">
        <div className="text-7xl mb-6 inline-block animate-float">🎓</div>
        <h1 className="text-5xl font-black tracking-tight">About CodeSage AI</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
          Empowering the next generation of developers through intelligent, personalized programming education.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-10 rounded-[3rem] border border-slate-100 dark:border-white/10 shadow-xl">
          <h2 className="text-2xl font-black mb-4">Our Mission</h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            We believe learning to code shouldn't be intimidating. CodeSage AI leverages Gemini's reasoning to provide a tutor that never sleeps, never loses patience, and always adapts to your level.
          </p>
        </div>
        <div className="glass p-10 rounded-[3rem] border border-slate-100 dark:border-white/10 shadow-xl">
          <h2 className="text-2xl font-black mb-4">How it Works</h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            By combining a structured curriculum with generative AI, we create a dynamic environment that answers your specific "Why?" and "How?" questions in real-time.
          </p>
        </div>
      </div>

      <section className="bg-indigo-600 rounded-[3rem] p-10 md:p-16 text-white text-center shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-black">Relax with Mr. Yakeee</h2>
            <p className="text-indigo-100 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Finished coding? Take a break with our partner for top-tier gaming highlights and entertainment.
            </p>
          </div>
          
          <a 
            href="https://www.youtube.com/@mr.yakeee" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black text-xl hover:bg-indigo-50 transition-all shadow-xl hover:scale-105 active:scale-95"
          >
            <svg className="w-8 h-8 fill-red-600" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
            Watch Mr. Yakeee
          </a>
        </div>
        
        {/* Decorative background blur */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />
      </section>

      <footer className="text-center text-slate-400 text-xs py-8 font-bold uppercase tracking-widest">
        <p>&copy; {new Date().getFullYear()} CodeSage AI. Built with Gemini 3.</p>
      </footer>
    </div>
  );
};

export default AboutPage;
