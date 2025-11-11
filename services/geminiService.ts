import { GoogleGenAI, Type } from "@google/genai";
import type { Task, Geolocation, TaskResult } from '../types';
import { 
  PLANNER_MODEL, 
  WORKER_MODEL, 
  SYNTHESIZER_MODEL, 
  PLANNER_SYSTEM_INSTRUCTION, 
  SYNTHESIZER_SYSTEM_INSTRUCTION 
} from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

interface RawTask {
  id: number;
  description: string;
}

export const generatePlan = async (query: string): Promise<RawTask[]> => {
  try {
    const response = await ai.models.generateContent({
      model: PLANNER_MODEL,
      contents: query,
      config: {
        systemInstruction: PLANNER_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              description: { type: Type.STRING },
            },
            required: ["id", "description"],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const plan = JSON.parse(jsonText);
    if (!Array.isArray(plan) || plan.some(task => typeof task.id !== 'number' || typeof task.description !== 'string')) {
      throw new Error("Planner returned an invalid format.");
    }
    return plan;
  } catch (error) {
    console.error("Error in generatePlan:", error);
    throw new Error("The planner agent failed to generate a valid plan.");
  }
};

export const executeTask = async (taskDescription: string, location: Geolocation): Promise<TaskResult> => {
  try {
    const response = await ai.models.generateContent({
      model: WORKER_MODEL,
      contents: taskDescription,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          },
        },
      },
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, groundingChunks };
  } catch (error) {
    console.error(`Error in executeTask for "${taskDescription}":`, error);
    throw new Error(`The worker agent failed to execute the task: "${taskDescription}".`);
  }
};

export const synthesizeFinalAnswer = async (query: string, results: Task[]): Promise<string> => {
  try {
    const resultsString = results
      .map(r => `Task: ${r.description}\nResult: ${r.result?.text || 'No result found.'}`)
      .join('\n\n---\n\n');
    
    const prompt = `
      Original User Query: "${query}"

      ---
      Worker Agent Results:
      ${resultsString}
    `;

    const response = await ai.models.generateContent({
      model: SYNTHESIZER_MODEL,
      contents: prompt,
      config: {
        systemInstruction: SYNTHESIZER_SYSTEM_INSTRUCTION,
      },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error in synthesizeFinalAnswer:", error);
    throw new Error("The synthesizer agent failed to generate a final answer.");
  }
};
