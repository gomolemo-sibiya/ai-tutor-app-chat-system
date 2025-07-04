# AWS Deployment Checklist

## Pre-deployment Check
- [ ] AWS credentials configured
- [ ] IAM permissions granted (PowerUserAccess + IAMFullAccess)
- [ ] Serverless Framework dependencies installed

## Deployment Commands

### 1. Install dependencies (if not done)
```bash
cd aws
npm install
```

### 2. Deploy to AWS
```bash
npx serverless deploy --stage dev --region us-east-2
```

### 3. Expected Output
You should see:
```
✔ Service deployed to stack ai-tutor-platform-dev (112s)

endpoints:
  GET - https://XXXXXXXXXX.execute-api.us-east-2.amazonaws.com/dev/files
  POST - https://XXXXXXXXXX.execute-api.us-east-2.amazonaws.com/dev/files
  GET - https://XXXXXXXXXX.execute-api.us-east-2.amazonaws.com/dev/chat
  POST - https://XXXXXXXXXX.execute-api.us-east-2.amazonaws.com/dev/chat
  ... (more endpoints)
```

### 4. What Gets Created
- DynamoDB Tables:
  - `ai-tutor-platform-files-dev`
  - `ai-tutor-platform-chats-dev` 
  - `ai-tutor-platform-messages-dev`
- S3 Bucket: `ai-tutor-platform-files-dev`
- Lambda Functions: 9 functions for CRUD operations
- API Gateway: RESTful endpoints

## Troubleshooting
- **Permission denied**: Check IAM policies
- **Region issues**: Ensure you're in us-east-2
- **Resource conflicts**: Use `--force` flag
