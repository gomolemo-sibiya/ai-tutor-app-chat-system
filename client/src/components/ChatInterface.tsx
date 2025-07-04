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
    if (newMessage.length > 1000) {
      alert('Message is too long. Please keep it under 1000 characters.');
      return;
    }

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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
      {/* Chat History Sidebar */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-lg text-gray-800">Conversations</h4>
          <button
            onClick={() => setShowNewChatForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            ✨ New Chat
          </button>
        </div>

        {/* New Chat Form */}
        {showNewChatForm && (
          <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl mb-6 border border-gray-200 shadow-inner">
            <h5 className="font-semibold mb-3 text-gray-800 flex items-center">
              🚀 Create New Chat
            </h5>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chat Type
                </label>
                <select
                  value={newChatType}
                  onChange={(e) => setNewChatType(e.target.value as 'general' | 'module')}
                  className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                >
                  <option value="general">💬 General Discussion</option>
                  <option value="module">📚 Module Specific</option>
                </select>
              </div>

              {newChatType === 'module' && (
                <div className="animate-fadeIn">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Module
                  </label>
                  <select
                    value={newChatModule}
                    onChange={(e) => setNewChatModule(e.target.value)}
                    className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  >
                    <option value="">Choose a module...</option>
                    {MODULES.map(module => (
                      <option key={module.code} value={module.code}>
                        {module.code} - {module.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <button
                  onClick={handleCreateNewChat}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  ✅ Create
                </button>
                <button
                  onClick={() => setShowNewChatForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat List */}
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {chatHistory.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                💬
              </div>
              <div className="text-sm text-gray-500">
                No conversations yet
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Start a new chat to begin
              </div>
            </div>
          ) : (
            chatHistory.map(chat => (
              <div
                key={chat.chatId}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                  currentChat?.chatId === chat.chatId
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-md transform scale-[1.02]'
                    : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200 hover:shadow-sm'
                }`}
                onClick={() => onChatSelect(chat)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate text-gray-800 mb-1">
                      {chat.queryType === 'module' ? '📚' : '💬'} {chat.title}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {chat.queryType === 'module' ? `${chat.module} Module` : 'General Chat'}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{chat.messages?.length || 0} messages</span>
                      <span>{formatTimestamp(chat.timestamp)}</span>
                    </div>
                  </div>
                </div>
                
                {currentChat?.chatId === chat.chatId && (
                  <div className="mt-3 flex space-x-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newTitle = prompt('Enter new title:', chat.title);
                        if (newTitle) handleTitleEdit(chat.chatId, newTitle);
                      }}
                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 transition-all duration-200 font-medium"
                    >
                      ✏️ Rename
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Delete this chat?')) {
                          onChatDelete(chat.chatId);
                        }
                      }}
                      className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-all duration-200 font-medium"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="lg:col-span-3 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xl text-gray-800 mb-1">
                    {currentChat.queryType === 'module' ? '📚' : '💬'} {currentChat.title}
                  </h4>
                  <div className="text-sm text-gray-600 flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {currentChat.queryType === 'module' ? `${currentChat.module} Module` : 'General Discussion'}
                    </span>
                    <span className="ml-3 text-gray-500">
                      {currentChat.messages?.length || 0} messages
                    </span>
                  </div>
                </div>
                <div className="text-3xl">
                  🤖
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-gradient-to-b from-gray-50 to-white">
              {(currentChat.messages || []).length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">💡</div>
                  <div className="text-lg font-medium text-gray-700 mb-2">
                    Ready to help you learn!
                  </div>
                  <div className="text-gray-500 max-w-md mx-auto">
                    Send a message to test the chat interface! The AI will respond with dummy messages to demonstrate the functionality.
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {(currentChat.messages || []).map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-2xl ${
                        message.sender === 'student' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          message.sender === 'student' 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                            : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                        }`}>
                          {message.sender === 'student' ? '👤' : '🤖'}
                        </div>
                        <div
                          className={`px-4 py-3 rounded-2xl shadow-sm ${
                            message.sender === 'student'
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                              : 'bg-white text-gray-800 border border-gray-200'
                          }`}
                        >
                          <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</div>
                          <div className={`text-xs mt-2 ${
                            message.sender === 'student' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTimestamp(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3 max-w-2xl">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
                          🤖
                        </div>
                        <div className="bg-white text-gray-800 border border-gray-200 px-4 py-3 rounded-2xl shadow-sm">
                          <div className="flex items-center space-x-1">
                            <div className="text-sm text-gray-600">AI is thinking</div>
                            <div className="flex space-x-1">
                              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-gray-100 bg-white">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message here to test the chat functionality..."
                    className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                    disabled={isTyping}
                    rows={1}
                    style={{
                      minHeight: '50px',
                      maxHeight: '120px',
                      overflowY: newMessage.split('\n').length > 2 ? 'auto' : 'hidden'
                    }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none flex items-center space-x-2 font-medium"
                >
                  {isTyping ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending</span>
                    </>
                  ) : (
                    <>
                      <span>Send</span>
                      <span>🚀</span>
                    </>
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <span className={`${newMessage.length > 500 ? 'text-red-500' : ''}`}>
                  {newMessage.length}/1000
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-6">🤖</div>
              <div className="text-2xl font-bold text-gray-700 mb-3">
                Welcome to AI Chat System
              </div>
              <div className="text-gray-500 max-w-md mx-auto mb-6">
                Select a conversation from the sidebar or create a new chat to get started. Test the chat functionality with dummy AI responses!
              </div>
              <button
                onClick={() => setShowNewChatForm(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                🚀 Start New Conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
