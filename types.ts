
export enum ToolType {
  IMAGE_REVERSE = 'IMAGE_REVERSE',
  VIDEO_REVERSE = 'VIDEO_REVERSE',
  OCR = 'OCR',
  TRANSLATE = 'TRANSLATE',
  MASCOT_GEN = 'MASCOT_GEN',
  PROMPT_MASTER = 'PROMPT_MASTER'
}

export interface ProcessingFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: string;
  translatedResult?: string;
  error?: string;
  customStyle?: string;
  targetDuration?: string;
}

export interface MascotItem {
  id: string;
  name: string;
  description: string;
  prompt: string;
  imageUrl?: string;
  isGenerating: boolean;
}

export interface LanguageState {
  isEnglish: boolean;
}

export interface CatStyle {
  id: number;
  title: string;
  description: string;
  fullPrompt: string;
}
