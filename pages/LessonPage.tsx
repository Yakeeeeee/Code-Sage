
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { UserProgress, QuizQuestion, AppSettings, CodeReviewResult, ProgrammingLanguage } from '../types';
import { LESSONS } from '../constants';
import { getLessonContent, generateQuiz, reviewUserCode, generateAudioLesson, simulateCodeExecution } from '../services/geminiService';

const LessonPage: React.FC<{ progress: UserProgress, settings: AppSettings, updateProgress: (u: (p: UserProgress) => UserProgress) => void }> = ({ progress, settings, updateProgress }) => {
  const { lessonId } = useParams();
  const [activeTab, setActiveTab] = useState<'content' | 'sandbox' | 'quiz'>('content');
  const [content, setContent] = useState('');
  const [userCode, setUserCode] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['Ready to execute...']);
  const [reviewResult, setReviewResult] = useState<CodeReviewResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isEli5, setIsEli5] = useState(settings.eli5Mode);
  const [isLoading, setIsLoading] = useState(true);
  
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);

  // Ref to handle cancellation of AI execution
  const stopExecutionRef = useRef(false);

  const lesson = LESSONS.find(l => l.id === lessonId);
  const language = progress.selectedLanguage;

  useEffect(() => {
    if (!lesson || !language) return;
    const fetch = async () => {
      setIsLoading(true);
      const data = await getLessonContent(language, lesson.title, isEli5);
      setContent(data);
      setIsLoading(false);
      
      // Default starter code based on language
      if (language === ProgrammingLanguage.PYTHON) setUserCode('print("Hello CodeSage!")');
      else if (language === ProgrammingLanguage.JAVASCRIPT) setUserCode('console.log("Hello CodeSage!");');
      else setUserCode('// Start coding here...');
    };
    fetch();
  }, [lessonId, language, isEli5]);

  const handleRunCode = async () => {
    if (!language) return;
    stopExecutionRef.current = false;
    setIsExecuting(true);
    setTerminalOutput(['Compiling & Running...']);

    try {
      if (language === ProgrammingLanguage.JAVASCRIPT) {
        // Local execution for JS
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => logs.push(args.join(' '));
        try {
          // Wrap in timeout to check for early termination if needed (limited)
          new Function(userCode)();
          if (!stopExecutionRef.current) {
            setTerminalOutput(logs.length ? logs : ['Code executed successfully (no output).']);
          }
        } catch (e: any) {
          if (!stopExecutionRef.current) {
            setTerminalOutput([`Runtime Error: ${e.message}`]);
          }
        }
        console.log = originalLog;
      } else {
        // AI Simulation for other languages
        const output = await simulateCodeExecution(language, userCode);
        if (!stopExecutionRef.current) {
          setTerminalOutput(output.split('\n'));
        }
      }
    } catch (e) {
      if (!stopExecutionRef.current) {
        setTerminalOutput(['Execution failed. AI Simulator offline.']);
      }
    } finally {
      setIsExecuting(false);
    }
  };

  const handleStopCode = () => {
    stopExecutionRef.current = true;
    setIsExecuting(false);
    setTerminalOutput(prev => [...prev, '⏹️ Execution stopped by user.']);
  };

  const handleReview = async () => {
    if (!language) return;
    setIsReviewing(true);
    const result = await reviewUserCode(language, userCode);
    setReviewResult(result);
    setIsReviewing(false);
  };

  if (!lesson || !language) return <div className="p-10 text-center glass rounded-3xl mt-20">Path error. Please select a language.</div>;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-1000">
      {/* Header Card */}
      <div className="glass p-6 rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">{lesson.title}</h1>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mt-1">{language} Path • Unit {lesson.order}</p>
        </div>
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-full md:w-auto">
          {['content', 'sandbox', 'quiz'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xl scale-105' : 'text-slate-500 hover:bg-white/50'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Area */}
      <div className="glass rounded-[2.5rem] p-8 min-h-[600px] shadow-2xl relative overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6 animate-pulse">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-slate-400 tracking-widest uppercase text-xs">Syncing with Sage Matrix...</p>
          </div>
        ) : (
          <>
            {activeTab === 'content' && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <button onClick={() => generateAudioLesson(content).then(d => d && new Audio(`data:audio/wav;base64,${d}`).play())} className="group flex items-center gap-3 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-indigo-500/20">
                    <span>🔊</span> Summarize Audio
                  </button>
                  <label className="flex items-center gap-3 cursor-pointer bg-slate-50 dark:bg-slate-800 px-6 py-3 rounded-2xl border border-slate-100 dark:border-slate-700 hover:bg-slate-100 transition-colors">
                    <input type="checkbox" checked={isEli5} onChange={() => setIsEli5(!isEli5)} className="hidden" />
                    <span className="text-xl">{isEli5 ? '🧒' : '🎓'}</span>
                    <span className="text-xs font-black uppercase tracking-widest">{isEli5 ? 'ELI5 Enabled' : 'Mastery Mode'}</span>
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
                   <h3 className="text-xl font-bold flex items-center gap-3">
                     <span className="bg-indigo-600 text-white p-2 rounded-lg text-xs">IDE</span>
                     Integrated Terminal
                   </h3>
                   <div className="flex gap-3">
                     <button onClick={handleReview} disabled={isReviewing || isExecuting} className="glass px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 disabled:opacity-50">
                        {isReviewing ? 'AI Scanning...' : 'Review ✨'}
                     </button>
                     {isExecuting ? (
                       <button onClick={handleStopCode} className="bg-rose-500 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-rose-500/20 hover:scale-105 active:scale-95 transition-all">
                         Stop ⏹️
                       </button>
                     ) : (
                       <button onClick={handleRunCode} className="bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all">
                         Run Code ▶
                       </button>
                     )}
                   </div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 h-full overflow-hidden">
                  <div className="relative group rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900">
                    <div className="absolute top-4 right-6 text-[10px] font-black text-slate-500 uppercase tracking-widest z-10">{language} EDITOR</div>
                    <textarea 
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="w-full h-full bg-transparent text-emerald-400 font-mono p-8 pt-12 outline-none resize-none text-lg leading-relaxed selection:bg-indigo-500/30"
                      spellCheck="false"
                      disabled={isExecuting}
                    />
                  </div>
                  
                  <div className="flex flex-col rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 bg-black shadow-inner">
                    <div className="bg-slate-900 p-4 border-b border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Console Output</span>
                      <button onClick={() => setTerminalOutput(['Cleared console.'])} className="text-[10px] text-slate-400 hover:text-white uppercase font-bold">Clear</button>
                    </div>
                    <div className="flex-1 p-6 font-mono text-sm overflow-y-auto no-scrollbar">
                      {terminalOutput.map((line, i) => (
                        <div key={i} className="flex gap-3 mb-1 animate-in slide-in-from-left-2">
                          <span className="text-slate-700">[{i+1}]</span>
                          <span className={line.toLowerCase().includes('error') ? 'text-rose-500' : 'text-slate-300'}>
                            {line || '\u00A0'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {reviewResult && (
                  <div className="glass p-6 rounded-3xl border-l-8 border-l-indigo-500 animate-in slide-in-from-top-2">
                    <h4 className="font-bold mb-2">Sage Feedback:</h4>
                    <p className="text-sm opacity-80">{reviewResult.explanation}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Quiz Tab */}
            {activeTab === 'quiz' && (
              <div className="max-w-2xl mx-auto py-10">
                {quizLoading ? (
                  <div className="text-center animate-pulse flex flex-col items-center gap-4">
                    <span className="text-5xl">✍️</span>
                    <p className="font-bold text-slate-400">Sage is writing your exam...</p>
                  </div>
                ) : quizFinished ? (
                  <div className="text-center space-y-8 animate-in zoom-in-95 duration-500">
                    <div className="text-8xl">🏆</div>
                    <div>
                      <h3 className="text-4xl font-black mb-2">Quiz Complete!</h3>
                      <p className="text-slate-500 text-xl">You scored <span className="text-indigo-600 font-black">{quizScore}/{quizQuestions.length}</span></p>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-950/30 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-900/50">
                      <p className="font-bold text-indigo-900 dark:text-indigo-200 mb-4">
                        {quizScore === quizQuestions.length ? "Perfect score! You're a true Sage." : "Good effort! Practice makes perfect."}
                      </p>
                      <button 
                        onClick={async () => {
                          setQuizLoading(true);
                          const qs = await generateQuiz(language, lesson.title);
                          setQuizQuestions(qs);
                          setQuizScore(0);
                          setCurrentQuizIndex(0);
                          setQuizFinished(false);
                          setSelectedOption(null);
                          setQuizLoading(false);
                        }} 
                        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : quizQuestions.length > 0 ? (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="flex justify-between items-center text-xs font-black text-slate-400 uppercase tracking-widest">
                      <span>Question {currentQuizIndex + 1} of {quizQuestions.length}</span>
                      <span className="text-indigo-600">Progress: {Math.round(((currentQuizIndex + 1) / quizQuestions.length) * 100)}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%` }}></div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{quizQuestions[currentQuizIndex].question}</h3>
                    <div className="grid gap-4">
                      {quizQuestions[currentQuizIndex].options.map((option, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSelectedOption(i);
                            if (i === quizQuestions[currentQuizIndex].correctAnswerIndex) {
                              setQuizScore(prev => prev + 1);
                            }
                            setTimeout(() => {
                              if (currentQuizIndex < quizQuestions.length - 1) {
                                setCurrentQuizIndex(prev => prev + 1);
                                setSelectedOption(null);
                              } else {
                                setQuizFinished(true);
                              }
                            }, 1500);
                          }}
                          disabled={selectedOption !== null}
                          className={`
                            w-full text-left p-6 rounded-3xl font-bold text-lg transition-all border-2
                            ${selectedOption === null ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-indigo-500 hover:scale-[1.02]' : ''}
                            ${selectedOption === i ? (i === quizQuestions[currentQuizIndex].correctAnswerIndex ? 'bg-emerald-500 text-white border-emerald-500 shadow-xl' : 'bg-rose-500 text-white border-rose-500 shadow-xl') : ''}
                            ${selectedOption !== null && i === quizQuestions[currentQuizIndex].correctAnswerIndex && selectedOption !== i ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 text-emerald-700 dark:text-emerald-300' : ''}
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {selectedOption === i && (
                                <span>{i === quizQuestions[currentQuizIndex].correctAnswerIndex ? '✅' : '❌'}</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    {selectedOption !== null && (
                      <div className="glass p-6 rounded-3xl border border-dashed animate-in slide-in-from-top-2">
                        <p className="text-sm text-slate-600 dark:text-slate-400"><strong>Explanation:</strong> {quizQuestions[currentQuizIndex].explanation}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <button 
                      onClick={async () => {
                        setQuizLoading(true);
                        const qs = await generateQuiz(language, lesson.title);
                        setQuizQuestions(qs);
                        setQuizLoading(false);
                      }}
                      className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl"
                    >
                      Start Lesson Quiz 📝
                    </button>
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
