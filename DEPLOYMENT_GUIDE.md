# AWS Integration Deployment Guide

## Overview
This guide explains how to deploy the AWS backend for EducatorView file operations while maintaining complete isolation from StudentView.

## What We've Implemented

### 1. AWS Infrastructure Extensions
- **New DynamoDB Table**: `ai-tutor-app-educator-files-dev` for educator file metadata
- **New Lambda Functions**: Educator-specific file CRUD operations
- **New API Gateway Endpoints**: `/educator/files/*` for internal AWS communication
- **S3 Integration**: Educator files stored under `/educator/` path prefix

### 2. Express Server Proxy
- **Transparent Integration**: EducatorView components unchanged
- **AWS Detection**: Automatically uses AWS when available, falls back to local storage
- **Same API Contract**: `/api/files` endpoints work identically
- **Test Endpoint**: `/api/aws/test` for connection verification

### 3. Frontend Enhancements
- **AWS Test Component**: Added to EducatorView for monitoring integration status
- **Zero Component Changes**: Existing file operations work identically
- **Enhanced Error Handling**: Graceful fallback to local storage

## Deployment Steps

### Step 1: Configure AWS Credentials
```bash
# Configure AWS CLI
aws configure
# Enter your AWS Access Key ID, Secret Access Key, Region (us-east-2), and output format (json)
```

### Step 2: Deploy AWS Infrastructure
```bash
# Navigate to AWS directory
cd aws

# Install dependencies
npm install

# Deploy to AWS
npx serverless deploy --stage dev --region us-east-2

# Note the API Gateway URL from the deployment output
```

### Step 3: Configure Express Server
```bash
# Create environment file in server directory
cd ../server
cp .env.example .env

# Edit .env file and add your API Gateway URL:
# AWS_API_URL=https://your-actual-api-gateway-url.execute-api.us-east-2.amazonaws.com/dev
```

### Step 4: Test Integration
```bash
# Start the application
npm run dev

# Navigate to EducatorView in browser
# Use the AWS Test component to verify connection
```

## Verification Checklist

### StudentView Protection ✅
- [ ] StudentView loads normally
- [ ] Student file operations work unchanged
- [ ] Student chat functionality intact
- [ ] No API endpoint conflicts

### EducatorView Enhancement ✅
- [ ] AWS Test component shows integration status
- [ ] File upload works (AWS or local fallback)
- [ ] File listing displays correctly
- [ ] File deletion functions properly
- [ ] File download operates normally

### AWS Integration ✅
- [ ] Lambda functions deploy successfully
- [ ] DynamoDB table created with proper indexes
- [ ] API Gateway endpoints accessible
- [ ] S3 bucket configured for educator files
- [ ] IAM permissions working correctly

## Architecture Overview

```
EducatorView Frontend (Unchanged)
         ↓
Express Server (/api/files)
         ↓
    [AWS Available?]
         ↓
    ┌─────Yes─────┐        ┌─────No─────┐
    ↓             ↓        ↓            ↓
AWS Lambda     Local     Local        Local
Functions      Proxy     JSON         Files
    ↓             ↓        ↓            ↓
DynamoDB       S3      files.json   uploads/
educator-      educator
files          path
```

## Troubleshooting

### AWS Connection Issues
1. **Check API Gateway URL**: Verify the URL in server/.env is correct
2. **Check AWS Credentials**: Ensure AWS CLI is configured properly
3. **Check IAM Permissions**: Verify Lambda execution role has DynamoDB/S3 access
4. **Check CORS**: Ensure API Gateway has CORS enabled

### Local Fallback Issues
1. **Check Express Server**: Ensure server is running on port 3001
2. **Check File Permissions**: Verify uploads directory is writable
3. **Check JSON Files**: Ensure server/data/*.json files exist

### Frontend Issues
1. **Check Component Import**: Verify AWSTest component imported correctly
2. **Check API Calls**: Verify EducatorView still calls /api/files endpoints
3. **Check Build**: Run `npm run build` to check for TypeScript errors

## Cost Considerations

### AWS Resources Created
- **Lambda Functions**: 6 functions (pay per invocation)
- **DynamoDB Table**: 1 table (pay per request)
- **API Gateway**: 6 endpoints (pay per request)
- **S3 Storage**: Shared bucket with educator path (pay per GB)

### Expected Monthly Costs (Light Usage)
- Lambda: $1-5 (500-2000 invocations)
- DynamoDB: $1-3 (1000-5000 requests)
- API Gateway: $1-2 (1000-5000 requests)
- S3: $1-2 (1-10 GB storage)

**Total: $4-12/month for typical educator usage**

## Security Features

### Data Isolation
- **Separate DynamoDB Table**: No shared data with student tables
- **S3 Path Separation**: Educator files under `/educator/` prefix
- **IAM Role Separation**: Educator functions have isolated permissions

### Access Control
- **API Gateway Security**: Rate limiting and CORS protection
- **Lambda Validation**: Input validation and error handling
- **Express Proxy**: Additional security layer and request validation

## Future Enhancements

### Planned Features
1. **File Update Operations**: Complete UPDATE functionality via AWS
2. **Bulk Operations**: Multi-select file management
3. **Advanced Analytics**: File usage tracking and reporting
4. **Real-time Updates**: WebSocket integration for live updates

### Performance Optimizations
1. **Lambda Warming**: Reduce cold start latency
2. **DynamoDB Optimization**: Query optimization with proper indexes
3. **S3 Optimization**: CDN integration for faster file delivery
4. **Caching**: Redis integration for frequently accessed data

This integration provides a solid foundation for scaling educator file operations while maintaining complete isolation from student functionality.
