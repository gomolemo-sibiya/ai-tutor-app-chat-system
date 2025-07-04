export interface ChatMessage {
  sender: 'student' | 'system';
  text: string;
  timestamp: string;
}

export interface ChatHistory {
  chatId: string;
  timestamp: string;
  studentId: string;
  queryType: 'general' | 'module';
  module: string;
  title: string;
  notes: string;
  messages: ChatMessage[];
}
