import React, { useState, useEffect } from "react";
import type { ChatHistory } from "../types";
import { createUnifiedApiService } from "../services/unified-api";
import ChatInterface from "../components/ChatInterface";

const StudentView: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "aws-test">("aws-test");

  // Mock student ID for demo purposes - in real app this would come from auth
  const studentId = "1"; // Replace with actual student ID logic
  const apiService = createUnifiedApiService("student", studentId);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Try to load chats separately with error handling
      let chatResponse: any = { data: [] };
      try {
        chatResponse = await apiService.chat.getAll(studentId);
      } catch (chatError) {
        console.warn(
          "Could not load chats, continuing without chat data:",
          chatError
        );
        chatResponse = { data: [] };
      }

      // Normalize chat data to ensure messages array exists
      console.log('📥 Chat response received:', chatResponse);
      
      let chatData = [];

      // Handle different possible response structures
      if (Array.isArray(chatResponse)) {
        chatData = chatResponse;
      } else if (chatResponse?.data && Array.isArray(chatResponse.data)) {
        chatData = chatResponse.data;
      } else if (chatResponse?.data?.data && Array.isArray(chatResponse.data.data)) {
        chatData = chatResponse.data.data;
      }

      console.log('📋 Extracted chat data:', chatData);
      
      const normalizedChats = chatData.map((chat: any) => ({
        ...chat,
        messages: chat.messages || []
      }));

    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load chat history.");
    } finally {
      setLoading(false);
    }
  };


  const handleNewChat = async (queryType: 'general' | 'module', module: string) => {
    try {
      const newChatData = {
        studentId,
        queryType,
        module: queryType === 'module' ? module : '',
        title: `${queryType === 'general' ? 'General' : module} Chat - ${new Date().toLocaleDateString()}`,
        notes: '',
        messages: []
      };

      console.log('🆕 Creating new chat:', newChatData);
      
      const response = await apiService.chat.create(newChatData);
      
      console.log('✅ Chat creation response:', response);
      
      const createdChat = {
        ...response.data,
        messages: response.data.messages || []
      };
      
      console.log('🎯 Final chat object:', createdChat);
      
      setChatHistory(prev => [createdChat, ...prev]);
      setCurrentChat(createdChat);
      setActiveTab('chat');
    } catch (err) {
      setError('Failed to create new chat');
      console.error('❌ Error creating chat:', err);
    }
  };

const handleChatUpdate = async (chatId: string, updates: Partial<ChatHistory>) => {
    try {
      const response = await apiService.chat.update(chatId, updates);
      const updatedChat = response.data;
      
      setChatHistory(prev => prev.map(chat => 
        chat.chatId === chatId ? updatedChat : chat
      ));
      
      if (currentChat?.chatId === chatId) {
        setCurrentChat(updatedChat);
      }
    } catch (err) {
      setError('Failed to update chat');
      console.error('Error updating chat:', err);
    }
  };

  const handleChatDelete = async (chatId: string) => {
    try {
      await apiService.chat.delete(chatId);
      setChatHistory(prev => prev.filter(chat => chat.chatId !== chatId));
      
      if (currentChat?.chatId === chatId) {
        setCurrentChat(null);
      }
    } catch (err) {
      setError('Failed to delete chat');
      console.error('Error deleting chat:', err);
    }
  };

  const handleAIResponse = async (query: string, fileName?: string) => {
    try {
      const response = await apiService.ai.chat({ query, fileName });
      return response.data.response;
    } catch (err) {
      console.error('Error getting AI response:', err);
      return 'Sorry, I encountered an error while processing your request.';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
<h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>

{error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'chat'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Chat ({chatHistory.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'chat' && (
          <ChatInterface
            chatHistory={chatHistory}
            currentChat={currentChat}
            onNewChat={handleNewChat}
            onChatSelect={setCurrentChat}
            onChatUpdate={handleChatUpdate}
            onChatDelete={handleChatDelete}
            onAIResponse={handleAIResponse}
            studentId={studentId}
          />
        )}


      </div>
      
    </div>
  );
};

export default StudentView;