
import { GoogleGenAI } from "@google/genai";
import type { Upgrade } from "../types";

// Ensure the API key is available. In a real app, this would be handled more securely.
const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || " " });

export async function getProTip(upgrades: Upgrade[]): Promise<string> {
  if (!apiKey) {
    return "Gemini API key is not configured. Please set the API_KEY environment variable to use this feature.";
  }
  
  if (upgrades.length === 0) {
    return "Collect some upgrades first, then I can give you a tip!";
  }

  const upgradeList = upgrades.map(u => `- ${u.name}: ${u.description}`).join('\n');

  const prompt = `
    I am playing a 2D top-down arena roguelite game.
    My current upgrades are:
    ${upgradeList}

    Based on these upgrades, what is a good strategy to focus on? Keep the tip concise and encouraging (2-3 sentences).
    `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    if (response && response.text) {
      return response.text;
    } else {
      return "The AI couldn't come up with a tip right now. Just keep blasting!";
    }
  } catch (error) {
    console.error("Error fetching tip from Gemini API:", error);
    return "Could not connect to the strategy AI. Focus on dodging and shooting!";
  }
}
