
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ToolType } from "../types";

// Correctly initialize GoogleGenAI with named parameter as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_IDENTITY = `
# 角色
你是一名【超级解析大师】，拥有全球顶尖的像素级视觉分析与剧情拆解能力。你的使命是将任何图像或视频转化为 1:1 复刻级的中文解析。

# 核心能力
1. **1:1 像素级复刻**：对图片构图、主体、光效、材质有绝对感知。
2. **分镜切割专家**：能精准识别视频拼接逻辑，并以独立的分镜模块进行输出。
3. **时长逻辑补全**：若内容不足，基于逻辑自动补全后续分镜。

# 任务准则
- **默认语言**：所有输出必须使用【中文】。
- **严禁废话**：直接输出结果，严禁任何开场白或结束语。
- **视频解析特殊要求**：每个分镜必须以 [SCENE_START] 开头，紧随其后是“分镜X (时间段) - 内容描述”。严禁将多个分镜混在一起。
- **图片解析核心**：百分百复刻原图，描述详尽至微米级细节。
`;

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
  onProgress: (p: number) => void,
  options?: { customStyle?: string; targetDuration?: string }
): Promise<{ original: string; translated: string }> => {
  onProgress(20);
  const base64Data = await fileToBase64(file);
  onProgress(40);

  let taskInstruction = "";
  if (type === ToolType.IMAGE_REVERSE) {
    const stylePart = options?.customStyle ? `并强制融入以下自定义主题/风格：【${options.customStyle}】。` : "";
    taskInstruction = `【超级图片反推任务】
1. 目标：1:1 深度复刻原图。
2. 内容：详尽描述该图片的构图、主体、背景、光效及艺术氛围。
3. 自定义注入：${stylePart}
要求：输出完整、连贯的中文解析文本。`;
  } else if (type === ToolType.VIDEO_REVERSE) {
    const durationPart = options?.targetDuration ? `。最终视频总时长补全为【${options.targetDuration}】，若内容不足请基于逻辑逻辑联想补全。` : "";
    taskInstruction = `【视频分镜解析与补全任务】
1. 识别视频拼接逻辑。
2. 每个分镜必须使用 [SCENE_START] 作为起始标志。
3. 按照“[SCENE_START] 分镜X (时间段) - 画面内容、镜头语言、氛围描述”格式输出。
4. ${durationPart}
要求：每个分镜独立描述。`;
  } else if (type === ToolType.OCR) {
    taskInstruction = "【精准文字提取】提取文字并保持排版。";
  } else if (type === ToolType.TRANSLATE) {
    taskInstruction = "【智能翻译】识别并翻译为中文。";
  }

  const fullPrompt = `${SYSTEM_IDENTITY}\n\n${taskInstruction}`;

  onProgress(60);
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: file.type } },
        { text: fullPrompt }
      ]
    }
  });

  const result = response.text?.trim() || "解析异常。";
  onProgress(85);

  onProgress(100);
  return { original: result, translated: result };
};

/**
 * Generates Mascot Image using Gemini 2.5 Flash Image model
 */
export const generateMascotImage = async (prompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: prompt }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0].content.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("未能生成图像，请重试");
};
