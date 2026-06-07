
import { GoogleGenAI } from "@google/genai";

export async function analyzeImage(base64Image: string, prompt: string = "Analyze this image in detail. Describe the subject, the atmosphere, and the artistic style.") {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1] || base64Image,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
}
