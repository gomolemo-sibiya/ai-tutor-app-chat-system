# AI-Powered Tutoring and Learning Management Platform

A comprehensive web-based platform serving Educators, Students, and Administrators with distinct views and functionalities. Built with React, TypeScript, Node.js, and Express with local data storage for testing purposes.

## 🚀 Features

### For Educators
- **File Management**: Upload, manage, and organize educational materials
- **Metadata Assignment**: Assign module codes, content types, and descriptions
- **File Organization**: Filter and search through uploaded files
- **Download/Delete**: Manage file lifecycle

### For Students  
- **Educational Materials**: Browse and access educator-uploaded files
- **AI Tools**: Chat with AI about files, generate summaries, create quizzes (placeholder functions)
- **Chat System**: Interactive chat with conversation history and CRUD operations
- **Module Browser**: Filter content by modules and content types

### For Administrators
- **User Management**: Create, edit, and delete users (educators, students, admins)
- **File Oversight**: Monitor and manage all uploaded files
- **Chat Monitoring**: View and manage student chat activities
- **Dashboard**: Analytics and insights across the platform

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express
- **Styling**: Tailwind CSS (minimal design)
- **Package Manager**: npm (Bun support available)
- **Data Storage**: Local JSON files
- **File Upload**: Multer for handling file uploads

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or Bun package manager

## 🔧 Installation & Setup

1. **Clone or navigate to the project directory**:
   ```bash
   cd ai-tutor-platform
   ```

2. **Install dependencies for both client and server**:
   ```bash
   npm run install:all
   ```

   Or install individually:
   ```bash
   npm run install:client
   npm run install:server
   ```

3. **Start the development servers**:
   ```bash
   npm run dev
   ```
   This starts both frontend (port 5173) and backend (port 3001) servers concurrently.

4. **Access the application**:
   - Open your browser and navigate to `http://localhost:5173`
   - Select a role (Educator, Student, or Administrator) to begin

## 🏗️ Project Structure

```
ai-tutor-platform/
├── client/                      # Frontend application
│   ├── src/                     # React source code
│   │   ├── components/          # Reusable React components
│   │   ├── views/               # Main view components (Educator, Student, Admin)
│   │   ├── types/               # TypeScript type definitions
│   │   ├── services/            # API service functions
│   │   └── utils/               # Utility functions and constants
│   ├── index.html               # HTML template
│   ├── package.json             # Client dependencies
│   └── vite.config.ts           # Vite configuration
├── server/                      # Backend application
│   ├── data/                    # Local JSON data storage
│   │   ├── users.json           # User data
│   │   ├── files.json           # File metadata
│   │   ├── chat.json            # Chat history
│   │   └── modules.json         # Available modules
│   ├── server.js                # Express server
│   └── package.json             # Server dependencies
├── uploads/                     # File upload directory
└── package.json                 # Root package with scripts
```

## 🎯 Usage Guide

### Getting Started
1. **Select Your Role**: Choose from Educator, Student, or Administrator
2. **Switch Roles**: Use the "Switch Role" button in the navigation to test different views

### Educator Workflow
1. Upload files using the file upload form
2. Assign metadata (module, content type, lecturer, description)
3. View and manage uploaded files in the file list
4. Filter and search through your files

### Student Workflow
1. Browse educational materials uploaded by educators
2. Select files to use with AI tools
3. Start chat conversations (general or module-specific)
4. Use AI tools for file analysis (placeholder responses)

### Administrator Workflow
1. Manage users across all roles
2. Monitor file uploads and metadata
3. Oversee chat activities and student engagement
4. View platform analytics and statistics

## 🔌 API Endpoints

### Files
- `GET /api/files` - Get all files
- `POST /api/files` - Upload new file
- `DELETE /api/files/:fileId` - Delete file
- `GET /api/files/:fileId/download` - Download file

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Chat
- `GET /api/chat` - Get chat history
- `POST /api/chat` - Create new chat
- `PUT /api/chat/:chatId` - Update chat
- `DELETE /api/chat/:chatId` - Delete chat

### Modules
- `GET /api/modules` - Get available modules

### AI (Placeholder)
- `POST /api/ai/chat` - AI chat response
- `POST /api/ai/summarize` - Generate summary
- `POST /api/ai/quiz` - Generate quiz

## 📊 Sample Data

The application comes with pre-populated sample data:
- **Users**: 2 educators, 2 students, 1 administrator
- **Files**: Sample educational materials across different modules
- **Chats**: Example student conversations
- **Modules**: CS101, DS201, INF301, SE401

## ⚙️ Configuration

### Available Scripts
- `npm run dev` - Start both client and server in development mode
- `npm run dev:client` - Start only the frontend development server
- `npm run dev:server` - Start only the backend server
- `npm run install:all` - Install dependencies for both client and server
- `npm run install:client` - Install only client dependencies
- `npm run install:server` - Install only server dependencies
- `npm run build` - Build the frontend for production
- `npm run preview` - Preview the production build

### Environment
- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:3001`
- File uploads stored in `./uploads/` directory
- Data stored in `./server/data/` as JSON files

## 🚨 Important Notes

- **No Authentication**: The platform has no authentication system for testing purposes
- **Local Storage**: All data is stored locally in JSON files
- **Placeholder AI**: AI features return static responses for demonstration
- **File Security**: Uploaded files are stored locally without encryption
- **Development Only**: This setup is for development/testing only

## 🔧 Customization

### Adding New Modules
Edit `client/src/utils/constants.ts` and `server/data/modules.json` to add new modules.

### Modifying AI Responses
Update the AI endpoint handlers in `server/server.js` to customize placeholder responses.

### Styling Changes
Modify Tailwind classes in components or add custom CSS as needed.

## 🐛 Troubleshooting

### Common Issues
1. **Port conflicts**: Change ports in `client/vite.config.ts` and `server/server.js`
2. **File upload errors**: Ensure `uploads/` directory exists and has write permissions
3. **Data persistence**: Check that `server/data/` directory and JSON files exist

### Reset Data
To reset to initial sample data, delete the JSON files in `server/data/` and restart the server.

## 📝 Development Notes

- The platform prioritizes functionality over aesthetics
- Cross-sectional data communication ensures consistency across views
- Role-based access is implemented through frontend routing
- File metadata is synchronized across all user roles
- Chat history supports full CRUD operations

## 🤝 Contributing

This is a demonstration platform. For production use, consider:
- Implementing proper authentication and authorization
- Using a database instead of JSON files
- Adding real AI integration
- Implementing proper file security
- Adding comprehensive error handling and validation

## 📄 License

This project is for educational and demonstration purposes.
