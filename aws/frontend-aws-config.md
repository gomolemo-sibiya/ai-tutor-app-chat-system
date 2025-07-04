# Frontend AWS Configuration

## After Successful Deployment

### 1. Get Your API Gateway URL
From the serverless deploy output, copy the API Gateway URL:
```
https://XXXXXXXXXX.execute-api.us-east-2.amazonaws.com/dev
```

### 2. Update Frontend Config
Edit `client/src/config/aws-config.ts`:

```typescript
export const AWS_CONFIG = {
  apiBaseUrl: 'https://YOUR_ACTUAL_API_GATEWAY_URL/dev', // Update this!
  region: 'us-east-2',
  // ... rest stays the same
};
```

### 3. Enable AWS Mode
Update `client/.env.development`:
```
VITE_USE_AWS_API=true
```

### 4. Restart Frontend
```bash
# Stop current dev server (Ctrl+C)
npm run dev
```

## Verification Steps
1. Open http://localhost:5174
2. Go to Student view
3. Click "AWS Test" tab
4. Run tests - should show real AWS responses!
5. Try other tabs - they should work with DynamoDB

## Expected Results
- ✅ Files tab: Connects to DynamoDB files table
- ✅ Chat tab: Creates/reads from DynamoDB chats table  
- ✅ AWS Test: Shows real API Gateway responses
- ✅ All data persists in AWS cloud!
