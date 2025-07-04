export interface ChatMessage {
  sender: 'student' | 'system';
  text: string;
  timestamp: string;
}

export interface ChatState {
  chats: ChatHistory[];
  currentChat: ChatHistory | null;
  isLoading: boolean;
  error: string | null;
}
export interface ChatHistory {
  chatId: string;
  studentId: string;
  queryType: 'general' | 'module';
  module: string;
  timestamp: string;
  title: string;
  messages: ChatMessage[];
  notes: string;
}

// AI Service Types
export interface AIChatRequest {
  query: string;
  fileName?: string;
}

export type UserRole = 'educator' | 'student' | 'admin';

// Redux State Interfaces
export interface AppState {
  currentRole: UserRole | null;
  isLoading: boolean;
  error: string | null;
}

