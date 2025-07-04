import axios from 'axios';
import type { ChatHistory } from '../types';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chat Service
export const chatService = {
  getChats: (studentId?: string) => apiClient.get<ChatHistory[]>(
    `/chat${studentId ? `?studentId=${studentId}` : ''}`
  ),
  createChat: (chat: Omit<ChatHistory, 'chatId' | 'timestamp'>) => 
    apiClient.post<ChatHistory>('/chat', chat),
  updateChat: (chatId: string, updates: Partial<ChatHistory>) => 
    apiClient.put<ChatHistory>(`/chat/${chatId}`, updates),
  deleteChat: (chatId: string) => apiClient.delete(`/chat/${chatId}`),
};

export default apiClient;
