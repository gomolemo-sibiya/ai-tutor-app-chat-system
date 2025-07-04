# AWS Deployment Guide

## Prerequisites Checklist
- [ ] AWS CLI configured with your credentials
- [ ] IAM permissions attached to user
- [ ] Serverless Framework installed locally

## Deployment Steps

### 1. Install Dependencies
```bash
cd aws
npm install
```

### 2. Deploy to AWS
```bash
npx serverless deploy --stage dev
```

### 3. Test Your Deployment
```bash
npx serverless invoke -f getFiles
```

### 4. Get API Gateway URL
After deployment, you'll see output like:
```
Service Information
service: ai-tutor-platform
stage: dev
region: us-east-2
api: https://XXXXXXXXXX.execute-api.us-east-2.amazonaws.com/dev
```

### 5. Update Frontend Config
Copy the API URL and update `client/src/config/aws-config.ts`:
```typescript
export const AWS_CONFIG = {
  apiBaseUrl: 'https://YOUR-NEW-API-GATEWAY-URL/dev',
  region: 'us-east-2',
  // ... rest of config
};
```

### 6. Enable AWS Mode
Update `client/.env.development`:
```
VITE_USE_AWS_API=true
```

## Monitoring & Logs
- View logs: `npx serverless logs -f getFiles --tail`
- Remove stack: `npx serverless remove`
- Check CloudFormation: AWS Console → CloudFormation → `ai-tutor-platform-dev`

## Troubleshooting
- Permission errors: Check IAM policies
- DynamoDB errors: Tables auto-created by CloudFormation
- S3 errors: Bucket auto-created with CORS enabled
- Cold starts: First API calls may be slow (Lambda warming up)
