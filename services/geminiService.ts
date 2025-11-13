
import { GoogleGenAI } from "@google/genai";

// Ensure API key is available in the environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export async function generateCode(prompt: string): Promise<string> {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            temperature: 0.2,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        },
    });

    const text = response.text;
    if (text) {
        // Clean up the response to remove markdown backticks if they exist
        return text.replace(/```(typescript|javascript|jsx|tsx)?\n/g, '').replace(/\n```/g, '');
    } else {
        return "No code generated. The model returned an empty response.";
    }
  } catch (error) {
    console.error("Error generating code with Gemini API:", error);
    throw new Error("Failed to communicate with the Gemini API.");
  }
}
