
export enum ProgrammingLanguage {
  PYTHON = 'Python',
  JAVASCRIPT = 'JavaScript',
  JAVA = 'Java',
  CPP = 'C/C++',
  CSHARP = 'C#',
  PHP = 'PHP',
  SWIFT = 'Swift',
  GO = 'Go',
  SQL = 'SQL',
  RUST = 'Rust',
}

// Added missing Lesson interface as it is used in constants.ts
export interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
}

export type AchievementType = 'GLOBAL' | 'LANGUAGE';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: AchievementType;
  language?: ProgrammingLanguage;
}

export interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  email?: string;
}

export interface SavedSnippet {
  id: string;
  title: string;
  code: string;
  language: ProgrammingLanguage;
  timestamp: number;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  nextReview: number;
}

export interface UserProgress {
  selectedLanguage: ProgrammingLanguage | null;
  languageData: Record<string, {
    completedLessons: string[];
    quizScores: Record<string, number>;
    certificateUnlocked: boolean;
  }>;
  unlockedAchievements: string[];
  streak: {
    current: number;
    lastLogin: number;
  };
  savedSnippets: SavedSnippet[];
  flashcards: Flashcard[];
}

export interface AppSettings {
  darkMode: boolean;
  language: string;
  eli5Mode: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface CodeReviewResult {
  isBuggy: boolean;
  explanation: string;
  suggestions: string[];
  refactoredCode: string;
}
