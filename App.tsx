
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProgrammingLanguage, UserProgress, User, LanguageProgress } from './types';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import LanguageSelection from './pages/LanguageSelection';
import LessonPage from './pages/LessonPage';
import Dashboard from './pages/Dashboard';
import AboutPage from './pages/AboutPage';
import { Layout } from './components/Layout';
import { MockDB } from './services/database';
import { LESSONS } from './constants';

const DEFAULT_LANG_PROGRESS: LanguageProgress = {
  completedLessons: [],
  quizScores: {}
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const session = MockDB.getActiveSession();
    return session ? { username: session.username, avatarUrl: session.avatarUrl, id: session.id } : null;
  });

  const [progress, setProgress] = useState<UserProgress>(() => {
    const session = MockDB.getActiveSession();
    return session ? session.progress : { 
      selectedLanguage: null, 
      languageData: {},
      unlockedAchievements: [] 
    };
  });

  // Achievement Engine
  const checkAchievements = useCallback((updatedProgress: UserProgress) => {
    const newUnlocked = [...updatedProgress.unlockedAchievements];
    let changed = false;

    const totalLessons = Object.values(updatedProgress.languageData)
      .reduce((acc, curr) => acc + curr.completedLessons.length, 0);

    // Global: First Step
    if (!newUnlocked.includes('first_step') && totalLessons > 0) {
      newUnlocked.push('first_step');
      changed = true;
    }

    // Global: Dedicated
    if (!newUnlocked.includes('dedicated') && totalLessons >= 10) {
      newUnlocked.push('dedicated');
      changed = true;
    }

    // Global: Polyglot
    const languagesStarted = Object.keys(updatedProgress.languageData).length;
    if (!newUnlocked.includes('polyglot') && languagesStarted >= 3) {
      newUnlocked.push('polyglot');
      changed = true;
    }

    // Language Mastery Check
    (Object.keys(ProgrammingLanguage) as Array<keyof typeof ProgrammingLanguage>).forEach(key => {
      const langName = ProgrammingLanguage[key];
      const langData = updatedProgress.languageData[langName];
      const achievementId = `master_${langName.toLowerCase().replace(/[^a-z]/g, '')}`;
      
      if (langData && langData.completedLessons.length === LESSONS.length && !newUnlocked.includes(achievementId)) {
        newUnlocked.push(achievementId);
        changed = true;
      }
    });

    if (changed) {
      setProgress(prev => ({ ...prev, unlockedAchievements: newUnlocked }));
    }
  }, []);

  // Whenever progress changes, save it to the DB
  useEffect(() => {
    const session = MockDB.getActiveSession();
    if (session && user) {
      MockDB.updateProgress(session.id, progress);
    }
    // Only check achievements if we have a user
    if (user) {
      checkAchievements(progress);
    }
  }, [progress, user, checkAchievements]);

  const handleLogin = (username: string, provider: any = 'local') => {
    const sessionUser = MockDB.login(username, provider);
    setUser({ 
      username: sessionUser.username, 
      avatarUrl: sessionUser.avatarUrl, 
      id: sessionUser.id 
    });
    // Ensure default unlockedAchievements if missing from old data
    const userProg = sessionUser.progress;
    if (!userProg.unlockedAchievements) userProg.unlockedAchievements = [];
    setProgress(userProg);
  };

  const handleLogout = () => {
    MockDB.logout();
    setUser(null);
    setProgress({
      selectedLanguage: null,
      languageData: {},
      unlockedAchievements: []
    });
  };

  const updateSelectedLanguage = (lang: ProgrammingLanguage) => {
    setProgress(prev => ({
      ...prev,
      selectedLanguage: lang,
      languageData: {
        ...prev.languageData,
        [lang]: prev.languageData[lang] || { ...DEFAULT_LANG_PROGRESS }
      }
    }));
  };

  const saveQuizScore = (lessonId: string, score: number) => {
    const lang = progress.selectedLanguage;
    if (!lang) return;

    setProgress(prev => {
      const currentLangData = prev.languageData[lang] || { ...DEFAULT_LANG_PROGRESS };
      const newCompleted = currentLangData.completedLessons.includes(lessonId)
        ? currentLangData.completedLessons
        : [...currentLangData.completedLessons, lessonId];

      const newUnlocked = [...prev.unlockedAchievements];
      if (score === 100 && !newUnlocked.includes('quiz_master')) {
        newUnlocked.push('quiz_master');
      }

      return {
        ...prev,
        unlockedAchievements: newUnlocked,
        languageData: {
          ...prev.languageData,
          [lang]: {
            ...currentLangData,
            completedLessons: newCompleted,
            quizScores: {
              ...currentLangData.quizScores,
              [lessonId]: score
            }
          }
        }
      };
    });
  };

  return (
    <HashRouter>
      <Layout progress={progress} user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<LandingPage user={user} />} />
          <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <AuthPage onLogin={handleLogin} />} />
          <Route path="/about" element={<AboutPage />} />
          
          <Route 
            path="/select-language" 
            element={user ? <LanguageSelection onSelect={updateSelectedLanguage} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/lessons/:lessonId" 
            element={
              user ? (
                <LessonPage 
                  progress={progress} 
                  onQuizFinish={saveQuizScore}
                />
              ) : <Navigate to="/auth" />
            } 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard progress={progress} /> : <Navigate to="/auth" />} 
          />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
