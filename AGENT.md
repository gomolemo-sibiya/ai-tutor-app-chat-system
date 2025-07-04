# AI Tutor Platform - Agent Instructions

## Commands

### Development
- `npm run dev` - Start both client and server concurrently
- `npm run dev:client` - Start client only (port 5173)
- `npm run dev:server` - Start server only (port 3001)
- `npm run install:all` - Install dependencies for both client and server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Testing
- No specific test commands configured
- Manual testing through UI at http://localhost:5173

## Project Structure

```
ai-tutor-platform/
├── client/                  # React frontend
│   ├── src/                # React source code
│   │   ├── components/     # Reusable components
│   │   ├── views/         # Main view components
│   │   ├── types/         # TypeScript types
│   │   ├── services/      # API services
│   │   └── utils/         # Constants and utilities
│   └── package.json       # Client dependencies
├── server/                 # Express backend
│   ├── server.js          # Main server file
│   ├── data/              # Local JSON storage
│   └── package.json       # Server dependencies
├── uploads/               # File upload directory
└── package.json           # Root scripts
```

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Multer (file upload)
- **Storage**: Local JSON files (users.json, files.json, chat.json, modules.json)
- **Routing**: React Router DOM

## Key Features

### Role-Based Views
- **Educator**: File upload/management, metadata assignment
- **Student**: File browsing, AI tools, chat system
- **Administrator**: User management, file oversight, chat monitoring

### Data Flow
- Cross-sectional communication between roles
- Real-time data synchronization via API calls
- Persistent storage in JSON files

### File System
- Uploads stored in `./uploads/`
- Metadata in `server/data/files.json`
- Support for documents, videos, audio, images

### Chat System
- Full CRUD operations on conversations
- Module-specific and general chat types
- Message history with timestamps
- AI placeholder responses

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Functional React components with hooks
- Tailwind CSS for styling (minimal design)
- Consistent naming conventions

### API Patterns
- RESTful endpoints under `/api/`
- JSON request/response format
- Error handling with try/catch
- File upload with FormData

### State Management
- React useState for local state
- useEffect for data fetching
- Props for component communication
- No global state management library

## Sample Data

The application includes pre-populated data:
- 5 users (2 educators, 2 students, 1 admin)
- 4 sample files across different modules
- 2 example chat conversations
- 4 predefined modules (CS101, DS201, INF301, SE401)

## Known Limitations

- No authentication system
- Local-only data storage
- Placeholder AI responses
- Basic error handling
- No real-time updates
- Development-only file security

## Debugging

### Common Issues
1. **CORS errors**: Check backend server is running on port 3001
2. **File upload fails**: Ensure uploads/ directory exists
3. **Data not persisting**: Verify JSON files in server/data/
4. **Port conflicts**: Modify client/vite.config.ts or server/server.js

### File Locations
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api
- Data files: `./server/data/*.json`
- Uploaded files: `./uploads/`

## Future Enhancements

For production deployment consider:
- Real database (PostgreSQL, MongoDB)
- Authentication/authorization system
- Real AI integration (OpenAI, Azure AI)
- File encryption and security
- Real-time features (WebSocket)
- Comprehensive testing suite
- Production deployment configuration
