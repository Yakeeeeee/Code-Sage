
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ProgrammingLanguage, ChatMessage, QuizQuestion, CodeReviewResult, Flashcard } from "../types";
import { OFFLINE_RESOURCES } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodePCM(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const safeParseJSON = (text: string, fallback: any) => {
  try {
    const cleaned = text.replace(/```json|```/gi, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    return fallback;
  }
};

const handleApiError = (error: any, fallbackMessage: string) => {
  console.error("API Error context:", error);
  const errorMessage = error?.message || String(error);
  
  if (errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("quota")) {
    return "### ⏳ Sage Cache Mode\n\nI've reached my AI processing quota for the moment. To keep your learning uninterrupted, I've switched to **Offline/Cached Mode**. Some advanced features might be limited until the quota resets!";
  }
  
  return fallbackMessage;
};

export const getLessonContent = async (language: ProgrammingLanguage, lessonTitle: string, eli5: boolean = false): Promise<{ text: string, isCached: boolean }> => {
  // Check hardcoded first
  const key = `${language}_${lessonTitle}`;
  if (OFFLINE_RESOURCES[key]) {
    return { text: OFFLINE_RESOURCES[key].content, isCached: true };
  }

  try {
    const prompt = `You are a beginner-friendly programming tutor. 
      Explain the topic "${lessonTitle}" for the programming language "${language}".
      ${eli5 ? "USE 'EXPLAIN LIKE I'M FIVE' MODE: Use extreme simplicity and analogies." : ""}
      Structure using Markdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return { text: response.text || "Failed to generate lesson content.", isCached: false };
  } catch (error) {
    return { text: handleApiError(error, `### ⚠️ Connection Error\n\nI couldn't fetch the "${lessonTitle}" lesson. Please try again.`), isCached: false };
  }
};

export const simulateCodeExecution = async (language: ProgrammingLanguage, code: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Act as a precise terminal for ${language}. Execute and return output only: \`\`\`${language}\n${code}\n\`\`\``,
    });
    return response.text.trim().replace(/^```|```$/g, '') || "Execution returned no output.";
  } catch (error) {
    const msg = handleApiError(error, "Error: AI Simulator offline.");
    return msg.includes("Sage Cache Mode") ? "Offline Simulator Error: API Quota exhausted." : msg;
  }
};

export const generateAudioLesson = async (text: string, audioCtx: AudioContext) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Summarize this briefly and read: ${text.substring(0, 400)}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return null;

    const uint8 = decodeBase64(base64Audio);
    return await decodePCM(uint8, audioCtx);
  } catch (error) {
    return null;
  }
};

export const generateQuiz = async (language: ProgrammingLanguage, lessonTitle: string): Promise<{ questions: QuizQuestion[], isCached: boolean }> => {
  // Check hardcoded
  const key = `${language}_${lessonTitle}`;
  if (OFFLINE_RESOURCES[key] && OFFLINE_RESOURCES[key].quiz.length > 0) {
    return { questions: OFFLINE_RESOURCES[key].quiz, isCached: true };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a 3-question beginner quiz for ${language} on ${lessonTitle}.`,
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
    return { questions: safeParseJSON(response.text, []), isCached: false };
  } catch (error) {
    return { questions: [], isCached: false };
  }
};

export const chatWithTutor = async (language: ProgrammingLanguage, lesson: string, history: ChatMessage[], input: string, mode: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [...history.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })), { role: 'user', parts: [{ text: input }] }],
    });
    return response.text || "I'm currently resting my circuits.";
  } catch (error) {
    const msg = handleApiError(error, "Communication relay failed.");
    return msg.includes("Sage Cache Mode") ? "Sage is in offline mode due to quota limits. Try again in 60 seconds!" : msg;
  }
};

export const reviewUserCode = async (lang: ProgrammingLanguage, code: string): Promise<CodeReviewResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Review this ${lang} code: \n${code}`,
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
    return safeParseJSON(response.text, { isBuggy: false, explanation: "Review currently unavailable.", suggestions: [], refactoredCode: code });
  } catch (error) {
    return { isBuggy: false, explanation: "Quota limit reached. Manual check advised.", suggestions: [], refactoredCode: code };
  }
};

export const generateFlashcards = async (lang: ProgrammingLanguage): Promise<Flashcard[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 3 flashcards for ${lang}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              answer: { type: Type.STRING }
            },
            required: ["id", "question", "answer"]
          }
        }
      }
    });
    return safeParseJSON(response.text, []).map((c: any) => ({ ...c, nextReview: Date.now() }));
  } catch (error) {
    return [];
  }
};
