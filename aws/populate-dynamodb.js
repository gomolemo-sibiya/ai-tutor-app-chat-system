const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-2' });
const docClient = DynamoDBDocumentClient.from(client);

// Table names
const CHATS_TABLE = 'ai-tutor-complete-chats-dev';
const FILES_TABLE = 'ai-tutor-complete-files-dev';
const MESSAGES_TABLE = 'ai-tutor-complete-messages-dev';

// Dummy data
const dummyChats = [
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
  },
  {
    chatId: 'chat-003',
    studentId: 'user-1',
    queryType: 'module',
    module: 'DS201',
    title: 'Data Structures Help',
    notes: 'Questions about arrays and linked lists',
    createdAt: '2025-06-19T12:00:00.000Z',
    updatedAt: '2025-06-19T12:20:00.000Z',
    messageCount: 6
  }
];

const dummyMessages = [
  // Messages for chat-001
  {
    messageId: 'msg-001',
    chatId: 'chat-001',
    text: 'Can you explain the difference between variables and functions?',
    sender: 'student',
    timestamp: '2025-06-19T10:00:00.000Z'
  },
  {
    messageId: 'msg-002',
    chatId: 'chat-001',
    text: 'Variables store data values, while functions are blocks of code that perform tasks. Variables hold information like numbers or text, functions process that information.',
    sender: 'system',
    timestamp: '2025-06-19T10:01:00.000Z'
  },
  {
    messageId: 'msg-003',
    chatId: 'chat-001',
    text: 'Can you give me a practical example?',
    sender: 'student',
    timestamp: '2025-06-19T10:05:00.000Z'
  },
  {
    messageId: 'msg-004',
    chatId: 'chat-001',
    text: 'Sure! Variable: age = 25 (stores a number). Function: calculateBirthYear(age) { return 2025 - age; } (calculates birth year from age).',
    sender: 'system',
    timestamp: '2025-06-19T10:06:00.000Z'
  },
  
  // Messages for chat-002
  {
    messageId: 'msg-005',
    chatId: 'chat-002',
    text: 'What are effective study strategies for computer science?',
    sender: 'student',
    timestamp: '2025-06-19T11:00:00.000Z'
  },
  {
    messageId: 'msg-006',
    chatId: 'chat-002',
    text: 'Key strategies: 1) Practice coding daily, 2) Work on projects, 3) Join study groups, 4) Explain concepts to others, 5) Break complex problems into smaller parts.',
    sender: 'system',
    timestamp: '2025-06-19T11:01:00.000Z'
  },

  // Messages for chat-003
  {
    messageId: 'msg-007',
    chatId: 'chat-003',
    text: 'I\'m confused about the difference between arrays and linked lists',
    sender: 'student',
    timestamp: '2025-06-19T12:00:00.000Z'
  },
  {
    messageId: 'msg-008',
    chatId: 'chat-003',
    text: 'Arrays store elements in consecutive memory locations with fixed size. Linked lists store elements in nodes connected by pointers, with dynamic size.',
    sender: 'system',
    timestamp: '2025-06-19T12:02:00.000Z'
  },
  {
    messageId: 'msg-009',
    chatId: 'chat-003',
    text: 'Which one is better for searching?',
    sender: 'student',
    timestamp: '2025-06-19T12:10:00.000Z'
  },
  {
    messageId: 'msg-010',
    chatId: 'chat-003',
    text: 'Arrays are better for searching: O(1) for index access, O(log n) for binary search. Linked lists require O(n) for search since you must traverse from the head.',
    sender: 'system',
    timestamp: '2025-06-19T12:11:00.000Z'
  }
];

const dummyFiles = [
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

async function populateTable(tableName, items, itemName) {
  console.log(`\n📦 Populating ${tableName} with ${items.length} ${itemName}...`);
  
  // Check if table already has data
  try {
    const scanResult = await docClient.send(new ScanCommand({
      TableName: tableName,
      Limit: 1
    }));
    
    if (scanResult.Items && scanResult.Items.length > 0) {
      console.log(`⚠️  ${tableName} already contains data. Skipping...`);
      return;
    }
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') {
      console.log(`⚠️  Table ${tableName} does not exist. Trying to populate anyway...`);
      // Continue to populate even if scan fails
    } else {
      console.log(`❌ Error checking ${tableName}:`, error.message);
      return;
    }
  }

  // Insert items
  for (const item of items) {
    try {
      await docClient.send(new PutCommand({
        TableName: tableName,
        Item: item
      }));
      console.log(`✅ Added ${itemName.slice(0, -1)}: ${item[Object.keys(item)[0]]}`);
    } catch (error) {
      console.log(`❌ Failed to add ${item[Object.keys(item)[0]]}:`, error.message);
    }
  }
}

async function main() {
  console.log('🚀 Starting DynamoDB population script...\n');
  console.log('📋 Tables to populate:');
  console.log(`   - ${CHATS_TABLE}`);
  console.log(`   - ${MESSAGES_TABLE}`);
  console.log(`   - ${FILES_TABLE}`);

  try {
    // Populate chats
    await populateTable(CHATS_TABLE, dummyChats, 'chats');
    
    // Populate messages
    await populateTable(MESSAGES_TABLE, dummyMessages, 'messages');
    
    // Populate files
    await populateTable(FILES_TABLE, dummyFiles, 'files');
    
    console.log('\n🎉 DynamoDB population completed!');
    console.log('\n📊 Summary:');
    console.log(`   - ${dummyChats.length} chat conversations`);
    console.log(`   - ${dummyMessages.length} messages`);
    console.log(`   - ${dummyFiles.length} files`);
    console.log('\n✨ Your app now has realistic test data!');
    
  } catch (error) {
    console.error('❌ Error populating DynamoDB:', error);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };
