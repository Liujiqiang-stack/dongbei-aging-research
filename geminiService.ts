
import { GoogleGenAI } from "@google/genai";
import { PAPER_CONTENT } from "./constants";
import { Language } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function askGeminiAboutPaper(prompt: string, history: any[], lang: Language = 'zh') {
  const content = PAPER_CONTENT[lang];
  
  const systemInstruction = `
    You are a World-Class Demography Expert specializing in Northeast China's population crisis.
    Your knowledge is based on the highly cited paper: "${content.title}".
    
    ${lang === 'de' ? 'Respond primarily in professional German.' : 'Respond primarily in professional Chinese.'}
    
    Current Research Context:
    - Target: High-quality development vs Demographic decline.
    - Thesis: Offsetting quantity loss with quality improvement ("以质代量").
    - Thresholds: TFR below 1.0 is a "fertility trap".
    
    When users provide simulation data (TFR, Migration, Retirement, Population numbers):
    1. Validate if their scenario is realistic based on the paper's projections.
    2. Explain the "Dependency Ratio" implications for social security.
    3. Connect the numerical results to specific policy recommendations from the paper (e.g., educational investment, digital agriculture).
    4. Maintain an objective, scholarly, yet forward-looking tone.
    
    Paper Summary for Reference:
    ${content.summary}
  `;

  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const response = await chat.sendMessage({ message: prompt });
    return response.text || (lang === 'de' ? "Keine Antwort generiert." : "无法生成回复。");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return lang === 'de' ? "Fehler bei der KI-Verbindung." : "连接智能助手时发生错误。";
  }
}
