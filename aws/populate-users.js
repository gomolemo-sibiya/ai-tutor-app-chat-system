const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-2' });
const docClient = DynamoDBDocumentClient.from(client);

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

async function populateUsers() {
  const tableName = 'ai-tutor-complete-users-dev';
  
  for (const user of users) {
    try {
      const command = new PutCommand({
        TableName: tableName,
        Item: user
      });
      
      await docClient.send(command);
      console.log(`Added user: ${user.details.name} ${user.details.surname}`);
    } catch (error) {
      console.error(`Error adding user ${user.details.name}:`, error);
    }
  }
}

populateUsers().then(() => {
  console.log('Users population completed!');
}).catch(console.error);
