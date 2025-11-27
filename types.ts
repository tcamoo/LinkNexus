export interface TelegramConfig {
  botToken: string;
  chatId: string;
  apiRoot?: string; // Optional custom API root for local bot servers
}

export interface UploadState {
  file: File | null;
  fileType: 'video' | 'audio' | null;
  previewUrl: string | null;
  status: 'idle' | 'uploading' | 'complete' | 'error';
  progress: number;
  error?: string;
  telegramLink?: string;
  fileId?: string;
}

export interface HistoryItem {
  id: string; // Message ID or UUID
  filename: string;
  fileType: 'video' | 'audio';
  link: string;
  fileId?: string;
  timestamp: number;
  size: number;
}

export interface VideoMetadata {
  title: string;
  description: string;
  tags: string[];
  suggestedFilename: string;
}
