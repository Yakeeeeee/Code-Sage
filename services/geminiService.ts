
import { GoogleGenAI, Type } from "@google/genai";
import { ProgrammingLanguage, ChatMessage, QuizQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getLessonContent = async (language: ProgrammingLanguage, lessonTitle: string) => {
  const prompt = `You are a beginner-friendly programming tutor. 
    Explain the topic "${lessonTitle}" for the programming language "${language}".
    
    Structure your response using Markdown:
    1. A clear, high-level introduction using real-world analogies.
    2. Core concepts explained simply.
    3. 2-3 code examples with line-by-line comments.
    4. A 'Pro-Tip' section for best practices.
    
    Avoid jargon. If you must use a technical term, define it first.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      temperature: 0.7,
    },
  });

  return response.text;
};

export const chatWithTutor = async (
  language: ProgrammingLanguage,
  lessonTitle: string,
  history: ChatMessage[],
  userInput: string
) => {
  const systemInstruction = `You are "CodeSage", a friendly and patient AI programming tutor for absolute beginners. 
    The student is currently learning ${language} specifically the topic: ${lessonTitle}.
    
    Guidelines:
    - Use simple words and real-life analogies.
    - If the student asks for code, provide short, well-commented snippets.
    - Encourage the student to try things out.
    - If they ask something way too advanced (like multithreading or complex design patterns), 
      politely mention it's an advanced topic and suggest they stick to the fundamentals first.
    - Always be encouraging!`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      ...history.map(msg => ({ 
        role: msg.role === 'user' ? 'user' : 'model', 
        parts: [{ text: msg.content }] 
      })),
      { role: 'user', parts: [{ text: userInput }] }
    ],
    config: {
      systemInstruction,
      temperature: 0.8,
    },
  });

  return response.text;
};

export const generateQuiz = async (language: ProgrammingLanguage, lessonTitle: string): Promise<QuizQuestion[]> => {
  // Randomize question count between 5 and 10
  const count = Math.floor(Math.random() * 6) + 5;
  
  const prompt = `Generate a ${count}-question multiple-choice quiz for a beginner learning ${language} about ${lessonTitle}. 
    Ensure the questions are randomized in difficulty and cover different aspects of the topic.
    For each question, provide a clear explanation of why the correct answer is right.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswerIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswerIndex", "explanation"]
        }
      }
    }
  });

  try {
    const jsonStr = response.text || '[]';
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse quiz JSON", e);
    return [];
  }
};
