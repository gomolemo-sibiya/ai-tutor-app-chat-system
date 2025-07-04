import React, { useState, useEffect, useRef } from 'react';
import type { ChatHistory, ChatMessage } from '../types';
import { MODULES } from '../utils/constants';

interface ChatInterfaceProps {
  chatHistory: ChatHistory[];
  currentChat: ChatHistory | null;
  onNewChat: (queryType: 'general' | 'module', module: string) => void;
  onChatSelect: (chat: ChatHistory) => void;
  onChatUpdate: (chatId: string, updates: Partial<ChatHistory>) => void;
  onChatDelete: (chatId: string) => void;
  onAIResponse: (query: string, fileName?: string) => Promise<string>;
  studentId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chatHistory,
  currentChat,
  onNewChat,
  onChatSelect,
  onChatUpdate,
  onChatDelete,
  onAIResponse,
  studentId: _studentId // Used for chat identification in parent components
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showNewChatForm, setShowNewChatForm] = useState(false);
  const [newChatType, setNewChatType] = useState<'general' | 'module'>('general');
  const [newChatModule, setNewChatModule] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentChat) return;

    const userMessage: ChatMessage = {
      sender: 'student',
      text: newMessage,
      timestamp: new Date().toISOString()
    };

    // Add user message immediately
    const updatedMessages = [...(currentChat.messages || []), userMessage];
    await onChatUpdate(currentChat.chatId, { messages: updatedMessages });

    const messageToSend = newMessage;
    setNewMessage('');
    setIsTyping(true);

    try {
      // Get AI response
      const aiResponse = await onAIResponse(messageToSend);
      
      const systemMessage: ChatMessage = {
        sender: 'system',
        text: aiResponse,
        timestamp: new Date().toISOString()
      };

      // Add system response
      const finalMessages = [...updatedMessages, systemMessage];
      await onChatUpdate(currentChat.chatId, { messages: finalMessages });
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: ChatMessage = {
        sender: 'system',
        text: 'Sorry, I encountered an error while processing your request.',
        timestamp: new Date().toISOString()
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      await onChatUpdate(currentChat.chatId, { messages: finalMessages });
    } finally {
      setIsTyping(false);
    }
  };

  const handleCreateNewChat = () => {
    if (newChatType === 'module' && !newChatModule) {
      alert('Please select a module');
      return;
    }

    onNewChat(newChatType, newChatModule);
    setShowNewChatForm(false);
    setNewChatType('general');
    setNewChatModule('');
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const handleTitleEdit = async (chatId: string, newTitle: string) => {
    await onChatUpdate(chatId, { title: newTitle });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
      {/* Chat History Sidebar */}
      <div className="lg:col-span-1 bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold">Chat History</h4>
          <button
            onClick={() => setShowNewChatForm(true)}
            className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors"
          >
            New Chat
          </button>
        </div>

        {/* New Chat Form */}
        {showNewChatForm && (
          <div className="bg-white p-3 rounded-lg mb-4 border">
            <h5 className="font-medium mb-2">Create New Chat</h5>
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Query Type
                </label>
                <select
                  value={newChatType}
                  onChange={(e) => setNewChatType(e.target.value as 'general' | 'module')}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="module">Module Specific</option>
                </select>
              </div>

              {newChatType === 'module' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Module
                  </label>
                  <select
                    value={newChatModule}
                    onChange={(e) => setNewChatModule(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Module</option>
                    {MODULES.map(module => (
                      <option key={module.code} value={module.code}>
                        {module.code}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={handleCreateNewChat}
                  className="flex-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowNewChatForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {chatHistory.length === 0 ? (
            <div className="text-sm text-gray-500 text-center py-4">
              No chats yet
            </div>
          ) : (
            chatHistory.map(chat => (
              <div
                key={chat.chatId}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  currentChat?.chatId === chat.chatId
                    ? 'bg-green-100 border-2 border-green-300'
                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => onChatSelect(chat)}
              >
                <div className="text-sm font-medium truncate">{chat.title}</div>
                <div className="text-xs text-gray-500">
                  {chat.queryType === 'module' ? chat.module : 'General'} • {formatTimestamp(chat.timestamp)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {chat.messages?.length || 0} messages
                </div>
                
                {currentChat?.chatId === chat.chatId && (
                  <div className="mt-2 flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newTitle = prompt('Enter new title:', chat.title);
                        if (newTitle) handleTitleEdit(chat.chatId, newTitle);
                      }}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                    >
                      Rename
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Delete this chat?')) {
                          onChatDelete(chat.chatId);
                        }
                      }}
                      className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="lg:col-span-2 bg-white border rounded-lg flex flex-col">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b">
              <h4 className="font-semibold">{currentChat.title}</h4>
              <div className="text-sm text-gray-500">
                {currentChat.queryType === 'module' ? `Module: ${currentChat.module}` : 'General Chat'}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {(currentChat.messages || []).length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Start a conversation by typing a message below
                </div>
              ) : (
                <div className="space-y-4">
                  {(currentChat.messages || []).map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'student'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="text-sm">{message.text}</div>
                        <div className={`text-xs mt-1 ${
                          message.sender === 'student' ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                        <div className="text-sm">AI is typing...</div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isTyping}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat or create a new one to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
