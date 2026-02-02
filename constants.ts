
import { Lesson, ProgrammingLanguage, Achievement, QuizQuestion } from './types';

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
  { id: 'master_python', title: 'Pythonista', description: 'Complete all Python lessons.', icon: '🐍', type: 'LANGUAGE', language: ProgrammingLanguage.PYTHON },
  { id: 'master_javascript', title: 'Web Wizard', description: 'Complete all JavaScript lessons.', icon: '✨', type: 'LANGUAGE', language: ProgrammingLanguage.JAVASCRIPT },
];

export const LANGUAGE_DETAILS = {
  [ProgrammingLanguage.PYTHON]: { icon: '🐍', color: 'blue', description: 'A versatile language known for its simplicity. Great for AI and Data Science.' },
  [ProgrammingLanguage.JAVASCRIPT]: { icon: 'JS', color: 'yellow', description: 'The language of the web. Essential for interactive apps.' },
  [ProgrammingLanguage.JAVA]: { icon: '☕', color: 'red', description: 'Used for enterprise systems and Android apps.' },
  [ProgrammingLanguage.CPP]: { icon: 'C++', color: 'indigo', description: 'High-performance for games and systems.' },
  [ProgrammingLanguage.CSHARP]: { icon: 'C#', color: 'purple', description: 'Perfect for Windows and Unity development.' },
  [ProgrammingLanguage.PHP]: { icon: '🐘', color: 'blue', description: 'The veteran of web servers and WordPress.' },
  [ProgrammingLanguage.SWIFT]: { icon: '🍎', color: 'orange', description: 'Primary language for all Apple platforms.' },
  [ProgrammingLanguage.GO]: { icon: '🐹', color: 'cyan', description: 'Efficient and scalable cloud services.' },
  [ProgrammingLanguage.SQL]: { icon: '📊', color: 'blue', description: 'Standard for managing and querying data.' },
  [ProgrammingLanguage.RUST]: { icon: '🦀', color: 'orange', description: 'Focused on safety and performance.' },
};

/**
 * Hardcoded Offline Resources
 * Used as primary lookup to save quota and provide fallback during 429 errors.
 */
export const OFFLINE_RESOURCES: Record<string, { content: string; quiz: QuizQuestion[] }> = {
  [`${ProgrammingLanguage.PYTHON}_Introduction`]: {
    content: `
# Welcome to Python 🐍

Python is one of the world's most popular programming languages. It was created by **Guido van Rossum** and released in 1991.

### Why Python?
1. **Readable:** It looks a lot like the English language.
2. **Powerful:** It powers Google, NASA, and Netflix.
3. **Versatile:** Great for Web Dev, AI, and Automation.

### Your First Line
In Python, we use the \`print()\` function to show text on the screen:
\`\`\`python
print("Hello, World!")
\`\`\`

Python doesn't need semicolons or complex symbols to start. It's clean and beautiful!
`,
    quiz: [
      {
        question: "Who created Python?",
        options: ["Guido van Rossum", "Elon Musk", "Bill Gates", "Brendan Eich"],
        correctAnswerIndex: 0,
        explanation: "Guido van Rossum created Python in the late 1980s."
      },
      {
        question: "In what year was Python first released?",
        options: ["1985", "1991", "2000", "2010"],
        correctAnswerIndex: 1,
        explanation: "Python was released in 1991."
      },
      {
        question: "Which function is used to output text to the console?",
        options: ["display()", "write()", "print()", "show()"],
        correctAnswerIndex: 2,
        explanation: "The print() function is the standard way to output text."
      },
      {
        question: "Is Python a case-sensitive language?",
        options: ["Yes", "No", "Only for functions", "Only for strings"],
        correctAnswerIndex: 0,
        explanation: "Yes, 'Variable' and 'variable' are different in Python."
      },
      {
        question: "Which symbol is used to start a single-line comment in Python?",
        options: ["//", "/*", "#", "--"],
        correctAnswerIndex: 2,
        explanation: "The hash symbol (#) is used for comments."
      },
      {
        question: "What is the correct file extension for Python files?",
        options: [".pt", ".py", ".pyt", ".python"],
        correctAnswerIndex: 1,
        explanation: "Python files use the .py extension."
      },
      {
        question: "How do you define a block of code in Python?",
        options: ["Using Curly Braces {}", "Using Parentheses ()", "Using Indentation (Spaces)", "Using Semicolons ;"],
        correctAnswerIndex: 2,
        explanation: "Python uses whitespace/indentation to group code blocks."
      },
      {
        question: "Which of the following is a valid variable name?",
        options: ["2myvar", "my-var", "my_var", "my var"],
        correctAnswerIndex: 2,
        explanation: "Variable names must start with a letter/underscore and contain no spaces or hyphens."
      },
      {
        question: "Is Python considered an Interpreted or Compiled language?",
        options: ["Compiled", "Interpreted", "Neither", "Both"],
        correctAnswerIndex: 1,
        explanation: "Python is primarily an interpreted language."
      },
      {
        question: "What is the output of print(2 + 3)?",
        options: ["'2+3'", "5", "23", "Error"],
        correctAnswerIndex: 1,
        explanation: "Python evaluates the math expression and prints the result, 5."
      }
    ]
  },
  [`${ProgrammingLanguage.JAVASCRIPT}_Introduction`]: {
    content: `
# Welcome to JavaScript ✨

JavaScript is the **engine of the modern web**. Every time you see an animation, a map, or a live update on a website, JavaScript is likely behind it.

### Core Strengths
- **Ubiquity:** Every browser has it built-in.
- **Speed:** It runs directly on your computer (client-side).
- **Ecosystem:** Thousands of libraries to build anything.

### Your First Line
In JavaScript, we use \`console.log()\` to see output:
\`\`\`javascript
console.log("Hello, World!");
\`\`\`

JS is dynamic and flexible, making it the perfect choice for creative developers!
`,
    quiz: [
      {
        question: "What is JavaScript's primary use?",
        options: ["Making coffee", "Adding interactivity to websites", "Styling text only", "Managing hard drives"],
        correctAnswerIndex: 1,
        explanation: "JS is used to make websites interactive."
      },
      {
        question: "Who created JavaScript?",
        options: ["Guido van Rossum", "Brendan Eich", "James Gosling", "Tim Berners-Lee"],
        correctAnswerIndex: 1,
        explanation: "Brendan Eich created JS in 10 days at Netscape."
      },
      {
        question: "What was the original name of JavaScript?",
        options: ["Mocha", "JavaLite", "Scripty", "ECMA"],
        correctAnswerIndex: 0,
        explanation: "It was originally called Mocha, then LiveScript, then JavaScript."
      },
      {
        question: "Which command outputs text to the developer console?",
        options: ["print()", "log.info()", "console.log()", "document.write()"],
        correctAnswerIndex: 2,
        explanation: "console.log() is the standard debugging output command."
      },
      {
        question: "What is the correct file extension for JavaScript?",
        options: [".js", ".java", ".jscript", ".script"],
        correctAnswerIndex: 0,
        explanation: "JavaScript files use the .js extension."
      },
      {
        question: "Which keyword is used to declare a constant variable?",
        options: ["var", "let", "const", "fixed"],
        correctAnswerIndex: 2,
        explanation: "const is used for variables that should not be reassigned."
      },
      {
        question: "How do you write a single-line comment in JS?",
        options: ["# Comment", "// Comment", "/* Comment", "-- Comment"],
        correctAnswerIndex: 1,
        explanation: "Two slashes (//) start a single-line comment."
      },
      {
        question: "Is JavaScript the same as Java?",
        options: ["Yes", "No", "Only on Sundays", "They are brothers"],
        correctAnswerIndex: 1,
        explanation: "No. JavaScript and Java are completely different languages."
      },
      {
        question: "What does DOM stand for in web development?",
        options: ["Data Object Model", "Document Object Model", "Digital Online Module", "Direct Output Method"],
        correctAnswerIndex: 1,
        explanation: "The Document Object Model is how JS interacts with HTML."
      },
      {
        question: "Which symbol is used for the assignment operator?",
        options: ["==", "===", "=", ":"],
        correctAnswerIndex: 2,
        explanation: "The single equals sign (=) assigns a value to a variable."
      }
    ]
  }
};
