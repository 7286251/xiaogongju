
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ToolType } from "../types";

// Correctly initialize GoogleGenAI with named parameter as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const processMedia = async (
  file: File,
  type: ToolType,
  onProgress: (p: number) => void
): Promise<{ original: string; translated: string }> => {
  onProgress(20);
  const base64Data = await fileToBase64(file);
  onProgress(40);

  let prompt = "";
  if (type === ToolType.IMAGE_REVERSE) {
    prompt = "Analyze this image and provide a highly detailed, precise text-to-image prompt that would recreate this exact image 1:1. Focus on style, lighting, composition, objects, and technical details. Provide the output in English.";
  } else if (type === ToolType.VIDEO_REVERSE) {
    prompt = "Analyze this video (or image frames) and provide a highly detailed prompt to generate a similar video. Focus on motion, atmosphere, and visual elements. Provide the output in English.";
  } else if (type === ToolType.OCR) {
    prompt = "Extract all text from this image accurately. Maintain the structure and layout if possible. Output ONLY the extracted text.";
  } else if (type === ToolType.TRANSLATE) {
    prompt = "Detect the language in this image and translate all visible text into simplified Chinese. If it's already in Chinese, translate it to English. Output only the translation.";
  }

  onProgress(60);
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: file.type } },
        { text: prompt }
      ]
    }
  });

  const original = response.text || "No result generated.";
  onProgress(85);

  // Auto-translate if it's a reverse prompt (to provide the dual language capability)
  let translated = "";
  if (type === ToolType.IMAGE_REVERSE || type === ToolType.VIDEO_REVERSE || type === ToolType.OCR) {
    const translationPrompt = `Translate the following content to ${type === ToolType.OCR ? 'English (if it is Chinese) or Chinese (if it is English)' : 'Chinese'}: \n\n${original}`;
    const transResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: translationPrompt
    });
    translated = transResponse.text || "翻译失败";
  } else {
    // For translation tool, "original" is already the translated version based on prompt
    translated = original;
  }

  onProgress(100);
  return { original, translated };
};
