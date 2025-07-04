#!/usr/bin/env node

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-2' });
const docClient = DynamoDBDocumentClient.from(client);

async function populateTables() {
  console.log('🚀 Populating ai-tutor-app tables...\n');

  // Populate Files Table
  const files = [
    {
      fileId: 'file-001',
      fileName: 'CS101_Variables_and_Functions.pdf',
      moduleCode: 'CS101',
      lecturer: 'Dr. Smith',
      fileType: 'Document',
      description: 'Introduction to variables and functions in programming',
      contentType: 'application/pdf',
      fileSize: 2048576,
      uploadDate: '2025-06-15T09:00:00.000Z',
      s3Key: 'files/file-001/CS101_Variables_and_Functions.pdf'
    },
    {
      fileId: 'file-002',
      fileName: 'DS201_Arrays_vs_LinkedLists.pdf',
      moduleCode: 'DS201',
      lecturer: 'Prof. Johnson',
      fileType: 'Document',
      description: 'Comparison of arrays and linked list data structures',
      contentType: 'application/pdf',
      fileSize: 1536000,
      uploadDate: '2025-06-16T14:30:00.000Z',
      s3Key: 'files/file-002/DS201_Arrays_vs_LinkedLists.pdf'
    },
    {
      fileId: 'file-003',
      fileName: 'Programming_Best_Practices.pdf',
      moduleCode: 'SE401',
      lecturer: 'Dr. Williams',
      fileType: 'Document',
      description: 'Software engineering best practices and coding standards',
      contentType: 'application/pdf',
      fileSize: 3072000,
      uploadDate: '2025-06-17T11:15:00.000Z',
      s3Key: 'files/file-003/Programming_Best_Practices.pdf'
    }
  ];

  // Populate Users Table
  const users = [
    {
      id: 'user-001',
      role: 'educator',
      details: {
        title: 'Dr.',
        name: 'John',
        surname: 'Smith',
        email: 'john.smith@university.edu'
      },
      modules: ['CS101', 'SE401']
    },
    {
      id: 'user-002',
      role: 'educator',
      details: {
        title: 'Prof.',
        name: 'Sarah',
        surname: 'Johnson',
        email: 'sarah.johnson@university.edu'
      },
      modules: ['DS201']
    },
    {
      id: 'user-003',
      role: 'student',
      details: {
        title: 'Mr.',
        name: 'Michael',
        surname: 'Brown',
        email: 'michael.brown@student.edu'
      },
      modules: ['CS101', 'DS201'],
      studentId: 'student-001'
    },
    {
      id: 'user-004',
      role: 'student',
      details: {
        title: 'Ms.',
        name: 'Emily',
        surname: 'Davis',
        email: 'emily.davis@student.edu'
      },
      modules: ['CS101', 'SE401'],
      studentId: 'student-002'
    },
    {
      id: 'user-005',
      role: 'admin',
      details: {
        title: 'Dr.',
        name: 'Admin',
        surname: 'User',
        email: 'admin@university.edu'
      }
    }
  ];

  // Populate Chats Table
  const chats = [
    {
      chatId: 'chat-001',
      studentId: 'student-001',
      title: 'CS101 Questions',
      type: 'module',
      moduleCode: 'CS101',
      timestamp: '2025-06-20T10:30:00.000Z',
      lastMessage: 'Can you explain variable scope?'
    },
    {
      chatId: 'chat-002',
      studentId: 'student-002',
      title: 'General Programming Help',
      type: 'general',
      timestamp: '2025-06-21T14:15:00.000Z',
      lastMessage: 'What are the best practices for code organization?'
    }
  ];

  // Populate Messages Table
  const messages = [
    {
      messageId: 'msg-001',
      chatId: 'chat-001',
      sender: 'student',
      message: 'Can you explain variable scope in programming?',
      timestamp: '2025-06-20T10:30:00.000Z'
    },
    {
      messageId: 'msg-002',
      chatId: 'chat-001',
      sender: 'ai',
      message: 'Variable scope refers to where variables can be accessed in your code. There are local and global scopes...',
      timestamp: '2025-06-20T10:31:00.000Z'
    },
    {
      messageId: 'msg-003',
      chatId: 'chat-002',
      sender: 'student',
      message: 'What are the best practices for code organization?',
      timestamp: '2025-06-21T14:15:00.000Z'
    },
    {
      messageId: 'msg-004',
      chatId: 'chat-002',
      sender: 'ai',
      message: 'Good code organization includes using meaningful names, proper indentation, comments, and modular design...',
      timestamp: '2025-06-21T14:16:00.000Z'
    }
  ];

  try {
    // Insert Files
    for (const file of files) {
      await docClient.send(new PutCommand({
        TableName: 'ai-tutor-app-files-dev',
        Item: file
      }));
    }
    console.log('✅ Files inserted');

    // Insert Users
    for (const user of users) {
      await docClient.send(new PutCommand({
        TableName: 'ai-tutor-app-users-dev',
        Item: user
      }));
    }
    console.log('✅ Users inserted');

    // Insert Chats
    for (const chat of chats) {
      await docClient.send(new PutCommand({
        TableName: 'ai-tutor-app-chats-dev',
        Item: chat
      }));
    }
    console.log('✅ Chats inserted');

    // Insert Messages
    for (const message of messages) {
      await docClient.send(new PutCommand({
        TableName: 'ai-tutor-app-messages-dev',
        Item: message
      }));
    }
    console.log('✅ Messages inserted');

    console.log('\n🎉 All tables populated successfully!');
    
  } catch (error) {
    console.error('❌ Error populating tables:', error);
  }
}

populateTables();
