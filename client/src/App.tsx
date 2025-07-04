import { useState, useEffect } from "react";
import type { ChatHistory } from "./types";
import ChatInterface from "./components/ChatInterface";
import { chatService } from "./services/api";
import "./App.css";

function App() {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatHistory | null>(null);
  const studentId = "3"; // Fixed student ID for demo

  // Load chat history
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const response = await chatService.getChats(studentId);
      setChatHistory(response.data);
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  };

  const handleNewChat = async (queryType: "general" | "module", module: string) => {
    try {
      const newChatData = {
        studentId,
        queryType,
        module,
        title: `${queryType === "module" ? module : "General"} Chat - ${new Date().toLocaleTimeString()}`,
        notes: "",
        messages: []
      };

      const response = await chatService.createChat(newChatData);
      const newChat = response.data;

      setChatHistory(prev => [newChat, ...prev]);
      setCurrentChat(newChat);
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  const handleChatSelect = (chat: ChatHistory) => {
    setCurrentChat(chat);
  };

  const handleChatUpdate = async (chatId: string, updates: Partial<ChatHistory>) => {
    try {
      const response = await chatService.updateChat(chatId, updates);
      const updatedChat = response.data;

      setChatHistory(prev =>
        prev.map(chat => chat.chatId === chatId ? updatedChat : chat)
      );

      if (currentChat?.chatId === chatId) {
        setCurrentChat(updatedChat);
      }
    } catch (error) {
      console.error("Failed to update chat:", error);
    }
  };

  const handleChatDelete = async (chatId: string) => {
    try {
      await chatService.deleteChat(chatId);
      setChatHistory(prev => prev.filter(chat => chat.chatId !== chatId));
      
      if (currentChat?.chatId === chatId) {
        setCurrentChat(null);
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const handleAIResponse = async (query: string): Promise<string> => {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      if (!response.ok) {
        throw new Error('AI response failed');
      }
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("AI response error:", error);
      return "I apologize, but I'm having trouble responding right now. Please try again later.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">🤖</div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Tutor Chat System
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Your intelligent learning companion
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <ChatInterface
          chatHistory={chatHistory}
          currentChat={currentChat}
          onNewChat={handleNewChat}
          onChatSelect={handleChatSelect}
          onChatUpdate={handleChatUpdate}
          onChatDelete={handleChatDelete}
          onAIResponse={handleAIResponse}
          studentId={studentId}
        />
      </main>
    </div>
  );
}

export default App;
