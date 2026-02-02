
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { UserProgress, QuizQuestion, AppSettings, CodeReviewResult, ProgrammingLanguage } from '../types';
import { LESSONS } from '../constants';
import { getLessonContent, generateQuiz, reviewUserCode, generateAudioLesson, simulateCodeExecution } from '../services/geminiService';

const LessonPage: React.FC<{ progress: UserProgress, settings: AppSettings, updateProgress: (u: (p: UserProgress) => UserProgress) => void }> = ({ progress, settings, updateProgress }) => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'content' | 'sandbox' | 'quiz'>('content');
  const [content, setContent] = useState('');
  const [isContentCached, setIsContentCached] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['Ready to execute...']);
  const [reviewResult, setReviewResult] = useState<CodeReviewResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isEli5, setIsEli5] = useState(settings.eli5Mode);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isQuizCached, setIsQuizCached] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);

  const stopExecutionRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const lesson = LESSONS.find(l => l.id === lessonId);
  const language = progress.selectedLanguage;

  const fetchLesson = async () => {
    if (!lesson || !language) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const { text, isCached } = await getLessonContent(language, lesson.title, isEli5);
      setContent(text);
      setIsContentCached(isCached);
      
      if (language === ProgrammingLanguage.PYTHON) setUserCode('print("Hello CodeSage!")');
      else if (language === ProgrammingLanguage.JAVASCRIPT) setUserCode('console.log("Hello CodeSage!");');
      else setUserCode('// Start coding here...');
    } catch (err) {
      setLoadError("Sage Matrix connection failed. Try refreshing.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLesson();
  }, [lessonId, language, isEli5]);

  const handleRunCode = async () => {
    if (!language) return;
    stopExecutionRef.current = false;
    setIsExecuting(true);
    setTerminalOutput(['Executing on Sage Virtual Machine...']);

    try {
      if (language === ProgrammingLanguage.JAVASCRIPT) {
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => logs.push(args.join(' '));
        try {
          new Function(userCode)();
          if (!stopExecutionRef.current) {
            setTerminalOutput(logs.length ? logs : ['Execution finished (no output).']);
          }
        } catch (e: any) {
          if (!stopExecutionRef.current) setTerminalOutput([`Runtime Error: ${e.message}`]);
        }
        console.log = originalLog;
      } else {
        const output = await simulateCodeExecution(language, userCode);
        if (!stopExecutionRef.current) setTerminalOutput(output.split('\n'));
      }
    } catch (e) {
      if (!stopExecutionRef.current) setTerminalOutput(['Execution failed. AI Simulator offline.']);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleStopCode = () => {
    stopExecutionRef.current = true;
    setIsExecuting(false);
    setTerminalOutput(prev => [...prev, '⏹️ Stopped by user.']);
  };

  const playAudio = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const buffer = await generateAudioLesson(content, audioContextRef.current);
      if (buffer) {
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => setIsSpeaking(false);
        source.start(0);
      } else {
        alert("Sage Summary is unavailable in Offline Cache Mode.");
        setIsSpeaking(false);
      }
    } catch (e) {
      console.error("Audio failed", e);
      setIsSpeaking(false);
    }
  };

  const fetchQuiz = async () => {
    if (!language || !lesson) return;
    setQuizLoading(true);
    try {
      const { questions, isCached } = await generateQuiz(language, lesson.title);
      setQuizQuestions(questions);
      setIsQuizCached(isCached);
      setQuizScore(0);
      setCurrentQuizIndex(0);
      setQuizFinished(false);
      setSelectedOption(null);
    } catch (e) {
      console.error("Quiz failed", e);
    } finally {
      setQuizLoading(false);
    }
  };

  if (!lesson || !language) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-700">
        <div className="glass rounded-[3rem] p-12 text-center max-w-xl shadow-2xl border border-slate-100 dark:border-white/10">
          <div className="text-8xl mb-8 animate-float">🧭</div>
          <h2 className="text-3xl font-black mb-4 tracking-tight">Path Lost</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-10">Select a specialization to begin your journey.</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/select-language')} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl">Select Path</button>
            <button onClick={() => navigate('/dashboard')} className="glass px-8 py-3 rounded-2xl font-black">Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-1000">
      <div className="glass p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
             <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">{lesson.title}</h1>
             {isContentCached && <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">Sage Cache</span>}
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-1">{language} Unit {lesson.order}</p>
        </div>
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl">
          {['content', 'sandbox', 'quiz'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-3 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-lg' : 'text-slate-500'}`}>{tab}</button>
          ))}
        </div>
      </div>

      <div className="glass rounded-[2.5rem] p-8 min-h-[600px] shadow-2xl relative overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6 animate-pulse">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-slate-400 uppercase text-xs">Syncing with Sage Matrix...</p>
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6 text-center">
            <div className="text-6xl">📡</div>
            <h3 className="text-xl font-bold">Transmission Error</h3>
            <p className="text-slate-500">{loadError}</p>
            <button onClick={fetchLesson} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold">Retry</button>
          </div>
        ) : (
          <>
            {activeTab === 'content' && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <button 
                    onClick={playAudio} 
                    disabled={isSpeaking}
                    className={`group flex items-center gap-3 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50`}
                  >
                    <span>{isSpeaking ? '⌛' : '🔊'}</span> {isSpeaking ? 'Sage is Speaking...' : 'Sage Summary'}
                  </button>
                  <label className="flex items-center gap-3 cursor-pointer bg-slate-50 dark:bg-slate-800 px-6 py-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <input type="checkbox" checked={isEli5} onChange={() => setIsEli5(!isEli5)} className="hidden" />
                    <span className="text-xl">{isEli5 ? '🧒' : '🎓'}</span>
                    <span className="text-xs font-black uppercase">{isEli5 ? 'ELI5 Mode' : 'Standard'}</span>
                  </label>
                </div>
                <div className="prose prose-lg prose-indigo dark:prose-invert max-w-none">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              </div>
            )}

            {activeTab === 'sandbox' && (
              <div className="flex flex-col h-[700px] gap-6 animate-in zoom-in-95 duration-500">
                <div className="flex justify-between items-center">
                   <h3 className="text-xl font-bold">Sage Sandbox</h3>
                   <div className="flex gap-3">
                     <button onClick={async () => {
                       setIsReviewing(true);
                       const r = await reviewUserCode(language, userCode);
                       setReviewResult(r);
                       setIsReviewing(false);
                     }} disabled={isReviewing} className="glass px-6 py-3 rounded-2xl font-bold text-sm text-indigo-600">
                        {isReviewing ? 'AI Scanning...' : 'Review Code ✨'}
                     </button>
                     {isExecuting ? (
                       <button onClick={handleStopCode} className="bg-rose-500 text-white px-8 py-3 rounded-2xl font-black">Stop ⏹️</button>
                     ) : (
                       <button onClick={handleRunCode} className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black shadow-xl">Run ▶</button>
                     )}
                   </div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
                  <div className="relative rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900">
                    <textarea 
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="w-full h-full bg-transparent text-emerald-400 font-mono p-8 pt-12 outline-none resize-none text-lg"
                      spellCheck="false"
                    />
                  </div>
                  <div className="flex flex-col rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 bg-black">
                    <div className="bg-slate-900 p-4 border-b border-slate-800 text-[10px] font-black text-slate-500">CONSOLE OUTPUT</div>
                    <div className="flex-1 p-6 font-mono text-sm overflow-y-auto no-scrollbar">
                      {terminalOutput.map((line, i) => (
                        <div key={i} className="flex gap-3 mb-1 text-slate-300">
                          <span className="text-slate-700">[{i+1}]</span>
                          <span className={line.toLowerCase().includes('error') ? 'text-rose-500' : ''}>{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {reviewResult && (
                  <div className="glass p-6 rounded-3xl border-l-8 border-l-indigo-500">
                    <h4 className="font-bold mb-2">Sage Feedback:</h4>
                    <p className="text-sm opacity-80">{reviewResult.explanation}</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'quiz' && (
              <div className="max-w-2xl mx-auto py-10">
                {quizLoading ? (
                  <div className="text-center animate-pulse flex flex-col items-center gap-4">
                    <span className="text-5xl">✍️</span>
                    <p className="font-bold text-slate-400">Sage is preparing questions...</p>
                  </div>
                ) : quizFinished ? (
                  <div className="text-center space-y-8">
                    <div className="text-8xl">🏆</div>
                    <h3 className="text-4xl font-black">Score: {quizScore}/{quizQuestions.length}</h3>
                    <button onClick={fetchQuiz} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg">Try Again</button>
                  </div>
                ) : quizQuestions.length > 0 ? (
                  <div className="space-y-8">
                    <div className="flex justify-between items-center mb-2">
                       <h3 className="text-2xl font-black">{quizQuestions[currentQuizIndex].question}</h3>
                       {isQuizCached && <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest h-fit">Offline</span>}
                    </div>
                    <div className="grid gap-4">
                      {quizQuestions[currentQuizIndex].options.map((option, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSelectedOption(i);
                            if (i === quizQuestions[currentQuizIndex].correctAnswerIndex) setQuizScore(s => s + 1);
                            setTimeout(() => {
                              if (currentQuizIndex < quizQuestions.length - 1) {
                                setCurrentQuizIndex(c => c + 1);
                                setSelectedOption(null);
                              } else setQuizFinished(true);
                            }, 1500);
                          }}
                          disabled={selectedOption !== null}
                          className={`w-full text-left p-6 rounded-3xl font-bold text-lg transition-all border-2 ${selectedOption === null ? 'bg-white dark:bg-slate-800 hover:border-indigo-500' : (selectedOption === i ? (i === quizQuestions[currentQuizIndex].correctAnswerIndex ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white') : (i === quizQuestions[currentQuizIndex].correctAnswerIndex ? 'bg-emerald-100 text-emerald-800' : 'bg-white dark:bg-slate-800 opacity-50'))}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <button onClick={fetchQuiz} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black">Start Quiz 📝</button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LessonPage;
