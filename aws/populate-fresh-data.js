const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
  region: 'us-east-2'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

// Table names
const USERS_TABLE = 'ai-tutor-app-users-dev';
const FILES_TABLE = 'ai-tutor-app-files-dev';

// Sample users data
const users = [
  {
    id: '1',
    role: 'admin',
    details: {
      title: 'Dr.',
      name: 'Sarah',
      surname: 'Admin',
      modules: ['ALL'],
      email: 'admin@university.edu'
    }
  },
  {
    id: '2',
    role: 'educator',
    details: {
      title: 'Dr.',
      name: 'John',
      surname: 'Smith',
      modules: ['CS101', 'DS201'],
      email: 'john.smith@university.edu'
    }
  },
  {
    id: '3',
    role: 'student',
    details: {
      title: '',
      name: 'Alice',
      surname: 'Johnson',
      modules: ['CS101', 'DS201', 'INF301'],
      email: 'alice.johnson@student.edu'
    }
  },
  {
    id: '4',
    role: 'educator',
    details: {
      title: 'Prof.',
      name: 'Maria',
      surname: 'Garcia',
      modules: ['INF301', 'SE401'],
      email: 'maria.garcia@university.edu'
    }
  },
  {
    id: '5',
    role: 'student',
    details: {
      title: '',
      name: 'Bob',
      surname: 'Wilson',
      modules: ['CS101', 'SE401'],
      email: 'bob.wilson@student.edu'
    }
  }
];

// Sample files data
const files = [
  {
    fileId: 'file-1',
    fileName: 'Introduction to Programming.pdf',
    moduleCode: 'CS101',
    contentType: 'Document',
    lecturer: 'Dr. John Smith',
    description: 'Basic programming concepts and syntax',
    fileType: 'Document',
    uploadDate: '2025-06-15T10:00:00.000Z',
    s3Key: 'cs101/intro-programming.pdf'
  },
  {
    fileId: 'file-2',
    fileName: 'Data Structures Lecture 1.mp4',
    moduleCode: 'DS201',
    contentType: 'Video',
    lecturer: 'Dr. John Smith',
    description: 'Introduction to arrays and linked lists',
    fileType: 'Video',
    uploadDate: '2025-06-16T14:30:00.000Z',
    s3Key: 'ds201/lecture1.mp4'
  },
  {
    fileId: 'file-3',
    fileName: 'Database Design Principles.pdf',
    moduleCode: 'INF301',
    contentType: 'Document',
    lecturer: 'Prof. Maria Garcia',
    description: 'Fundamentals of database design and normalization',
    fileType: 'Document',
    uploadDate: '2025-06-17T09:15:00.000Z',
    s3Key: 'inf301/db-design.pdf'
  },
  {
    fileId: 'file-4',
    fileName: 'Software Engineering Best Practices.pdf',
    moduleCode: 'SE401',
    contentType: 'Document',
    lecturer: 'Prof. Maria Garcia',
    description: 'Industry standards and development methodologies',
    fileType: 'Document',
    uploadDate: '2025-06-18T11:45:00.000Z',
    s3Key: 'se401/best-practices.pdf'
  }
];

async function populateUsers() {
  console.log('🔄 Populating users table...');
  
  for (const user of users) {
    try {
      await dynamodb.put({
        TableName: USERS_TABLE,
        Item: user
      }).promise();
      
      console.log(`✅ Added ${user.role}: ${user.details.title} ${user.details.name} ${user.details.surname}`);
    } catch (error) {
      console.error(`❌ Failed to add user ${user.id}:`, error.message);
    }
  }
}

async function populateFiles() {
  console.log('🔄 Populating files table...');
  
  for (const file of files) {
    try {
      await dynamodb.put({
        TableName: FILES_TABLE,
        Item: file
      }).promise();
      
      console.log(`✅ Added file: ${file.fileName} (${file.moduleCode})`);
    } catch (error) {
      console.error(`❌ Failed to add file ${file.fileId}:`, error.message);
    }
  }
}

async function verifyData() {
  console.log('🔍 Verifying populated data...');
  
  try {
    // Check users
    const usersResult = await dynamodb.scan({
      TableName: USERS_TABLE
    }).promise();
    
    console.log(`📊 Users table: ${usersResult.Items.length} records`);
    usersResult.Items.forEach(user => {
      console.log(`  - ${user.role}: ${user.details.name} ${user.details.surname}`);
    });
    
    // Check files
    const filesResult = await dynamodb.scan({
      TableName: FILES_TABLE
    }).promise();
    
    console.log(`📊 Files table: ${filesResult.Items.length} records`);
    filesResult.Items.forEach(file => {
      console.log(`  - ${file.fileName} (${file.moduleCode})`);
    });
    
  } catch (error) {
    console.error('❌ Error verifying data:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting fresh data population...');
  console.log('📍 Region: us-east-2');
  console.log('📍 Users Table:', USERS_TABLE);
  console.log('📍 Files Table:', FILES_TABLE);
  console.log('');
  
  try {
    await populateUsers();
    console.log('');
    await populateFiles();
    console.log('');
    await verifyData();
    console.log('');
    console.log('✨ Data population completed successfully!');
    console.log('');
    console.log('🎯 You can now test:');
    console.log('   - AdminView: Should show admin user');
    console.log('   - EducatorView: Should load educator data');
    console.log('   - StudentView: Should show associated educators and files');
    
  } catch (error) {
    console.error('💥 Population failed:', error.message);
    process.exit(1);
  }
}

// Run the population
main();
