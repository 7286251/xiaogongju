
export enum ToolType {
  IMAGE_REVERSE = 'IMAGE_REVERSE',
  VIDEO_REVERSE = 'VIDEO_REVERSE',
  OCR = 'OCR',
  TRANSLATE = 'TRANSLATE'
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
}

export interface LanguageState {
  isEnglish: boolean;
}
