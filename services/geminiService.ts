
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ProgrammingLanguage, ChatMessage, QuizQuestion, CodeReviewResult, Flashcard } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getLessonContent = async (language: ProgrammingLanguage, lessonTitle: string, eli5: boolean = false) => {
  const prompt = `You are a beginner-friendly programming tutor. 
    Explain the topic "${lessonTitle}" for the programming language "${language}".
    ${eli5 ? "USE 'EXPLAIN LIKE I'M FIVE' MODE: Use extreme simplicity, child-friendly analogies, and no complex terms." : ""}
    
    Structure your response using Markdown with clean sections.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text;
};

export const simulateCodeExecution = async (language: ProgrammingLanguage, code: string): Promise<string> => {
  const prompt = `Act as a precise terminal and code executor for ${language}. 
    Analyze the following code and return ONLY the exact console output that would occur. 
    If there's an error, return the error message. 
    Code: \`\`\`${language}\n${code}\n\`\`\``;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text.trim().replace(/^```|```$/g, '');
};

export const generateFlashcards = async (language: ProgrammingLanguage): Promise<Flashcard[]> => {
  const prompt = `Generate 5 flashcards for learning ${language}. 
    Focus on core syntax and fundamental concepts.`;

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
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            answer: { type: Type.STRING },
          },
          required: ["id", "question", "answer"]
        }
      }
    }
  });

  const cards = JSON.parse(response.text);
  return cards.map((c: any) => ({ ...c, nextReview: Date.now() }));
};

export const reviewUserCode = async (language: ProgrammingLanguage, code: string): Promise<CodeReviewResult> => {
  const prompt = `Review this ${language} code for a beginner. Check for bugs and logic errors.
    Code: \`\`\`${language}\n${code}\n\`\`\``;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isBuggy: { type: Type.BOOLEAN },
          explanation: { type: Type.STRING },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          refactoredCode: { type: Type.STRING }
        },
        required: ["isBuggy", "explanation", "suggestions", "refactoredCode"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateAudioLesson = async (text: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Summarize and read this lesson naturally: ${text.substring(0, 500)}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

export const chatWithTutor = async (
  language: ProgrammingLanguage,
  lessonTitle: string,
  history: ChatMessage[],
  userInput: string,
  mode: 'default' | 'interviewer' = 'default'
) => {
  const systemInstruction = mode === 'interviewer' 
    ? `You are a Technical Interviewer. Ask 1 question about ${language}.`
    : `You are "CodeSage", a friendly tutor for ${language}.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      ...history.map(msg => ({ 
        role: msg.role === 'user' ? 'user' : 'model', 
        parts: [{ text: msg.content }] 
      })),
      { role: 'user', parts: [{ text: userInput }] }
    ],
    config: { systemInstruction, temperature: 0.8 },
  });

  return response.text;
};

export const generateQuiz = async (language: ProgrammingLanguage, lessonTitle: string): Promise<QuizQuestion[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a 5-question beginner quiz for ${language} on ${lessonTitle}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswerIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswerIndex", "explanation"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};
