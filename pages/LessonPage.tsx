
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { UserProgress, ChatMessage, QuizQuestion } from '../types';
import { LESSONS } from '../constants';
import { getLessonContent, chatWithTutor, generateQuiz } from '../services/geminiService';

interface LessonPageProps {
  progress: UserProgress;
  onQuizFinish: (lessonId: string, score: number) => void;
}

const LessonPage: React.FC<LessonPageProps> = ({ progress, onQuizFinish }) => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'content' | 'tutor' | 'quiz'>('content');
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Chat state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizResult, setQuizResult] = useState<{ score: number, finished: boolean } | null>(null);

  const lesson = LESSONS.find(l => l.id === lessonId);
  const language = progress.selectedLanguage;

  useEffect(() => {
    if (!lesson || !language) return;

    const fetchContent = async () => {
      setIsLoading(true);
      setActiveTab('content');
      setChatHistory([]);
      setQuizQuestions([]);
      setQuizResult(null);
      setCurrentQuizIndex(0);
      setCorrectCount(0);
      setIsAnswerSubmitted(false);
      setSelectedAnswer(null);
      
      try {
        const data = await getLessonContent(language, lesson.title);
        setContent(data || 'Failed to load content.');
      } catch (err) {
        setContent('Error loading lesson. Please check your API key.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [lessonId, language]);

  useEffect(() => {
    if (activeTab === 'tutor') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, activeTab]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !language || !lesson || isChatLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: userInput };
    setChatHistory(prev => [...prev, userMsg]);
    setUserInput('');
    setIsChatLoading(true);

    try {
      const response = await chatWithTutor(language, lesson.title, chatHistory, userInput);
      setChatHistory(prev => [...prev, { role: 'model', content: response || 'Sorry, I lost my train of thought.' }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'model', content: 'Oops! I had a glitch. Try again?' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const startQuiz = async () => {
    if (!language || !lesson) return;
    setIsLoading(true);
    try {
      const questions = await generateQuiz(language, lesson.title);
      setQuizQuestions(questions);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === quizQuestions[currentQuizIndex].correctAnswerIndex;
    if (isCorrect) setCorrectCount(prev => prev + 1);
    
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const finalScore = Math.round(( (selectedAnswer === quizQuestions[currentQuizIndex].correctAnswerIndex ? correctCount + 1 : correctCount) / quizQuestions.length) * 100);
      setQuizResult({ score: finalScore, finished: true });
      onQuizFinish(lesson!.id, finalScore);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!lesson || !language) return <div>Lesson not found.</div>;

  return (
    <div className="flex flex-col min-h-full">
      {/* Header & Tabs */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
            <span>/</span>
            <span className="text-gray-900">{lesson.title}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{lesson.title}</h1>
        </div>
        
        <div className="flex p-1 bg-gray-100 rounded-2xl self-start">
          <button 
            onClick={() => setActiveTab('content')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'content' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            📖 Lesson
          </button>
          <button 
            onClick={() => setActiveTab('tutor')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'tutor' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            🤖 Tutor
          </button>
          <button 
            onClick={() => setActiveTab('quiz')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'quiz' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            ✏️ Quiz
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="bg-white border rounded-3xl shadow-sm p-6 md:p-10 mb-24 transition-all animate-in fade-in zoom-in-95 duration-300">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-100 border-t-indigo-600 mb-6"></div>
            <p className="text-gray-500 font-bold text-lg animate-pulse">Loading {activeTab} content...</p>
          </div>
        )}

        {!isLoading && activeTab === 'content' && (
          <div className="prose prose-indigo max-w-none prose-pre:bg-gray-900 prose-pre:rounded-2xl prose-code:text-indigo-600">
            <ReactMarkdown
              components={{
                code({node, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '')
                  return match ? (
                    <div className="relative group my-6">
                       <div className="absolute right-4 top-4 text-xs font-mono text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase">{match[1]}</div>
                       <SyntaxHighlighter
                        style={dracula as any}
                        language={match[1]}
                        PreTag="div"
                        className="!rounded-2xl !p-6 shadow-xl"
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className="bg-indigo-50 px-2 py-0.5 rounded text-indigo-700 font-mono text-sm border border-indigo-100" {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {content}
            </ReactMarkdown>
            
            <div className="mt-16 pt-10 border-t flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3 text-gray-500">
                <span className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">✓</span>
                <span className="font-medium">Finished reading? Time for a quick recap.</span>
              </div>
              <button 
                onClick={() => { setActiveTab('quiz'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 hover:-translate-y-1"
              >
                Start Quiz →
              </button>
            </div>
          </div>
        )}

        {!isLoading && activeTab === 'tutor' && (
          <div className="flex flex-col space-y-8 min-h-[400px]">
            {chatHistory.length === 0 && (
              <div className="text-center py-16 px-6 max-w-2xl mx-auto">
                <div className="text-6xl mb-6 scale-110">🤖</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Ask CodeSage Anything</h3>
                <p className="text-gray-600 mb-10 text-lg">Confused about a concept? Need another example? Just ask! I'm here to help you master {language}.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Give me a real-world analogy",
                    "Explain the code line-by-line",
                    "What's a common beginner mistake here?",
                    "Give me a mini challenge"
                  ].map(prompt => (
                    <button 
                      key={prompt}
                      onClick={() => setUserInput(prompt)}
                      className="bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 text-gray-600 text-sm font-semibold py-4 px-6 rounded-2xl transition-all border border-gray-100 hover:border-indigo-100 text-left flex justify-between items-center group"
                    >
                      <span>"{prompt}"</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-6">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                  <div className={`
                    max-w-[90%] md:max-w-[80%] p-5 rounded-2xl shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100'}
                  `}>
                    <div className={`prose prose-sm ${msg.role === 'user' ? 'prose-invert' : 'prose-indigo'} max-w-none`}>
                       <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 p-5 rounded-2xl rounded-tl-none border border-gray-100 flex gap-2 items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">CodeSage is thinking</span>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>
        )}

        {!isLoading && activeTab === 'quiz' && (
          <div className="flex flex-col items-center">
            {quizQuestions.length === 0 ? (
              <div className="text-center py-10 max-w-lg">
                <div className="text-6xl mb-8">🎯</div>
                <h3 className="text-3xl font-bold mb-4">Challenge Yourself</h3>
                <p className="text-gray-600 mb-10 text-lg leading-relaxed">
                  We'll generate a personalized quiz of 5-10 questions for {language}. 
                  Get a high score to complete this lesson!
                </p>
                <button 
                  onClick={startQuiz}
                  className="bg-indigo-600 text-white w-full py-5 rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-all shadow-xl hover:shadow-indigo-100 hover:-translate-y-1"
                >
                  Generate My Quiz
                </button>
              </div>
            ) : quizResult ? (
              <div className="text-center py-10 max-w-lg animate-in zoom-in duration-500">
                <div className="text-8xl mb-8">{quizResult.score >= 70 ? '🏆' : '💪'}</div>
                <h3 className="text-4xl font-black mb-3">{quizResult.score >= 70 ? 'Excellent Work!' : 'Keep Practicing!'}</h3>
                <p className="text-gray-600 mb-10 text-lg font-medium">You scored {quizResult.score}% on the {lesson.title} quiz.</p>
                <div className={`p-8 rounded-3xl mb-10 border-2 shadow-sm inline-block w-full ${quizResult.score >= 70 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                  <div className="text-xs uppercase font-black tracking-[0.2em] mb-2 opacity-60">Success Rate</div>
                  <div className="text-6xl font-black">{quizResult.score}%</div>
                </div>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-indigo-600 text-white w-full py-5 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <div className="w-full max-w-3xl">
                <div className="mb-10 sticky top-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-100 z-10 shadow-sm">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-sm font-black text-indigo-600 uppercase tracking-widest">Question {currentQuizIndex + 1} of {quizQuestions.length}</span>
                    <span className="text-gray-900 font-bold bg-gray-100 px-3 py-1 rounded-full text-xs">
                      {Math.round(((currentQuizIndex) / quizQuestions.length) * 100)}% Complete
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 transition-all duration-700 ease-out" 
                      style={{ width: `${((currentQuizIndex) / quizQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="animate-in slide-in-from-right-4 duration-300">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 leading-tight">
                    {quizQuestions[currentQuizIndex].question}
                  </h3>
                  
                  <div className="grid gap-4 mb-8">
                    {quizQuestions[currentQuizIndex].options.map((option, i) => {
                      const isCorrect = i === quizQuestions[currentQuizIndex].correctAnswerIndex;
                      const isSelected = selectedAnswer === i;
                      
                      let variantClasses = "border-gray-100 hover:border-indigo-200 hover:bg-gray-50";
                      if (isAnswerSubmitted) {
                        if (isCorrect) variantClasses = "border-green-500 bg-green-50 ring-2 ring-green-100";
                        else if (isSelected) variantClasses = "border-red-500 bg-red-50 ring-2 ring-red-100";
                        else variantClasses = "border-gray-100 opacity-50";
                      } else if (isSelected) {
                        variantClasses = "border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-100";
                      }

                      return (
                        <button
                          key={i}
                          disabled={isAnswerSubmitted}
                          onClick={() => setSelectedAnswer(i)}
                          className={`
                            w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 group relative
                            ${variantClasses}
                          `}
                        >
                          <div className="flex items-center gap-5">
                            <span className={`
                              w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-sm transition-colors
                              ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-400'}
                              ${isAnswerSubmitted && isCorrect ? '!bg-green-600 !text-white' : ''}
                              ${isAnswerSubmitted && isSelected && !isCorrect ? '!bg-red-600 !text-white' : ''}
                            `}>
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className={`font-bold text-lg ${isSelected ? 'text-indigo-900' : 'text-gray-700'} ${isAnswerSubmitted && isCorrect ? '!text-green-900' : ''}`}>
                              {option}
                            </span>
                          </div>
                          {isAnswerSubmitted && isCorrect && (
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-green-600 font-bold flex items-center gap-2">
                              <span>Correct</span>
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswerSubmitted && (
                    <div className="mb-10 p-6 bg-indigo-50 border border-indigo-100 rounded-3xl animate-in fade-in slide-in-from-top-4">
                      <h4 className="font-black text-indigo-900 uppercase tracking-widest text-xs mb-2">CodeSage Explanation</h4>
                      <p className="text-indigo-800 leading-relaxed">
                        {quizQuestions[currentQuizIndex].explanation}
                      </p>
                    </div>
                  )}
                  
                  <button
                    onClick={isAnswerSubmitted ? handleNextQuestion : handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="bg-indigo-600 text-white w-full py-5 rounded-2xl font-bold text-xl hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-indigo-200 active:scale-95"
                  >
                    {!isAnswerSubmitted ? 'Check Answer' : (currentQuizIndex === quizQuestions.length - 1 ? 'Finish & See Results' : 'Proceed to Next Question')}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed Tutor Input */}
      {activeTab === 'tutor' && !isLoading && (
        <div className="fixed bottom-0 left-0 right-0 md:left-64 p-4 md:p-6 bg-gradient-to-t from-gray-50 via-gray-50/90 to-transparent z-20 transition-all animate-in slide-in-from-bottom-10">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex gap-2 items-center bg-white p-2 md:p-3 rounded-2xl border shadow-2xl focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask your coding question..."
                className="flex-1 bg-transparent border-none p-2 md:p-3 outline-none text-gray-900 font-medium placeholder:text-gray-400"
              />
              <button 
                type="submit"
                disabled={isChatLoading || !userInput.trim()}
                className="bg-indigo-600 text-white p-3 md:px-6 md:py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-20 transition-all flex items-center gap-2 group"
              >
                <span className="hidden md:inline">Ask Sage</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPage;
