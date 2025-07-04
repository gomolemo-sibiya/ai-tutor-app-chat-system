# AI Tutor Platform - AWS Backend

A serverless backend for the AI Tutor Platform built with AWS Lambda and the Serverless Framework.

## Quick Start

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Deploy to AWS
npm run deploy
```

## Project Structure

```
aws/
├── src/
│   ├── handlers/          # Lambda function handlers
│   ├── services/          # Business logic services
│   ├── utils/             # Utility functions
│   └── middleware/        # Request middleware
├── tests/
│   ├── unit/              # Unit tests
│   └── integration/       # Integration tests
├── serverless.yml         # Serverless configuration
└── package.json           # Dependencies and scripts
```

## API Endpoints

- `GET /files` - Get all files
- `POST /files` - Upload a file
- `DELETE /files/{id}` - Delete a file
- `GET /chats` - Get all chats
- `POST /chats` - Create a new chat
- `POST /chats/{chatId}/messages` - Send a message

## Development

```bash
# Run tests
npm test

# Run linting
npm run lint

# Format code
npm run format

# Build deployment packages
npm run build

# Create zip files for Lambda deployment
npm run package
```

## Deployment

```bash
# Deploy to development
npm run deploy

# Deploy to production
npm run deploy:prod
```
