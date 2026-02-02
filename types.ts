
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

export interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface LanguageProgress {
  completedLessons: string[];
  quizScores: Record<string, number>;
}

export interface UserProgress {
  selectedLanguage: ProgrammingLanguage | null;
  languageData: Record<string, LanguageProgress>;
  unlockedAchievements: string[];
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

export interface Quiz {
  lessonId: string;
  questions: QuizQuestion[];
}
