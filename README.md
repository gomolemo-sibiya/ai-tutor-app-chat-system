# AI Chat System

A simple full-stack chat application with AI integration.

## Features

- **🎨 Modern UI**: Beautiful, responsive interface with gradient designs and smooth animations
- **💬 Real-time Chat**: Interactive chat interface with conversation history
- **🤖 Dummy AI Integration**: Simple mock AI responses for demonstration
- **📚 Module Support**: Support for both general and module-specific chats
- **✨ Enhanced UX**: 
  - Animated typing indicators
  - Message avatars and timestamps
  - Auto-expanding text input
  - Custom scrollbars
  - Hover effects and smooth transitions
- **🔧 Chat Management**: Create, rename, and delete chat conversations
- **💾 Persistent Storage**: Chat history stored in JSON files
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Storage**: JSON files

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running the Application

1. Start the server:
```bash
cd server
npm start
```

2. Start the client:
```bash
cd client
npm run dev
```

3. Open your browser to `http://localhost:5173`

## API Endpoints

### Chat
- `GET /api/chat` - Get chat history
- `POST /api/chat` - Create new chat
- `PUT /api/chat/:chatId` - Update chat
- `DELETE /api/chat/:chatId` - Delete chat

### AI
- `POST /api/ai/chat` - AI chat response

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── package.json
├── server/                 # Express backend
│   ├── data/
│   │   └── chat.json      # Chat history storage
│   ├── server.js          # Main server file
│   └── package.json
└── README.md
```

## Usage

1. **Open the application** in your browser at `http://localhost:5173`
2. **Start a conversation**:
   - Click "✨ New Chat" to create a new conversation
   - Choose between "💬 General Discussion" or "📚 Module Specific"
   - For module chats, select from available courses (CS101, DS201, etc.)
3. **Chat with the AI**:
   - Type your message in the text area at the bottom
   - Press Enter to send (Shift+Enter for new lines)
   - The AI provides contextual responses based on your questions
4. **Manage conversations**:
   - Select any chat from the sidebar to view/continue
   - Rename chats by clicking "✏️ Rename"
   - Delete unwanted chats with "🗑️ Delete"
5. **AI Demo Features**:
   - Send any message to get a dummy AI response
   - Responses are randomly selected from preset messages
   - Perfect for testing the chat interface functionality

## License

MIT License
