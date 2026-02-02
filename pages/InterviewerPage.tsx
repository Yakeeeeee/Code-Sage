
import React, { useState, useEffect, useRef } from 'react';
import { UserProgress, ChatMessage } from '../types';
import { chatWithTutor } from '../services/geminiService';

const InterviewerPage: React.FC<{ progress: UserProgress }> = ({ progress }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial message
    if (messages.length === 0) {
      setMessages([{ 
        role: 'model', 
        content: `Welcome to the Technical Interview room. I'm your host, CodeSage. We'll be focusing on ${progress.selectedLanguage || 'programming'}. Are you ready to start the simulation?` 
      }]);
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const response = await chatWithTutor(
        progress.selectedLanguage || ('' as any),
        "Mock Interview Session",
        messages,
        userMsg,
        'interviewer'
      );
      setMessages(prev => [...prev, { role: 'model', content: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', content: "Simulation error. Let's try that again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6 pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight">AI Interviewer 🎙️</h1>
          <p className="text-gray-500 font-bold">Roleplay mock technical interviews.</p>
        </div>
        <button onClick={() => setMessages([])} className="text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors">Reset Room</button>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-[2.5rem] flex flex-col overflow-hidden shadow-sm h-[600px]">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[85%] p-6 rounded-[2rem] text-lg leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white shadow-xl rounded-tr-none' : 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-[2rem] rounded-tl-none flex gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-800">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Speak your mind, candidate..."
              className="w-full bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 p-5 pr-20 rounded-2xl font-bold outline-none focus:border-indigo-600 transition-all shadow-sm"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="absolute right-3 bg-indigo-600 text-white p-3 rounded-xl shadow-lg hover:scale-110 active:scale-95 disabled:opacity-50 transition-all"
            >
              🚀
            </button>
          </form>
          <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4">Simulation Active • Powered by Gemini 3</p>
        </div>
      </div>
    </div>
  );
};

export default InterviewerPage;
