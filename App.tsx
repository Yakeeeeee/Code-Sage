
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProgrammingLanguage, UserProgress, User, AppSettings, SavedSnippet, Flashcard } from './types';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import LanguageSelection from './pages/LanguageSelection';
import LessonPage from './pages/LessonPage';
import Dashboard from './pages/Dashboard';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';
import FlashcardsPage from './pages/FlashcardsPage';
import CookbookPage from './pages/CookbookPage';
import InterviewerPage from './pages/InterviewerPage';
import { Layout } from './components/Layout';
import { MockDB } from './services/database';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const session = MockDB.getActiveSession();
    return session ? { username: session.username, avatarUrl: session.avatarUrl, id: session.id } : null;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('codesage_settings');
    return saved ? JSON.parse(saved) : { darkMode: false, language: 'en', eli5Mode: false };
  });

  const [progress, setProgress] = useState<UserProgress>(() => {
    const session = MockDB.getActiveSession();
    return session ? session.progress : { 
      selectedLanguage: null, 
      languageData: {},
      unlockedAchievements: [],
      streak: { current: 0, lastLogin: 0 },
      savedSnippets: [],
      flashcards: []
    };
  });

  useEffect(() => {
    localStorage.setItem('codesage_settings', JSON.stringify(settings));
    if (settings.darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [settings]);

  // Save progress to MockDB whenever it changes
  useEffect(() => {
    if (user) {
      MockDB.updateProgress(user.id, progress);
    }
  }, [progress, user]);

  const handleLogin = (username: string, provider: any = 'local') => {
    const sessionUser = MockDB.login(username, provider);
    setUser({ username: sessionUser.username, avatarUrl: sessionUser.avatarUrl, id: sessionUser.id });
    setProgress(sessionUser.progress);
  };

  const handleLogout = () => {
    MockDB.logout();
    setUser(null);
  };

  const updateProgress = (updater: (prev: UserProgress) => UserProgress) => {
    setProgress(prev => updater(prev));
  };

  return (
    <HashRouter>
      <Layout 
        progress={progress} 
        user={user} 
        onLogout={handleLogout}
        settings={settings}
        onSettingsChange={setSettings}
      >
        <Routes>
          <Route path="/" element={<LandingPage user={user} />} />
          <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage onLogin={handleLogin} />} />
          <Route path="/dashboard" element={user ? <Dashboard progress={progress} /> : <Navigate to="/auth" />} />
          <Route path="/lessons/:lessonId" element={user ? <LessonPage progress={progress} settings={settings} updateProgress={updateProgress} /> : <Navigate to="/auth" />} />
          <Route path="/flashcards" element={user ? <FlashcardsPage progress={progress} updateProgress={updateProgress} /> : <Navigate to="/auth" />} />
          <Route path="/cookbook" element={user ? <CookbookPage progress={progress} updateProgress={updateProgress} /> : <Navigate to="/auth" />} />
          <Route path="/interviewer" element={user ? <InterviewerPage progress={progress} /> : <Navigate to="/auth" />} />
          <Route path="/settings" element={user ? <SettingsPage user={user} settings={settings} onSettingsChange={setSettings} progress={progress} /> : <Navigate to="/auth" />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/select-language" element={<LanguageSelection onSelect={(l) => setProgress(p => ({...p, selectedLanguage: l}))} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
