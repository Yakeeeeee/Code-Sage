
import { Lesson, ProgrammingLanguage, Achievement } from './types';

export const LESSONS: Lesson[] = [
  { id: 'intro', title: 'Introduction', description: 'What is this language and why use it?', order: 1 },
  { id: 'setup', title: 'Setup & Installation', description: 'Getting your environment ready.', order: 2 },
  { id: 'variables', title: 'Variables & Data Types', description: 'Storing and managing information.', order: 3 },
  { id: 'operators', title: 'Operators', description: 'Performing math and logic.', order: 4 },
  { id: 'conditionals', title: 'Conditionals (If/Else)', description: 'Making decisions in code.', order: 5 },
  { id: 'loops', title: 'Loops', description: 'Repeating actions efficiently.', order: 6 },
  { id: 'functions', title: 'Functions', description: 'Reusable blocks of code.', order: 7 },
  { id: 'project', title: 'Mini Project', description: 'Building something real.', order: 8 },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_step', title: 'First Step', description: 'Complete your first lesson.', icon: '👣', type: 'GLOBAL' },
  { id: 'quiz_master', title: 'Quiz Master', description: 'Get a perfect 100% on any quiz.', icon: '💯', type: 'GLOBAL' },
  { id: 'polyglot', title: 'The Polyglot', description: 'Start learning at least 3 different languages.', icon: '🌐', type: 'GLOBAL' },
  { id: 'dedicated', title: 'Dedicated Student', description: 'Complete 10 total lessons across any path.', icon: '🔥', type: 'GLOBAL' },
  
  // Language Specific Mastery
  { id: 'master_python', title: 'Pythonista', description: 'Complete all Python lessons.', icon: '🐍', type: 'LANGUAGE', language: ProgrammingLanguage.PYTHON },
  { id: 'master_javascript', title: 'Web Wizard', description: 'Complete all JavaScript lessons.', icon: '✨', type: 'LANGUAGE', language: ProgrammingLanguage.JAVASCRIPT },
  { id: 'master_java', title: 'Java Duke', description: 'Complete all Java lessons.', icon: '☕', type: 'LANGUAGE', language: ProgrammingLanguage.JAVA },
  { id: 'master_cpp', title: 'System Architect', description: 'Complete all C++ lessons.', icon: '⚙️', type: 'LANGUAGE', language: ProgrammingLanguage.CPP },
  { id: 'master_csharp', title: 'Unity Master', description: 'Complete all C# lessons.', icon: '🎮', type: 'LANGUAGE', language: ProgrammingLanguage.CSHARP },
  { id: 'master_php', title: 'Server Sage', description: 'Complete all PHP lessons.', icon: '🐘', type: 'LANGUAGE', language: ProgrammingLanguage.PHP },
  { id: 'master_swift', title: 'Apple Core', description: 'Complete all Swift lessons.', icon: '🍎', type: 'LANGUAGE', language: ProgrammingLanguage.SWIFT },
  { id: 'master_go', title: 'Cloud Gopher', description: 'Complete all Go lessons.', icon: '🐹', type: 'LANGUAGE', language: ProgrammingLanguage.GO },
  { id: 'master_sql', title: 'Data Guru', description: 'Complete all SQL lessons.', icon: '📊', type: 'LANGUAGE', language: ProgrammingLanguage.SQL },
  { id: 'master_rust', title: 'Iron Crab', description: 'Complete all Rust lessons.', icon: '🦀', type: 'LANGUAGE', language: ProgrammingLanguage.RUST },
];

export const LANGUAGE_DETAILS = {
  [ProgrammingLanguage.PYTHON]: {
    icon: '🐍',
    color: 'blue',
    description: 'A versatile language known for its simplicity and readability. Great for data science, AI, and web development.',
  },
  [ProgrammingLanguage.JAVASCRIPT]: {
    icon: 'JS',
    color: 'yellow',
    description: 'The language of the web. Essential for building interactive websites and full-stack applications.',
  },
  [ProgrammingLanguage.JAVA]: {
    icon: '☕',
    color: 'red',
    description: 'A powerful, platform-independent language used for large-scale enterprise systems and Android apps.',
  },
  [ProgrammingLanguage.CPP]: {
    icon: 'C++',
    color: 'indigo',
    description: 'A high-performance language used in game development, systems programming, and embedded systems.',
  },
  [ProgrammingLanguage.CSHARP]: {
    icon: 'C#',
    color: 'purple',
    description: 'Developed by Microsoft, C# is perfect for building Windows apps and high-end game development using Unity.',
  },
  [ProgrammingLanguage.PHP]: {
    icon: '🐘',
    color: 'blue',
    description: 'A veteran of the web. PHP powers millions of websites, including WordPress and Wikipedia.',
  },
  [ProgrammingLanguage.SWIFT]: {
    icon: '🍎',
    color: 'orange',
    description: 'The primary language for Apple platforms. Use it to build beautiful apps for iPhone, Mac, and Apple Watch.',
  },
  [ProgrammingLanguage.GO]: {
    icon: '🐹',
    color: 'cyan',
    description: 'Developed by Google, Go is designed for efficiency and scalability in cloud and network services.',
  },
  [ProgrammingLanguage.SQL]: {
    icon: '📊',
    color: 'blue',
    description: 'The standard language for managing and querying databases. Essential for any data-driven application.',
  },
  [ProgrammingLanguage.RUST]: {
    icon: '🦀',
    color: 'orange',
    description: 'A modern language focused on safety and performance. Loved by developers for its memory-safe features.',
  },
};
