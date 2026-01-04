
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ToolType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_IDENTITY = `
# 角色
你是一名【全球顶尖创意总监】和【AI 提示词工程大师】。你擅长将基础视觉元素与动态创意完美融合。

# 任务
基于用户选定的“白猫风格”和“自定义创意内容”，生成两段极高水准的提示词：
1. **图像提示词 (Image Prompt)**：适用于 Midjourney v6/SDXL，强调：材质、光影细节、极细线条、画质。
2. **视频提示词 (Video Prompt)**：适用于 Sora/Veo，强调：镜头运动（Panning/Zooming）、物理反馈、动态变化、叙事张力。

# 要求
- 使用中文输出，但专业术语可保留英文。
- 输出格式：
  [IMAGE_START]
  内容...
  [IMAGE_END]
  [VIDEO_START]
  内容...
  [VIDEO_END]
`;

export const processMedia = async (
  file: File,
  type: ToolType,
  onProgress: (p: number) => void,
  options?: { customStyle?: string; targetDuration?: string }
): Promise<{ original: string; translated: string }> => {
  onProgress(20);
  const base64Data = await fileToBase64(file);
  onProgress(40);

  let taskInstruction = "";
  if (type === ToolType.IMAGE_REVERSE) {
    taskInstruction = `【超级图片反推任务】...`;
  } else if (type === ToolType.VIDEO_REVERSE) {
    taskInstruction = `【视频分镜解析与补全任务】...`;
  } else if (type === ToolType.OCR) {
    taskInstruction = "【精准文字提取】提取文字并保持排版。";
  } else if (type === ToolType.TRANSLATE) {
    taskInstruction = "【智能翻译】识别并翻译为中文。";
  }

  const fullPrompt = `${SYSTEM_IDENTITY}\n\n${taskInstruction}`;
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: file.type } },
        { text: fullPrompt }
      ]
    }
  });
  return { original: response.text?.trim() || "解析异常", translated: response.text?.trim() || "解析异常" };
};

export const generateCreativePrompts = async (styleDesc: string, customInput: string): Promise<{ image: string; video: string }> => {
  const prompt = `${SYSTEM_IDENTITY}\n\n基础白猫风格：${styleDesc}\n用户新增创意内容：${customInput}`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });

  const text = response.text || "";
  const image = text.match(/\[IMAGE_START\]([\s\S]*?)\[IMAGE_END\]/)?.[1]?.trim() || "生成失败";
  const video = text.match(/\[VIDEO_START\]([\s\S]*?)\[VIDEO_END\]/)?.[1]?.trim() || "生成失败";

  return { image, video };
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};
