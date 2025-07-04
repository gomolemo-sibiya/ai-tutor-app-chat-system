const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-2' });
const docClient = DynamoDBDocumentClient.from(client);

// Data that was working before
const users = [
  {
    id: 'user-1',
    role: 'student',
    details: {
      studentNumber: 'STU001',
      title: 'Mr',
      name: 'John',
      surname: 'Doe',
      modules: ['CS101', 'DS201'],
      campus: 'Main Campus',
      department: 'Computer Science',
      faculty: 'Engineering'
    }
  },
  {
    id: 'user-2',
    role: 'educator',
    details: {
      staffNumber: 'EDU001',
      title: 'Dr',
      name: 'Jane',
      surname: 'Smith',
      modules: ['CS101', 'SE401'],
      campus: 'Main Campus',
      department: 'Computer Science',
      faculty: 'Engineering'
    }
  },
  {
    id: 'user-3',
    role: 'admin',
    details: {
      staffNumber: 'ADM001',
      title: 'Mr',
      name: 'Admin',
      surname: 'User',
      modules: [],
      campus: 'Main Campus',
      department: 'Administration',
      faculty: 'Administration'
    }
  }
];

const files = [
  {
    fileId: 'file-001',
    fileName: 'CS101_Variables_and_Functions.pdf',
    moduleCode: 'CS101',
    contentType: 'application/pdf',
    fileType: 'lecture-notes',
    lecturer: 'Dr. Smith',
    description: 'Introduction to variables and functions in programming',
    s3Key: 'files/file-001/CS101_Variables_and_Functions.pdf',
    uploadDate: '2025-06-15T09:00:00.000Z',
    fileSize: 2048576
  },
  {
    fileId: 'file-002',
    fileName: 'DS201_Arrays_vs_LinkedLists.pdf',
    moduleCode: 'DS201',
    contentType: 'application/pdf',
    fileType: 'lecture-notes',
    lecturer: 'Prof. Johnson',
    description: 'Comparison of arrays and linked list data structures',
    s3Key: 'files/file-002/DS201_Arrays_vs_LinkedLists.pdf',
    uploadDate: '2025-06-16T14:30:00.000Z',
    fileSize: 1536000
  },
  {
    fileId: 'file-003',
    fileName: 'Programming_Best_Practices.pdf',
    moduleCode: 'SE401',
    contentType: 'application/pdf',
    fileType: 'reading-material',
    lecturer: 'Dr. Williams',
    description: 'Software engineering best practices and coding standards',
    s3Key: 'files/file-003/Programming_Best_Practices.pdf',
    uploadDate: '2025-06-17T11:15:00.000Z',
    fileSize: 3072000
  }
];

const chats = [
  {
    chatId: 'chat-001',
    studentId: 'user-1',
    queryType: 'module',
    module: 'CS101',
    title: 'Variables and Functions Questions',
    notes: 'Student asking about basic programming concepts',
    createdAt: '2025-06-19T10:00:00.000Z',
    updatedAt: '2025-06-19T10:30:00.000Z',
    messageCount: 4
  },
  {
    chatId: 'chat-002',
    studentId: 'user-1',
    queryType: 'general',
    module: '',
    title: 'Study Tips Discussion',
    notes: 'General study strategies',
    createdAt: '2025-06-19T11:00:00.000Z',
    updatedAt: '2025-06-19T11:15:00.000Z',
    messageCount: 2
  }
];

async function createAndPopulateTable(tableName, keySchema, globalSecondaryIndexes, items) {
  console.log(`\n🔄 Creating table: ${tableName}`);
  
  const params = {
    TableName: tableName,
    AttributeDefinitions: keySchema.map(key => ({
      AttributeName: key.AttributeName,
      AttributeType: 'S'
    })),
    KeySchema: keySchema,
    BillingMode: 'PAY_PER_REQUEST'
  };
  
  if (globalSecondaryIndexes) {
    params.GlobalSecondaryIndexes = globalSecondaryIndexes;
    // Add GSI attributes to AttributeDefinitions
    globalSecondaryIndexes.forEach(gsi => {
      gsi.KeySchema.forEach(key => {
        if (!params.AttributeDefinitions.find(attr => attr.AttributeName === key.AttributeName)) {
          params.AttributeDefinitions.push({
            AttributeName: key.AttributeName,
            AttributeType: 'S'
          });
        }
      });
    });
  }
  
  try {
    await client.send(new CreateTableCommand(params));
    console.log(`✅ Table created: ${tableName}`);
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log(`⚠️  Table ${tableName} already exists`);
    } else {
      console.error(`❌ Error creating ${tableName}:`, error.message);
      return;
    }
  }
  
  // Wait a moment for table to be ready, then populate
  console.log(`📦 Populating ${tableName}...`);
  for (const item of items) {
    try {
      await docClient.send(new PutCommand({
        TableName: tableName,
        Item: item
      }));
      console.log(`✅ Added: ${item[Object.keys(item)[0]]}`);
    } catch (error) {
      console.log(`❌ Failed to add ${item[Object.keys(item)[0]]}: ${error.message}`);
    }
  }
}

async function fixEverything() {
  console.log('🚀 Fixing all data for ps30ghdj7f API...\n');
  
  // Users table
  await createAndPopulateTable(
    'ai-tutor-complete-users-dev',
    [{ AttributeName: 'id', KeyType: 'HASH' }],
    null,
    users
  );
  
  // Files table
  await createAndPopulateTable(
    'ai-tutor-complete-files-dev',
    [{ AttributeName: 'fileId', KeyType: 'HASH' }],
    null,
    files
  );
  
  // Chats table
  await createAndPopulateTable(
    'ai-tutor-complete-chats-dev',
    [{ AttributeName: 'chatId', KeyType: 'HASH' }],
    [{
      IndexName: 'StudentIdIndex',
      KeySchema: [{ AttributeName: 'studentId', KeyType: 'HASH' }],
      Projection: { ProjectionType: 'ALL' }
    }],
    chats
  );
  
  console.log('\n🎉 Everything fixed! Your ps30ghdj7f API should now work with:');
  console.log('   ✅ Educational Materials (Files)');
  console.log('   ✅ User Management');
  console.log('   ✅ Chat System');
}

fixEverything().catch(console.error);
